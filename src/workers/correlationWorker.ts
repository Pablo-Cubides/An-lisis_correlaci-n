import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { calculateCorrelations } from '../app/utils'

// Store parsed data in memory
let parsedData: Record<string, unknown>[] = []

function getNumericHeaders(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return []
  const headers = Object.keys(rows[0])
  return headers.filter(header => {
    // Check a sample of rows to see if the column is numeric
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const value = rows[i][header]
      if (typeof value !== 'number') {
        return false
      }
    }
    return true
  })
}

self.addEventListener('message', async (e: MessageEvent) => {
  const { type, payload } = e.data

  try {
    if (type === 'parse') {
      const { fileBuffer, fileType, sheetToUse } = payload
      let rows: Record<string, unknown>[] = []

      if (fileType === 'csv') {
        const text = new TextDecoder().decode(fileBuffer)
        const parsed = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true })
        rows = parsed.data as Record<string, unknown>[]
      } else {
        const workbook = XLSX.read(fileBuffer, { type: 'array' })
        const sheetName = sheetToUse || workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        rows = XLSX.utils.sheet_to_json(worksheet)
      }

      // Clean and type-convert rows
      parsedData = rows.map(row => {
        const cleanRow: Record<string, unknown> = {}
        for (const key in row) {
          const trimmedKey = key.trim()
          if (trimmedKey) {
            let value = row[key]
            if (typeof value === 'string') {
              const num = parseFloat(value)
              if (!isNaN(num) && isFinite(num)) {
                value = num
              }
            }
            cleanRow[trimmedKey] = value
          }
        }
        return cleanRow
      })

      const numericHeaders = getNumericHeaders(parsedData)

      if (numericHeaders.length < 2) {
        self.postMessage({ type: 'error', payload: 'El archivo subido no contiene al menos dos columnas numéricas.' })
        return
      }

      self.postMessage({ type: 'headers', payload: numericHeaders })
    } else if (type === 'calculate') {
      const { selectedColumns } = payload
      
      if (!parsedData || parsedData.length === 0) {
        self.postMessage({ type: 'error', payload: 'No hay datos disponibles para analizar. Por favor, sube un archivo primero.' })
        return
      }

      // Filter data based on selected columns
      const dataToAnalyze = parsedData.map(row => {
        const newRow: Record<string, unknown> = {}
        selectedColumns.forEach((col: string) => {
          newRow[col] = row[col]
        })
        return newRow
      })

      const result = calculateCorrelations(dataToAnalyze)
      self.postMessage({ type: 'result', payload: result })
      parsedData = [] // Clear data after analysis
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    self.postMessage({ type: 'error', payload: message || 'Ocurrió un error inesperado durante el procesamiento.' })
  }
})
