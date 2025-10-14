import Papa from 'papaparse'
import { calculateCorrelations } from '../app/utils'

describe('correlationWorker logic (unit)', () => {
  test('parses CSV ArrayBuffer and computes correlations', () => {
    const csv = `a,b,c\n1,2,3\n4,5,6\n7,8,9\n`
  // Jest (Node) may not have TextEncoder/TextDecoder in older environments; use the string directly
    const text = csv
  const parsed = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true })
  const raw = parsed.data as Record<string, unknown>[]
    const rows = raw
      .filter(r => r && Object.keys(r).length > 0)
      .map(r => {
        const clean: Record<string, unknown> = {}
        Object.keys(r).forEach(k => {
          if (k && String(k).trim()) {
            const ck = String(k).trim()
            let v = r[k]
            if (typeof v === 'string' && v.trim()) {
              const num = parseFloat(v.trim())
              if (!isNaN(num) && isFinite(num)) v = num
            }
            clean[ck] = v
          }
        })
        return clean
      })

  const result = calculateCorrelations(rows)
  // basic structure checks
  expect(result).toBeDefined()
  expect(result.correlation_results).toBeDefined()
  expect(Array.isArray(result.correlation_results)).toBe(true)
  // With 3 numeric columns, expect 3 pairs
  expect(result.correlation_results.length).toBe(3)
  // verify one known correlation (a vs c should be perfectly correlated)
  const ac = result.correlation_results.find((p) => p.column_a === 'a' && p.column_b === 'c')
  expect(ac).toBeDefined()
  // non-null assertion because we've asserted ac exists above
  expect(Math.abs((ac!.pearson as number) - 1) < 1e-8).toBe(true)
  })

  test('parses XLSX-like rows and computes correlations', () => {
    // Instead of doing a full XLSX roundtrip in the test environment, we ensure
    // the same shape of rows (numbers) produces expected correlations.
    const rows = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
      { a: 5, b: 6 }
    ]

  const result = calculateCorrelations(rows as Record<string, unknown>[])
    expect(result).toBeDefined()
    expect(result.correlation_results.length).toBe(1) // only a vs b
  })
})
