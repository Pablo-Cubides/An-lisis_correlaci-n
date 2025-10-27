/**
 * Validadores de entrada para archivos y datos
 * Proporciona validación segura de archivos CSV/XLSX
 */

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Validar extensión
  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return { 
      valid: false, 
      error: 'Solo se permiten archivos .csv o .xlsx' 
    };
  }

  // Validar tamaño (máx 20MB)
  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    return { 
      valid: false, 
      error: `Archivo demasiado grande (máx. 20MB, tu archivo: ${sizeMB}MB)` 
    };
  }

  // Validar tipo MIME
  const validMimeTypes = [
    'text/csv',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream',
  ];
  
  // Si el MIME type no es válido pero la extensión sí, pasar igual
  if (!validMimeTypes.includes(file.type) && !hasValidExtension) {
    return { 
      valid: false, 
      error: 'Tipo de archivo no válido' 
    };
  }

  return { valid: true };
};

/**
 * Valida que los datos contengan columnas numéricas válidas
 */
export const validateNumericData = (
  data: Record<string, unknown>[]
): { 
  valid: boolean; 
  error?: string;
  numericColumns?: string[];
} => {
  // Validar que hay datos
  if (!Array.isArray(data) || data.length === 0) {
    return { 
      valid: false, 
      error: 'El archivo está vacío o no contiene datos válidos' 
    };
  }

  // Detectar columnas numéricas
  const firstRow = data[0];
  if (!firstRow) {
    return { 
      valid: false, 
      error: 'El archivo no tiene encabezados' 
    };
  }

  const numericColumns = Object.keys(firstRow).filter(key => {
    return data.some(row => {
      const value = row[key];
      return typeof value === 'number' && !isNaN(value);
    });
  });

  // Validar que hay al menos 2 columnas numéricas
  if (numericColumns.length < 2) {
    return { 
      valid: false, 
      error: `Se necesitan al menos 2 columnas numéricas (encontradas: ${numericColumns.length})` 
    };
  }

  return { 
    valid: true, 
    numericColumns 
  };
};

/**
 * Valida y limpia datos numéricos
 */
export const cleanNumericValue = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
};

/**
 * Valida que los valores no sean NaN o infinito
 */
export const isValidNumericValue = (value: number): boolean => {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
};
