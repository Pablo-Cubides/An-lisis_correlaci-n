
import {
    pearsonCorrelation,
    spearmanCorrelation,
    kendallCorrelation,
    calculateCorrelations,
    rankArray,
} from './utils';

describe('Correlation Functions', () => {
    describe('rankArray', () => {
        it('should correctly rank an array of numbers', () => {
            expect(rankArray([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
        });

        it('should handle ties by averaging ranks', () => {
            expect(rankArray([10, 20, 20, 30])).toEqual([1, 2.5, 2.5, 4]);
        });

        it('should handle multiple ties', () => {
            expect(rankArray([10, 20, 20, 30, 30, 30])).toEqual([1, 2.5, 2.5, 5, 5, 5]);
        });

        it('should handle negative numbers', () => {
            expect(rankArray([-10, -20, 10, 20])).toEqual([2, 1, 3, 4]);
        });

        it('should handle an empty array', () => {
            expect(rankArray([])).toEqual([]);
        });
    });

    describe('pearsonCorrelation', () => {
        it('should calculate the Pearson correlation correctly', () => {
            const x = [1, 2, 3, 4, 5];
            const y = [2, 3, 4, 5, 6];
            expect(pearsonCorrelation(x, y)).toBeCloseTo(1);
        });

        it('should return a negative correlation', () => {
            const x = [1, 2, 3, 4, 5];
            const y = [6, 5, 4, 3, 2];
            expect(pearsonCorrelation(x, y)).toBeCloseTo(-1);
        });

        it('should return zero for no correlation', () => {
            const x = [1, 2, 3, 4, 5];
            const y = [1, -1, 1, -1, 1];
            expect(pearsonCorrelation(x, y)).toBeCloseTo(0, 2);
        });
    });

    describe('spearmanCorrelation', () => {
        it('should calculate the Spearman correlation correctly', () => {
            const x = [1, 2, 3, 4, 5];
            const y = [2, 3, 4, 5, 6];
            expect(spearmanCorrelation(x, y)).toBeCloseTo(1);
        });

        it('should handle non-linear relationships', () => {
            const x = [1, 2, 3, 4, 5];
            const y = [1, 4, 9, 16, 25];
            expect(spearmanCorrelation(x, y)).toBeCloseTo(1);
        });
    });

    describe('kendallCorrelation', () => {
        it('should calculate the Kendall correlation correctly', () => {
            const x = [1, 2, 3, 4, 5];
            const y = [2, 3, 4, 5, 6];
            expect(kendallCorrelation(x, y)).toBeCloseTo(1);
        });

        it('should handle ties', () => {
            const x = [1, 2, 2, 3];
            const y = [1, 2, 3, 4];
            expect(kendallCorrelation(x, y)).toBeCloseTo(0.913, 2);
        });
    });

    describe('calculateCorrelations', () => {
        it('should calculate all correlations for a given dataset', () => {
            const data = [
                { a: 1, b: 2, c: 5 },
                { a: 2, b: 4, c: 4 },
                { a: 3, b: 6, c: 3 },
                { a: 4, b: 8, c: 2 },
                { a: 5, b: 10, c: 1 },
            ];
            const result = calculateCorrelations(data);
            expect(result.correlation_results).toHaveLength(3);
            expect(result.numeric_columns).toEqual(['a', 'b', 'c']);

            const ab = result.correlation_results.find(r => r.column_a === 'a' && r.column_b === 'b');
            expect(ab?.pearson).toBeCloseTo(1);
            expect(ab?.spearman).toBeCloseTo(1);
            expect(ab?.kendall).toBeCloseTo(1);

            const ac = result.correlation_results.find(r => r.column_a === 'a' && r.column_b === 'c');
            expect(ac?.pearson).toBeCloseTo(-1);
            expect(ac?.spearman).toBeCloseTo(-1);
            expect(ac?.kendall).toBeCloseTo(-1);

            const bc = result.correlation_results.find(r => r.column_a === 'b' && r.column_b === 'c');
            expect(bc?.pearson).toBeCloseTo(-1);
            expect(bc?.spearman).toBeCloseTo(-1);
            expect(bc?.kendall).toBeCloseTo(-1);
        });

        it('should throw an error if less than two numeric columns are found', () => {
            const data = [{ a: 1 }, { a: 2 }];
            expect(() => calculateCorrelations(data)).toThrow('El archivo debe contener al menos dos columnas numéricas.');
        });
    });
});
