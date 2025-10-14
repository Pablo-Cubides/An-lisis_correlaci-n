'use client'
import React, { useState } from 'react'
import FileUploader from '../components/FileUploader'
import CorrelationTable from '../components/CorrelationTable'
import ResultsSection from './ResultsSection'
import ErrorModal from '../components/ErrorModal'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { sampleCorrelation } from 'simple-statistics'

// Función para calcular correlación de Pearson
function pearsonCorrelation(x: number[], y: number[]): number {
  return sampleCorrelation(x, y)
}

// Función para calcular correlación de Spearman (implementación básica)
function spearmanCorrelation(x: number[], y: number[]): number {
  const n = x.length
  const rankX = x.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val).map((item, rank) => rank + 1)
  const rankY = y.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val).map((item, rank) => rank + 1)
  return sampleCorrelation(rankX, rankY)
}

// Función para calcular correlación de Kendall (implementación básica)
function kendallCorrelation(x: number[], y: number[]): number {
  let concordant = 0
  let discordant = 0
  for (let i = 0; i < x.length; i++) {
    for (let j = i + 1; j < x.length; j++) {
      const signX = Math.sign(x[j] - x[i])
      const signY = Math.sign(y[j] - y[i])
      if (signX === signY) concordant++
      else if (signX !== signY) discordant++
    }
  }
  return (concordant - discordant) / (concordant + discordant)
}

// Función para parsear archivo con mejor manejo de errores
async function parseFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Papa parse results:', results)
          if (results.errors.length > 0) {
            console.log('Errores CSV:', results.errors)
            reject(new Error('Error parsing CSV: ' + results.errors[0].message))
          } else {
            // Filtrar filas válidas y convertir valores a números donde sea posible
            const validData = results.data.filter((row: any) => {
              return row && Object.keys(row).length > 0 && Object.values(row).some(val => val !== null && val !== '')
            }).map((row: any) => {
              const cleanRow: any = {}
              Object.keys(row).forEach(key => {
                if (key && key.trim()) {
                  const cleanKey = key.trim()
                  let value = row[key]
                  if (typeof value === 'string' && value.trim()) {
                    const num = parseFloat(value.trim())
                    if (!isNaN(num) && isFinite(num)) {
                      value = num
                    }
                  }
                  cleanRow[cleanKey] = value
                }
              })
              return cleanRow
            })
            console.log('Datos procesados:', validData)
            resolve(validData)
          }
        },
        error: (error) => {
          console.log('Error Papa parse:', error)
          reject(error)
        }
      })
    } else if (file.name.endsWith('.xlsx')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        // Convertir a array de objetos
        const headers = json[0] as string[]
        const rows = json.slice(1).map((row: any) => {
          const obj: any = {}
          headers.forEach((header, idx) => {
            obj[header] = row[idx]
          })
          return obj
        })
        resolve(rows)
      }
      reader.onerror = () => reject(new Error('Error reading Excel file'))
      reader.readAsArrayBuffer(file)
    } else {
      reject(new Error('Unsupported file type'))
    }
  })
}

// Función para calcular correlaciones
function calculateCorrelations(data: any[]): { correlation_results: any[], numeric_columns: string[], raw_data: any[] } {
  const numericColumns = Object.keys(data[0] || {}).filter(key => {
    return data.some(row => typeof row[key] === 'number' && !isNaN(row[key]))
  })

  if (numericColumns.length < 2) {
    throw new Error('El archivo debe contener al menos dos columnas numéricas.')
  }

  const results = []
  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i]
      const col2 = numericColumns[j]

      const pairs = data
        .map(row => ({ x: row[col1], y: row[col2] }))
        .filter(pair => typeof pair.x === 'number' && typeof pair.y === 'number' && !isNaN(pair.x) && !isNaN(pair.y))

      if (pairs.length < 2) continue

      const xVals = pairs.map(p => p.x)
      const yVals = pairs.map(p => p.y)

      let pearson = null
      let spearman = null
      let kendall = null

      try {
        pearson = pearsonCorrelation(xVals, yVals)
      } catch {}

      try {
        spearman = spearmanCorrelation(xVals, yVals)
      } catch {}

      try {
        kendall = kendallCorrelation(xVals, yVals)
      } catch {}

      results.push({
        column_a: col1,
        column_b: col2,
        pearson: pearson !== null ? parseFloat(pearson.toFixed(4)) : null,
        spearman: spearman !== null ? parseFloat(spearman.toFixed(4)) : null,
        kendall: kendall !== null ? parseFloat(kendall.toFixed(4)) : null,
      })
    }
  }

  return {
    correlation_results: results,
    numeric_columns: numericColumns,
    raw_data: data
  }
}

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  // Función para descargar archivo de ejemplo programáticamente
  const downloadExample = () => {
    const csvContent = `Columna A,Columna B,Columna C,Columna D
1,2,5,10
2,4,3,8
3,6,7,6
4,8,2,4
5,10,9,2
6,12,1,0
7,14,6,-2
8,16,4,-4
9,18,8,-6
10,20,3,-8
11,22,10,-10
12,24,12,-12
13,26,14,-14
14,28,16,-16
15,30,18,-18
16,32,20,-20
17,34,22,-22
18,36,24,-24
19,38,26,-26
20,40,28,-28
21,42,30,-30
22,44,32,-32
23,46,34,-34
24,48,36,-36
25,50,38,-38`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'ejemplo_correlaciones.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async function handleUpload(file: File) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await parseFile(file)
      const resultData = calculateCorrelations(data)
      setResult({
        filename: file.name,
        ...resultData
      })
    } catch (err: any) {
      setError(err.message || 'Error al procesar el archivo.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <section className="flex flex-col w-full max-w-2xl gap-8 p-8 mx-auto bg-white rounded-lg shadow">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full bg-primary">RI</div>
        <h1 className="text-2xl font-bold text-primary">Relational Insight</h1>
        <p className="text-center text-gray-500">
          Sube un archivo <strong>.csv</strong> o <strong>.xlsx</strong> para analizar correlaciones entre columnas numéricas.
        </p>
        <div className="text-sm text-gray-600 text-center max-w-md">
          <p className="mb-2">
            <strong>Formato requerido:</strong> El archivo debe tener al menos dos columnas con valores numéricos.
            Las filas con valores no numéricos o vacíos serán ignoradas.
          </p>
          <p className="mb-2">
            <strong>Cómo usar:</strong> Descarga el archivo de ejemplo, reemplaza los datos con los tuyos y súbelo.
          </p>
          <a
            href="/example.csv"
            download="ejemplo_correlaciones.csv"
            className="inline-block px-4 py-2 text-white bg-primary rounded hover:bg-primary/80 transition-colors"
          >
            📥 Descargar archivo de ejemplo
          </a>
        </div>
      </div>
      <FileUploader onUpload={handleUpload} loading={loading} />
      {error && (
        <ErrorModal message={error} onClose={() => setError(null)} />
      )}
      {loading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-primary">
          <span className="animate-spin">🔄</span> Analizando archivo…
        </div>
      )}
      {result && (
        <ResultsSection result={result} />
      )}


    </section>
  )
}
