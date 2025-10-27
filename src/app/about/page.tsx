import React from "react"

export default function AboutPage() {
  return (
    <section className="max-w-3xl w-full mx-auto bg-white rounded-lg shadow p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold text-primary">Acerca de Relational Insight</h1>
        <p className="text-gray-600">
          Una herramienta educativa y profesional para análisis de correlaciones estadísticas
        </p>
      </div>

      <p className="text-lg text-gray-700 leading-relaxed">
        <strong>Relational Insight</strong> es una herramienta integral para analizar correlaciones entre columnas numéricas de archivos CSV o Excel. Permite identificar relaciones fuertes, moderadas o débiles entre variables, utilizando métodos estadísticos reconocidos y validados internacionalmente.
      </p>

      <div className="space-y-6">
        {/* Pearson Section */}
        <div className="border-l-4 border-blue-500 pl-6 py-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-3">Correlación de Pearson (r)</h2>
          <p className="text-gray-700 mb-3">
            Mide la relación lineal entre dos variables numéricas. Valores cercanos a 1 o -1 indican una relación lineal fuerte. Ideal cuando tus datos siguen una distribución normal.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Referencias académicas:</strong>
            </p>
            <ul className="text-sm space-y-2 ml-4">
              <li>
                • <a href="https://www.scribbr.com/statistics/pearson-correlation-coefficient/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Scribbr: Guía completa del coeficiente de Pearson</a>
              </li>
              <li>
                • <a href="https://www.statstutor.ac.uk/resources/uploaded/pearsons.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stats Tutor: Supuestos de Pearson (PDF)</a>
              </li>
              <li>
                • <a href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikipedia: Definición matemática formal</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Spearman Section */}
        <div className="border-l-4 border-green-500 pl-6 py-4">
          <h2 className="text-xl font-semibold text-green-600 mb-3">Correlación de Spearman (ρ)</h2>
          <p className="text-gray-700 mb-3">
            Alternativa no paramétrica que evalúa la relación monótona (no necesariamente lineal) entre dos variables, utilizando los rangos de los datos. Es más robusta ante valores atípicos y no requiere distribución normal.
          </p>
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Referencias académicas:</strong>
            </p>
            <ul className="text-sm space-y-2 ml-4">
              <li>
                • <a href="https://statistics.laerd.com/statistical-guides/spearmans-rank-order-correlation-statistical-guide.php" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Laerd Statistics: Guía de Spearman</a>
              </li>
              <li>
                • <a href="https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Wikipedia: Spearman vs Pearson</a>
              </li>
              <li>
                • <a href="https://www.statstutor.ac.uk/resources/uploaded/spearmans.pdf" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Stats Tutor: Funciones monotónicas (PDF)</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Kendall Section */}
        <div className="border-l-4 border-purple-500 pl-6 py-4">
          <h2 className="text-xl font-semibold text-purple-600 mb-3">Correlación de Kendall (τ)</h2>
          <p className="text-gray-700 mb-3">
            Medida no paramétrica que se basa en el recuento de pares concordantes y discordantes. Especialmente útil para muestras pequeñas y cuando hay muchos datos empatados.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Referencias académicas:</strong>
            </p>
            <ul className="text-sm space-y-2 ml-4">
              <li>
                • <a href="https://www.statisticssolutions.com/free-resources/directory-of-statistical-analyses/kendalls-tau-and-spearmans-rank-correlation-coefficient/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Statistics Solutions: Kendall Tau</a>
              </li>
              <li>
                • <a href="https://en.wikipedia.org/wiki/Kendall_rank_correlation_coefficient" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Wikipedia: Definición matemática</a>
              </li>
              <li>
                • <a href="http://library.virginia.edu/data/articles/correlation-pearson-spearman-and-kendalls-tau" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">University of Virginia: Comparativa de métodos</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Color Interpretation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Cómo interpretar los colores?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-100 rounded">
            <span className="text-2xl">🔵</span>
            <div>
              <p className="font-semibold text-blue-900">Fuerte</p>
              <p className="text-sm text-blue-800">&gt; 0.75</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-100 rounded">
            <span className="text-2xl">🟡</span>
            <div>
              <p className="font-semibold text-yellow-900">Moderada</p>
              <p className="text-sm text-yellow-800">0.4–0.75</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-100 rounded">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="font-semibold text-red-900">Débil</p>
              <p className="text-sm text-red-800">&lt; 0.4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Link */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-primary mb-3">📚 Centro de Recursos</h2>
        <p className="text-gray-700 mb-4">
          Accede a nuestra página completa de recursos y referencias académicas para profundizar en cada método de correlación.
        </p>
        <a
          href="/resources"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors font-medium"
        >
          Ver recursos completos →
        </a>
      </div>

      {/* Credibility Section */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">✓ Sobre esta herramienta</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Privacidad:</strong> Todos los cálculos se realizan en tu navegador. Tus datos nunca se envían a servidores externos.
          </p>
          <p>
            <strong>Métodos:</strong> Implementamos los algoritmos estadísticos más reconocidos, validados por instituciones académicas internacionales.
          </p>
          <p>
            <strong>Referencias:</strong> Todos nuestros recursos provienen de fuentes académicas confiables como universidades, plataformas educativas profesionales y enciclopedias especializadas.
          </p>
          <p>
            <strong>Desarrollo:</strong> Creado por <strong>pacub</strong> utilizando tecnologías modernas: Next.js, React, TypeScript, Tailwind CSS y SciPy.
          </p>
        </div>
      </div>

      {/* Support Link */}
      <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
        <p>
          ¿Preguntas sobre los métodos? Revisa nuestro <a href="/resources" className="text-primary hover:underline">centro de recursos</a> o descarga los PDF educativos de nuestras referencias.
        </p>
      </div>
    </section>
  )
}
