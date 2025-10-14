"use client"
import React, { useState, useEffect } from 'react'

interface ColumnSelectorModalProps {
  open: boolean
  columns: string[]
  onClose: () => void
  onConfirm: (selectedColumns: string[]) => void
}

export default function ColumnSelectorModal({ open, columns, onClose, onConfirm }: ColumnSelectorModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setSelectedColumns(columns)
    }
  }, [open, columns])

  const handleToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedColumns)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Seleccionar Columnas para Analizar</h2>
        <p className="text-gray-600 mb-4">
          Elige las columnas numéricas que quieres incluir en el análisis de correlación.
        </p>
        <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-2">
          {columns.map(col => (
            <label key={col} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedColumns.includes(col)}
                onChange={() => handleToggle(col)}
              />
              <span className="text-gray-800">{col}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md text-white bg-primary hover:bg-primary/80 transition-colors"
            disabled={selectedColumns.length < 2}
          >
            Analizar ({selectedColumns.length})
          </button>
        </div>
        {selectedColumns.length < 2 && (
            <p className="text-red-500 text-sm mt-2 text-right">Selecciona al menos dos columnas.</p>
        )}
      </div>
    </div>
  )
}
