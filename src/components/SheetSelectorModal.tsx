"use client"
import React from 'react'

interface SheetSelectorModalProps {
  open: boolean
  sheets: string[]
  defaultSheet?: string
  onClose: () => void
  onSelect: (sheetName: string) => void
}

export default function SheetSelectorModal({ open, sheets, defaultSheet, onClose, onSelect }: SheetSelectorModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div role="dialog" aria-modal="true" aria-labelledby="sheet-modal-title" className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 id="sheet-modal-title" className="text-lg font-semibold mb-3">Seleccionar hoja de Excel</h2>
        <p className="text-sm text-gray-600 mb-4">Se detectaron varias hojas en el archivo. Elige cuál usar para el análisis.</p>
        <ul className="space-y-2 mb-4">
          {sheets.map(s => (
            <li key={s}>
              <button
                className={`w-full text-left px-3 py-2 rounded ${s === defaultSheet ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => onSelect(s)}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 rounded border" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
