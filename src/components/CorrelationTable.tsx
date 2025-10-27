import React from "react"
import type { CorrelationResult } from '../app/utils'

const methodInfo = {
  pearson: {
    label: "Pearson",
    color: "bg-blue-500",
    tooltip: "Coeficiente de correlación de Pearson: mide la relación lineal entre dos variables numéricas.",
    description: "Mide relaciones lineales. Ideal para datos normalmente distribuidos.",
    resources: "https://www.scribbr.com/statistics/pearson-correlation-coefficient/",
  },
  spearman: {
    label: "Spearman",
    color: "bg-green-500",
    tooltip: "Correlación de Spearman: mide la relación monótona (no necesariamente lineal) entre dos variables numéricas.",
    description: "Alternativa no paramétrica. Robusta ante valores atípicos.",
    resources: "https://statistics.laerd.com/statistical-guides/spearmans-rank-order-correlation-statistical-guide.php",
  },
  kendall: {
    label: "Kendall Tau",
    color: "bg-purple-500",
    tooltip: "Tau de Kendall: mide la concordancia en el orden de los valores entre dos variables numéricas.",
    description: "Ideal para muestras pequeñas y datos empatados. No paramétrica.",
    resources: "https://www.statisticssolutions.com/free-resources/directory-of-statistical-analyses/kendalls-tau-and-spearmans-rank-correlation-coefficient/",
  },
}

function getStrengthColor(value: number): string {
  if (Math.abs(value) > 0.75) return "text-blue-600"
  if (Math.abs(value) >= 0.4) return "text-yellow-600"
  return "text-red-600"
}

// getStrengthLabel removed — unused helper

interface CorrelationTableProps {
  numericColumns: string[]
  correlationResults: CorrelationResult[]
}

export default function CorrelationTable({ numericColumns, correlationResults }: CorrelationTableProps) {
  // Crear matriz para acceso rápido
  const matrix: Record<string, Record<string, CorrelationResult>> = {}
  correlationResults.forEach(res => {
    if (!matrix[res.column_a]) matrix[res.column_a] = {}
    matrix[res.column_a][res.column_b] = res
    // Simetría
    if (!matrix[res.column_b]) matrix[res.column_b] = {}
    matrix[res.column_b][res.column_a] = {
      column_a: res.column_b,
      column_b: res.column_a,
      pearson: res.pearson,
      spearman: res.spearman,
      kendall: res.kendall,
    }
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full border rounded-lg bg-white">
        <thead>
          <tr>
            <th className="p-2 border bg-gray-50">Columna</th>
            {numericColumns.map(col => (
              <th key={col} className="p-2 border bg-gray-50">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {numericColumns.map(rowCol => (
            <tr key={rowCol}>
              <td className="p-2 border font-semibold bg-gray-50">{rowCol}</td>
              {numericColumns.map(colCol => {
                if (rowCol === colCol) {
                  return <td key={colCol} className="p-2 border bg-gray-100 text-center">—</td>
                }
                const res = matrix[rowCol]?.[colCol]
                return (
                  <td key={colCol} className="p-2 border text-center">
                    {res ? (
                      <div className="flex flex-col gap-1 items-center">
                        {(["pearson", "spearman", "kendall"] as const).map(method => {
                          const val = res[method] as number | null
                          return (
                            <span
                              key={method}
                              className={`group relative cursor-help text-xs font-medium ${val !== null ? getStrengthColor(val) : 'text-gray-400'}`}
                            >
                              {methodInfo[method].label}: {val !== null ? val.toFixed(2) : 'N/A'}
                              <span className="ml-1">{val !== null ? getStrengthEmoji(val) : ''}</span>
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-3 py-2 z-10 w-max shadow-lg">
                                <p className="font-semibold mb-1">{methodInfo[method].tooltip}</p>
                                <p className="mb-2">{methodInfo[method].description}</p>
                                <a 
                                  href={methodInfo[method].resources}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-300 hover:text-blue-200 underline text-xs"
                                >
                                  Ver referencias →
                                </a>
                              </div>
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-300">N/A</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-xs text-gray-500">
        <span className="text-blue-600">🔵 Fuerte (&gt; 0.75)</span>,
        <span className="text-yellow-600 ml-2">🟡 Moderada (0.4–0.75)</span>,
        <span className="text-red-600 ml-2">🔴 Débil (&lt; 0.4)</span>
      </div>
    </div>
  )
}

function getStrengthEmoji(value: number): string {
  if (Math.abs(value) > 0.75) return "🔵"
  if (Math.abs(value) >= 0.4) return "🟡"
  return "🔴"
}
