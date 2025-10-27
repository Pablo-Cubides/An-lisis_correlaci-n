"use client"
import React, { useState } from "react"
import CorrelationTable from "../components/CorrelationTable"
import CorrelationHeatmap from "../components/CorrelationHeatmap"
import ScatterPlot from "../components/ScatterPlot"
import ExportButtons from "../components/ExportButtons"
import type { Row, CorrelationResult } from './utils'

const methodOptions = [
  { value: "pearson", label: "Pearson" },
  { value: "spearman", label: "Spearman" },
  { value: "kendall", label: "Kendall Tau" },
]

export default function ResultsSection({ result }: { result: { filename: string; correlation_results: CorrelationResult[]; numeric_columns: string[]; raw_data: Row[] } }) {
  const [method, setMethod] = useState<"pearson" | "spearman" | "kendall">("pearson")
  const [selectedPair, setSelectedPair] = useState<[string, string] | null>(null)

  const handleSelectPair = (a: string, b: string) => {
    setSelectedPair([a, b])
  }

  const heatmapRef = React.useRef<HTMLDivElement>(null)
  const scatterPlotRef = React.useRef<HTMLDivElement>(null)
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2 font-semibold text-center text-green-700">¡Análisis completado!</div>
  <ExportButtons correlationResults={result.correlation_results} heatmapRef={heatmapRef} scatterPlotRef={scatterPlotRef} />
      <CorrelationTable
        numericColumns={result.numeric_columns}
        correlationResults={result.correlation_results}
      />
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">Mapa de calor:</span>
          <select
            className="px-2 py-1 text-sm border rounded"
            value={method}
            onChange={e => setMethod(e.target.value as "pearson" | "spearman" | "kendall")}
          >
            {methodOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div ref={heatmapRef}>
          <CorrelationHeatmap
            numericColumns={result.numeric_columns}
            correlationResults={result.correlation_results}
            method={method}
            onSelectPair={handleSelectPair}
            selectedPair={selectedPair}
          />
        </div>
      </div>
      {selectedPair && (
        <div className="mt-8" ref={scatterPlotRef}>
          <ScatterPlot
            data={result.raw_data
              .filter((row): row is Record<string, number> =>
                typeof row[selectedPair[0]] === 'number' && typeof row[selectedPair[1]] === 'number')
              .map(row => ({ [selectedPair[0]]: row[selectedPair[0]] as number, [selectedPair[1]]: row[selectedPair[1]] as number }))}
            xKey={selectedPair[0]}
            yKey={selectedPair[1]}
          />
        </div>
      )}
      
      <div className="p-6 mt-12 border rounded-lg bg-blue-50 border-blue-200">
        <h3 className="mb-4 text-lg font-semibold text-blue-900">📚 Aprende más sobre correlaciones</h3>
        <div className="space-y-4 text-sm text-blue-900">
          <div>
            <h4 className="mb-1 font-medium">Correlación de Pearson:</h4>
            <p className="mb-2">Mide la relación lineal entre dos variables. Ideal para datos normalmente distribuidos.</p>
            <a href="/resources#pearson" className="inline-flex items-center gap-1 text-blue-700 hover:underline font-medium">
              Ver referencias académicas →
            </a>
          </div>
          
          <div>
            <h4 className="mb-1 font-medium">Correlación de Spearman:</h4>
            <p className="mb-2">Alternativa no paramétrica que evalúa relaciones monotónicas. Robusta ante valores atípicos.</p>
            <a href="/resources#spearman" className="inline-flex items-center gap-1 text-blue-700 hover:underline font-medium">
              Ver referencias académicas →
            </a>
          </div>
          
          <div>
            <h4 className="mb-1 font-medium">Correlación de Kendall Tau:</h4>
            <p className="mb-2">Medida no paramétrica ideal para muestras pequeñas y datos con muchos empates.</p>
            <a href="/resources#kendall" className="inline-flex items-center gap-1 text-blue-700 hover:underline font-medium">
              Ver referencias académicas →
            </a>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-800 mb-3">
              Todos nuestros recursos provienen de fuentes académicas confiables: Scribbr, Wikipedia, Laerd Statistics, Stats Tutor y universidades reconocidas.
            </p>
            <a href="/resources" className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm">
              Centro de Recursos Completo →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
