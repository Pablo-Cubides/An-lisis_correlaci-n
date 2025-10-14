import { sampleCorrelation } from 'simple-statistics';

// Tipos mínimos
export type Row = Record<string, unknown>;

export interface CorrelationResult {
  column_a: string;
  column_b: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
}

// Función para calcular correlación de Pearson
export function pearsonCorrelation(x: number[], y: number[]): number {
  return sampleCorrelation(x, y);
}

// Devuelve array de ranks (promedio para empates) en el orden original
export function rankArray(values: number[]): number[] {
  const indexed = values.map((v, idx) => ({ v, idx }));
  indexed.sort((a, b) => a.v - b.v);

  const ranks = new Array<number>(values.length);
  let i = 0;
  while (i < indexed.length) {
    let j = i + 1;
    while (j < indexed.length && indexed[j].v === indexed[i].v) j++;
    // average rank for ties: (i+1 + j)/2 in 1-based ranks
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[indexed[k].idx] = avgRank;
    }
    i = j;
  }
  return ranks;
}

// Función para calcular correlación de Spearman (usando ranks con manejo de empates)
export function spearmanCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error('Arrays must have same length');
  if (x.length === 0) throw new Error('Empty arrays');
  const rankX = rankArray(x);
  const rankY = rankArray(y);
  return sampleCorrelation(rankX, rankY);
}

// Función para calcular correlación de Kendall Tau-b (maneja empates de forma básica)
export function kendallCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  let concordant = 0;
  let discordant = 0;
  let tieX = 0;
  let tieY = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = Math.sign(x[j] - x[i]);
      const dy = Math.sign(y[j] - y[i]);
      if (dx === 0 && dy === 0) continue;
      if (dx === 0) tieX++;
      if (dy === 0) tieY++;
      if (dx === dy) {
        if (dx !== 0) concordant++;
      } else {
        if (dx !== 0 && dy !== 0) discordant++;
      }
    }
  }

  const denom = Math.sqrt((concordant + discordant + tieX) * (concordant + discordant + tieY));
  if (denom === 0) return 0;
  return (concordant - discordant) / denom;
}

// Función para calcular correlaciones
export function calculateCorrelations(data: Row[]): { correlation_results: CorrelationResult[], numeric_columns: string[], raw_data: Row[] } {
    const numericColumns = Object.keys(data[0] || {}).filter(key => {
        return data.some(row => typeof row[key] === 'number' && !isNaN(row[key] as number));
    });

    if (numericColumns.length < 2) {
        throw new Error('El archivo debe contener al menos dos columnas numéricas.');
    }

    const results = [];
    for (let i = 0; i < numericColumns.length; i++) {
        for (let j = i + 1; j < numericColumns.length; j++) {
            const col1 = numericColumns[i];
            const col2 = numericColumns[j];

            const pairs = data
                .map(row => ({ x: row[col1], y: row[col2] }))
                .filter(pair => typeof pair.x === 'number' && typeof pair.y === 'number' && !isNaN(pair.x as number) && !isNaN(pair.y as number));

            if (pairs.length < 2) continue;

            const xVals = pairs.map(p => p.x as number);
            const yVals = pairs.map(p => p.y as number);

            let pearson = null;
            let spearman = null;
            let kendall = null;

            try {
                pearson = pearsonCorrelation(xVals, yVals);
            } catch (e) {
                console.warn('Pearson error for', col1, col2, e);
            }

            try {
                spearman = spearmanCorrelation(xVals, yVals);
            } catch (e) {
                console.warn('Spearman error for', col1, col2, e);
            }

            try {
                kendall = kendallCorrelation(xVals, yVals);
            } catch (e) {
                console.warn('Kendall error for', col1, col2, e);
            }

            results.push({
                column_a: col1,
                column_b: col2,
                pearson: pearson !== null ? parseFloat(pearson.toFixed(4)) : null,
                spearman: spearman !== null ? parseFloat(spearman.toFixed(4)) : null,
                kendall: kendall !== null ? parseFloat(kendall.toFixed(4)) : null,
            });
        }
    }

    return {
        correlation_results: results,
        numeric_columns: numericColumns,
        raw_data: data
    };
}