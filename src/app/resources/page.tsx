import React from "react"

interface ResourceLink {
  title: string
  url: string
  source: string
  description: string
  keyPoints: string[]
}

const pearsonResources: ResourceLink[] = [
  {
    title: "Pearson Correlation Coefficient - Complete Guide",
    url: "https://www.scribbr.com/statistics/pearson-correlation-coefficient/",
    source: "Scribbr",
    description: "Una guía completa sobre el coeficiente de correlación de Pearson. Explica qué es, cómo interpretar sus valores (fuerza y dirección), y detalla los supuestos clave que deben cumplirse, como la necesidad de que los datos sean cuantitativos, estén distribuidos normalmente y tengan una relación lineal.",
    keyPoints: [
      "Definición y propósito del coeficiente de Pearson",
      "Interpretación de valores (-1 a +1)",
      "Supuestos estadísticos clave",
      "Cuándo y cómo usar esta prueba",
    ],
  },
  {
    title: "Pearson's Correlation Coefficient - Assumptions & Evaluation",
    url: "https://www.statstutor.ac.uk/resources/uploaded/pearsons.pdf",
    source: "Stats Tutor (University of Sheffield)",
    description: "Este tutorial se enfoca en los supuestos necesarios para usar la correlación de Pearson, explicando con gráficos qué es una relación lineal y cómo se evalúa la normalidad de los datos. Subraya que Pearson es sensible a los valores atípicos y a las distribuciones sesgadas.",
    keyPoints: [
      "Supuestos de la correlación de Pearson",
      "Relaciones lineales vs no lineales",
      "Evaluación de normalidad",
      "Sensibilidad a valores atípicos",
    ],
  },
  {
    title: "Pearson Correlation Coefficient - Mathematical Definition",
    url: "https://en.wikipedia.org/wiki/Pearson_correlation_coefficient",
    source: "Wikipedia",
    description: "Este recurso proporciona la definición matemática formal del coeficiente de Pearson, describiéndolo como la covarianza de dos variables dividida por el producto de sus desviaciones estándar. Explica sus propiedades matemáticas, como el hecho de que su valor siempre está entre -1 y 1.",
    keyPoints: [
      "Definición matemática formal",
      "Covarianza y desviación estándar",
      "Rango de valores (-1 a +1)",
      "Propiedades matemáticas",
    ],
  },
]

const spearmanResources: ResourceLink[] = [
  {
    title: "Spearman's Rank-Order Correlation - Statistical Guide",
    url: "https://statistics.laerd.com/statistical-guides/spearmans-rank-order-correlation-statistical-guide.php",
    source: "Laerd Statistics",
    description: "Esta guía explica de manera clara qué es una relación monotónica (aquella en la que las variables se mueven en la misma dirección, pero no necesariamente a un ritmo constante) y por qué la correlación de Spearman es adecuada para medirla. Detalla el proceso de cómo funciona la prueba al convertir los datos brutos en rangos, lo que la hace menos sensible a los valores atípicos.",
    keyPoints: [
      "Definición de relación monotónica",
      "Ventajas sobre Pearson",
      "Proceso de conversión a rangos",
      "Robustez ante valores atípicos",
    ],
  },
  {
    title: "Spearman's Rank Correlation Coefficient - Key Differences",
    url: "https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient",
    source: "Wikipedia",
    description: "Este recurso destaca la diferencia clave entre Pearson y Spearman: mientras que Pearson evalúa relaciones lineales, Spearman evalúa relaciones monotónicas (sean lineales o no). Afirma que el coeficiente de Spearman es equivalente a aplicar la correlación de Pearson a los valores de rango de los datos.",
    keyPoints: [
      "Diferencia entre relaciones lineales y monotónicas",
      "Equivalencia con Pearson en datos ranqueados",
      "Aplicabilidad a datos ordinales",
      "Comparativa Pearson vs Spearman",
    ],
  },
  {
    title: "Spearman's Correlation - Monotonic Functions",
    url: "https://www.statstutor.ac.uk/resources/uploaded/spearmans.pdf",
    source: "Stats Tutor (University of Sheffield)",
    description: "Este documento visualiza claramente la diferencia entre una función monotónica y una no monotónica. Explica que Spearman mide la fuerza de una relación monotónica y que un valor cercano a 1 o -1 indica una relación monotónica casi perfecta, incluso si no es lineal.",
    keyPoints: [
      "Diferencia entre funciones monotónicas",
      "Visualización de relaciones",
      "Interpretación de valores",
      "Aplicaciones prácticas",
    ],
  },
]

const kendallResources: ResourceLink[] = [
  {
    title: "Kendall's Tau and Spearman's Rank Correlation",
    url: "https://www.statisticssolutions.com/free-resources/directory-of-statistical-analyses/kendalls-tau-and-spearmans-rank-correlation-coefficient/",
    source: "Statistics Solutions",
    description: "Este enlace explica que el Tau de Kendall se basa en el recuento de pares de observaciones 'concordantes' y 'discordantes'. Destaca que a menudo se prefiere sobre Spearman para tamaños de muestra pequeños y cuando hay muchos datos empatados. Su interpretación es más directa, ya que se relaciona con las probabilidades de observar pares concordantes frente a discordantes.",
    keyPoints: [
      "Método de pares concordantes y discordantes",
      "Ventajas en muestras pequeñas",
      "Manejo de datos empatados",
      "Interpretación directa de probabilidades",
    ],
  },
  {
    title: "Kendall Rank Correlation Coefficient - Mathematical Foundation",
    url: "https://en.wikipedia.org/wiki/Kendall_rank_correlation_coefficient",
    source: "Wikipedia",
    description: "Este recurso define el Tau de Kendall como una medida de la similitud en el ordenamiento de los datos cuando se clasifican por cada una de las cantidades. Explica sus propiedades, como que un valor de 1 significa un acuerdo perfecto en los rankings y -1 un desacuerdo perfecto.",
    keyPoints: [
      "Definición de similitud en ordenamiento",
      "Interpretación de valores",
      "Acuerdo perfecto (1) y desacuerdo perfecto (-1)",
      "Propiedades matemáticas",
    ],
  },
  {
    title: "Kendall's Tau - Nonparametric Measure for Ordinal Data",
    url: "http://library.virginia.edu/data/articles/correlation-pearson-spearman-and-kendalls-tau",
    source: "University of Virginia Library",
    description: "Este artículo de una universidad explica de forma concisa que el Tau de Kendall es una medida no paramétrica que se puede utilizar para explorar la correlación entre dos variables ordinales, sin hacer suposiciones sobre la distribución de los datos.",
    keyPoints: [
      "Medida no paramétrica",
      "Aplicabilidad a variables ordinales",
      "Sin supuestos de distribución",
      "Robustez estadística",
    ],
  },
]

function ResourceCard({ resource }: { resource: ResourceLink }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-primary mb-2">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {resource.title} ↗
        </a>
      </h3>
      <p className="text-sm text-gray-600 mb-2 font-medium">{resource.source}</p>
      <p className="text-gray-700 text-sm mb-4">{resource.description}</p>
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-800 mb-2">Puntos clave:</h4>
        <ul className="list-disc ml-5 text-xs text-gray-700 space-y-1">
          {resource.keyPoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-medium text-white bg-primary hover:bg-primary/80 px-3 py-2 rounded transition-colors"
      >
        Ver recurso completo →
      </a>
    </div>
  )
}

export default function ResourcesPage() {
  return (
    <section className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold text-primary">Recursos y Referencias</h1>
        <p className="text-gray-600">
          Accede a los mejores recursos académicos sobre correlación estadística. Todos los enlaces son a fuentes confiables y reconocidas mundialmente.
        </p>
      </div>

      {/* Pearson Section */}
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4 py-2">
          <h2 className="text-2xl font-bold text-blue-600 mb-1">Correlación de Pearson (r)</h2>
          <p className="text-sm text-gray-600">
            Mide la relación lineal entre dos variables numéricas. Perfecta para datos normalmente distribuidos.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {pearsonResources.map((resource, idx) => (
            <ResourceCard key={idx} resource={resource} />
          ))}
        </div>
      </div>

      {/* Spearman Section */}
      <div className="space-y-4">
        <div className="border-l-4 border-green-500 pl-4 py-2">
          <h2 className="text-2xl font-bold text-green-600 mb-1">Correlación de Spearman (ρ)</h2>
          <p className="text-sm text-gray-600">
            Alternativa no paramétrica a Pearson. Mide relaciones monotónicas, ideal para datos no normales.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {spearmanResources.map((resource, idx) => (
            <ResourceCard key={idx} resource={resource} />
          ))}
        </div>
      </div>

      {/* Kendall Section */}
      <div className="space-y-4">
        <div className="border-l-4 border-purple-500 pl-4 py-2">
          <h2 className="text-2xl font-bold text-purple-600 mb-1">Correlación de Kendall (τ)</h2>
          <p className="text-sm text-gray-600">
            Medida no paramétrica especialmente útil para muestras pequeñas y datos con muchos empates.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {kendallResources.map((resource, idx) => (
            <ResourceCard key={idx} resource={resource} />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 ¿Cuándo usar cada método?</h3>
        <ul className="text-sm text-blue-900 space-y-2 list-disc ml-5">
          <li>
            <strong>Pearson:</strong> Cuando tus datos son normalmente distribuidos y sospechas una relación lineal.
          </li>
          <li>
            <strong>Spearman:</strong> Cuando los datos no son normales o tienes una relación monotónica pero no lineal.
          </li>
          <li>
            <strong>Kendall:</strong> Con muestras pequeñas, muchos datos empatados, o cuando necesitas interpretación probabilística.
          </li>
        </ul>
      </div>

      {/* Credibility Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">✓ Fuentes confiables</h3>
        <p className="text-sm text-gray-700 mb-3">
          Todos estos recursos provienen de instituciones académicas y educativas reconocidas:
        </p>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Scribbr</strong> - Plataforma educativa especializada en metodología de investigación</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Wikipedia</strong> - Enciclopedia con artículos revisados por expertos en estadística</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Laerd Statistics</strong> - Recurso estadístico educativo profesional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Stats Tutor</strong> - Proyecto de la Universidad de Sheffield</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Statistics Solutions</strong> - Consultoría estadística profesional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>University of Virginia</strong> - Recurso oficial de biblioteca universitaria</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
