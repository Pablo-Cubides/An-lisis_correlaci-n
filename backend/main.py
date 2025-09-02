from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from scipy.stats import pearsonr, spearmanr, kendalltau
import io

app = FastAPI(
    title="Relational Insight API",
    description="API para analizar correlaciones en datos numéricos de archivos CSV y Excel.",
    version="1.0.0"
)

# Configuración de CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringir a la URL del frontend
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

def calculate_correlation(df):
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    if len(numeric_cols) < 2:
        raise HTTPException(
            status_code=400,
            detail="El archivo debe contener al menos dos columnas numéricas para el análisis."
        )

    results = []
    for i in range(len(numeric_cols)):
        for j in range(i + 1, len(numeric_cols)):
            col1_name = numeric_cols[i]
            col2_name = numeric_cols[j]
            
            col1 = df[col1_name].dropna()
            col2 = df[col2_name].dropna()

            # Asegurarse de que las columnas tengan la misma longitud después de eliminar NaNs
            common_index = col1.index.intersection(col2.index)
            if len(common_index) < 2:
                continue # No hay suficientes datos para calcular la correlación

            col1 = col1[common_index]
            col2 = col2[common_index]

            pearson_corr, _ = pearsonr(col1, col2)
            spearman_corr, _ = spearmanr(col1, col2)
            kendall_corr, _ = kendalltau(col1, col2)

            results.append({
                "column_a": col1_name,
                "column_b": col2_name,
                "pearson": round(pearson_corr, 4),
                "spearman": round(spearman_corr, 4),
                "kendall": round(kendall_corr, 4),
            })
    return results, numeric_cols

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx')):
        raise HTTPException(status_code=400, detail="Formato de archivo no válido. Use .csv o .xlsx.")

    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        correlation_results, numeric_columns = calculate_correlation(df)
        
        return {
            "filename": file.filename,
            "numeric_columns": numeric_columns,
            "correlation_results": correlation_results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocurrió un error al procesar el archivo: {str(e)}")

@app.get("/metrics")
async def get_metrics():
    return {"message": "Esta ruta puede usarse para un resumen de análisis futuro."}
