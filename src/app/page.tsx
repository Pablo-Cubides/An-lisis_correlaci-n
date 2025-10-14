"use client"
import React, { useState, useRef, useEffect } from 'react'
import FileUploader from '../components/FileUploader'
import ResultsSection from './ResultsSection'
import ErrorModal from '../components/ErrorModal'
import SheetSelectorModal from '../components/SheetSelectorModal'
import ColumnSelectorModal from '../components/ColumnSelectorModal'
import type { Row, CorrelationResult } from './utils'

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ filename: string; correlation_results: CorrelationResult[]; numeric_columns: string[]; raw_data: Row[] } | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  // Use ref to hold pending file to avoid stale closures
  // state for UI doesn't need to track the file itself

  // State for sheet selection
  const [sheetModalOpen, setSheetModalOpen] = useState(false)
  const [sheetOptions, setSheetOptions] = useState<string[] | null>(null)

  // State for column selection
  const [columnModalOpen, setColumnModalOpen] = useState(false)
  const [numericColumns, setNumericColumns] = useState<string[]>([])

  const workerRef = useRef<Worker | null>(null)
  const pendingFileRef = useRef<File | null>(null)

  useEffect(() => {
    // Initialize worker once
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../workers/correlationWorker.ts', import.meta.url), { type: 'module' })
      workerRef.current.onmessage = (e: MessageEvent) => {
        const { type, payload } = e.data
        setLoading(false)
        setProgress(null)

        if (type === 'headers') {
          setNumericColumns(payload)
          setColumnModalOpen(true)
        } else if (type === 'result') {
          const filename = pendingFileRef.current?.name || 'analysis'
          setResult({ filename, ...payload })
        } else if (type === 'error') {
          setError(payload)
        }
      }
    }

    // Cleanup worker on component unmount
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  async function handleUpload(file: File) {
    setLoading(true)
    setError(null)
    setResult(null)
  pendingFileRef.current = file
    setProgress('Leyendo archivo...')

    try {
      const fileBuffer = await file.arrayBuffer()
      const fileType = file.name.endsWith('.csv') ? 'csv' : 'xlsx'

      // For XLSX, first get sheet names if not a re-upload for sheet selection
      if (fileType === 'xlsx') {
        const XLSX = await import('xlsx')
        const workbook = XLSX.read(fileBuffer, { type: 'array' })
        if (workbook.SheetNames.length > 1) {
          setSheetOptions(workbook.SheetNames)
          setSheetModalOpen(true)
          setProgress('Por favor, selecciona una hoja.')
          return // Wait for user to select a sheet
        }
      }

      // If CSV or single-sheet XLSX, parse immediately
      setProgress('Analizando archivo e identificando columnas...')
  workerRef.current?.postMessage({ type: 'parse', payload: { fileBuffer, fileType } }, [fileBuffer])

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Error al procesar el archivo.')
      setLoading(false)
    }
  }

  async function handleSheetSelect(sheetName: string) {
    setSheetModalOpen(false)
  if (!pendingFileRef.current) return

    setLoading(true)
    setProgress('Leyendo la hoja seleccionada...')
    try {
  const fileBuffer = await pendingFileRef.current!.arrayBuffer()
  workerRef.current?.postMessage({ type: 'parse', payload: { fileBuffer, fileType: 'xlsx', sheetToUse: sheetName } }, [fileBuffer])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Error al procesar la hoja seleccionada.')
      setLoading(false)
    }
  }

  function handleColumnConfirm(selectedColumns: string[]) {
    setColumnModalOpen(false)
    if (selectedColumns.length < 2) {
      setError('Por favor, selecciona al menos dos columnas para analizar.')
      return
    }
    setLoading(true)
    setProgress('Calculando correlaciones...')
    workerRef.current?.postMessage({ type: 'calculate', payload: { selectedColumns } })
  }

  function handleCloseModals() {
    setSheetModalOpen(false)
    setColumnModalOpen(false)
    setLoading(false)
    setProgress(null)
  }

  return (
    <section className="flex flex-col w-full max-w-2xl gap-8 p-8 mx-auto bg-white rounded-lg shadow">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full bg-primary">AR</div>
        <h1 className="text-2xl font-bold text-primary">Análisis Relacional</h1>
        <p className="text-center text-gray-500">
          Sube un archivo <strong>.csv</strong> o <strong>.xlsx</strong> para analizar las correlaciones entre las columnas numéricas.
        </p>
        <div className="max-w-md text-sm text-center text-gray-600">
          <p className="mb-2">
            <strong>Formato Requerido:</strong> El archivo debe contener al menos dos columnas con valores numéricos.
            Las filas con valores no numéricos o vacíos serán ignoradas.
          </p>
          <a
            href="/example.csv"
            download="correlation_example.csv"
            className="inline-block px-4 py-2 text-white transition-colors rounded bg-primary hover:bg-primary/80"
          >
            📥 Descargar Archivo de Ejemplo
          </a>
        </div>
      </div>
      <FileUploader onUpload={handleUpload} loading={loading} />
      {(loading || progress) && (
        <div className="flex items-center justify-center gap-2 mt-4 text-primary">
          <span className="animate-spin">🔄</span> {progress || 'Analizando archivo...'}
        </div>
      )}
      <SheetSelectorModal open={sheetModalOpen} sheets={sheetOptions || []} onClose={handleCloseModals} onSelect={handleSheetSelect} />
      <ColumnSelectorModal open={columnModalOpen} columns={numericColumns} onClose={handleCloseModals} onConfirm={handleColumnConfirm} />
      {error && (
        <ErrorModal message={error} onClose={() => setError(null)} />
      )}
      {result && (
        <ResultsSection result={result} />
      )}
    </section>
  )
}
