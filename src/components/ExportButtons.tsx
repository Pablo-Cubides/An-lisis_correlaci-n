import React from "react"
import { toPng, toSvg } from 'html-to-image';
import type { CorrelationResult, Row } from '../app/utils'

interface ExportButtonsProps {
  correlationResults: CorrelationResult[]
  numericColumns: string[]
  rawData?: Row[]
  heatmapRef?: React.RefObject<HTMLDivElement | null>
  scatterPlotRef?: React.RefObject<HTMLDivElement | null>
}

function exportCSV(results: CorrelationResult[]) {
  const header = ["Columna A", "Columna B", "Pearson", "Spearman", "Kendall"]
  const rows = results.map(r => [r.column_a, r.column_b, r.pearson, r.spearman, r.kendall])
  const csv = [header, ...rows].map(row => row.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "reporte_correlacion.csv"
  a.click()
  URL.revokeObjectURL(url)
}

function exportJSON(results: CorrelationResult[]) {
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "reporte_correlacion.json"
  a.click()
  URL.revokeObjectURL(url)
}

function exportChart(ref: React.RefObject<HTMLDivElement | null>, format: 'png' | 'svg', filename: string) {
  if (!ref.current) return

  const exporter = format === 'png' ? toPng : toSvg;

  exporter(ref.current, { cacheBust: true })
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = filename;
      link.href = dataUrl
      link.click()
    })
    .catch((err) => {
      console.error(err)
    })
}

export default function ExportButtons({ correlationResults, heatmapRef, scatterPlotRef }: Omit<ExportButtonsProps, 'numericColumns'>) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        onClick={() => exportCSV(correlationResults)}
      >
        Descargar CSV
      </button>
      <button
        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        onClick={() => exportJSON(correlationResults)}
      >
        Descargar JSON
      </button>
      {heatmapRef?.current && (
        <>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            onClick={() => exportChart(heatmapRef, 'png', 'mapa_de_calor.png')}
          >
            Mapa de Calor (PNG)
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            onClick={() => exportChart(heatmapRef, 'svg', 'mapa_de_calor.svg')}
          >
            Mapa de Calor (SVG)
          </button>
        </>
      )}
      {scatterPlotRef?.current && (
        <>
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
            onClick={() => exportChart(scatterPlotRef, 'png', 'grafico_de_dispersion.png')}
          >
            Gráfico de Dispersión (PNG)
          </button>
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
            onClick={() => exportChart(scatterPlotRef, 'svg', 'grafico_de_dispersion.svg')}
          >
            Gráfico de Dispersión (SVG)
          </button>
        </>
      )}
    </div>
  )
}
