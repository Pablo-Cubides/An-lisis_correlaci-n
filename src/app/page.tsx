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
    setProgress('Reading file...')

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
          setProgress('Please select a sheet.')
          return // Wait for user to select a sheet
        }
      }

      // If CSV or single-sheet XLSX, parse immediately
      setProgress('Parsing file and identifying columns...')
  workerRef.current?.postMessage({ type: 'parse', payload: { fileBuffer, fileType } }, [fileBuffer])

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Error processing file.')
      setLoading(false)
    }
  }

  async function handleSheetSelect(sheetName: string) {
    setSheetModalOpen(false)
  if (!pendingFileRef.current) return

    setLoading(true)
    setProgress('Reading selected sheet...')
    try {
  const fileBuffer = await pendingFileRef.current!.arrayBuffer()
  workerRef.current?.postMessage({ type: 'parse', payload: { fileBuffer, fileType: 'xlsx', sheetToUse: sheetName } }, [fileBuffer])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Error processing selected sheet.')
      setLoading(false)
    }
  }

  function handleColumnConfirm(selectedColumns: string[]) {
    setColumnModalOpen(false)
    if (selectedColumns.length < 2) {
      setError('Please select at least two columns to analyze.')
      return
    }
    setLoading(true)
    setProgress('Calculating correlations...')
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
        <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full bg-primary">RI</div>
        <h1 className="text-2xl font-bold text-primary">Relational Insight</h1>
        <p className="text-center text-gray-500">
          Upload a <strong>.csv</strong> or <strong>.xlsx</strong> file to analyze correlations between numeric columns.
        </p>
        <div className="max-w-md text-sm text-center text-gray-600">
          <p className="mb-2">
            <strong>Required Format:</strong> The file must contain at least two columns with numeric values.
            Rows with non-numeric or empty values will be ignored.
          </p>
          <a
            href="/example.csv"
            download="correlation_example.csv"
            className="inline-block px-4 py-2 text-white transition-colors rounded bg-primary hover:bg-primary/80"
          >
            📥 Download Example File
          </a>
        </div>
      </div>
      <FileUploader onUpload={handleUpload} loading={loading} />
      {(loading || progress) && (
        <div className="flex items-center justify-center gap-2 mt-4 text-primary">
          <span className="animate-spin">🔄</span> {progress || 'Analyzing file...'}
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
