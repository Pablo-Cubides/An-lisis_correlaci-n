declare module 'papaparse' {
  export type ParseResult<T = Record<string, unknown>> = {
    data: T[]
    errors: Array<{ type: string; code?: string; message: string; row?: number }>
    meta?: Record<string, unknown>
  }

  export interface ParseConfig {
    header?: boolean
    skipEmptyLines?: boolean
    chunk?: (results: ParseResult) => void
    complete?: (results: ParseResult) => void
    error?: (err: Error) => void
  }

  const Papa: {
    parse: <T = Record<string, unknown>>(input: string | File, config?: ParseConfig) => ParseResult<T>
  }

  export default Papa
}
