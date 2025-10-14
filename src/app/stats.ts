// Estadísticas: implementaciones locales de Pearson, Spearman y Kendall

// Devuelve la media de un array de números
function mean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

// Desviación estándar (poblacional)
function std(arr: number[], mu?: number): number {
  if (arr.length === 0) return 0
  const m = mu ?? mean(arr)
  const variance = arr.reduce((s, v) => s + (v - m) * (v - m), 0) / arr.length
  return Math.sqrt(variance)
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error('Arrays must have same length')
  const n = x.length
  if (n === 0) throw new Error('Empty arrays')
  const mx = mean(x)
  const my = mean(y)
  let cov = 0
  for (let i = 0; i < n; i++) cov += (x[i] - mx) * (y[i] - my)
  cov = cov / n
  const sx = std(x, mx)
  const sy = std(y, my)
  if (sx === 0 || sy === 0) return 0
  return cov / (sx * sy)
}

// Rankings con promedio para empates
export function rankArray(values: number[]): number[] {
  const indexed = values.map((v, idx) => ({ v, idx }))
  indexed.sort((a, b) => a.v - b.v)
  const ranks = new Array<number>(values.length)
  let i = 0
  while (i < indexed.length) {
    let j = i + 1
    while (j < indexed.length && indexed[j].v === indexed[i].v) j++
    const avgRank = (i + 1 + j) / 2
    for (let k = i; k < j; k++) ranks[indexed[k].idx] = avgRank
    i = j
  }
  return ranks
}

export function spearmanCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error('Arrays must have same length')
  if (x.length === 0) throw new Error('Empty arrays')
  const rx = rankArray(x)
  const ry = rankArray(y)
  return pearsonCorrelation(rx, ry)
}

export function kendallCorrelation(x: number[], y: number[]): number {
  const n = x.length
  let concordant = 0
  let discordant = 0
  let tieX = 0
  let tieY = 0
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = Math.sign(x[j] - x[i])
      const dy = Math.sign(y[j] - y[i])
      if (dx === 0 && dy === 0) continue
      if (dx === 0) tieX++
      if (dy === 0) tieY++
      if (dx === dy) {
        if (dx !== 0) concordant++
      } else {
        if (dx !== 0 && dy !== 0) discordant++
      }
    }
  }
  const denom = Math.sqrt((concordant + discordant + tieX) * (concordant + discordant + tieY))
  if (denom === 0) return 0
  return (concordant - discordant) / denom
}
