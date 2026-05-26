const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: 'Método no permitido'
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const tema = String(body.tema || '').trim();
    const tipo = String(body.tipo || '').trim();
    const cantidad = Number(body.cantidad || 1);

    if (!tema) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Debe ingresar un tema'
        })
      };
    }

    if (!tipo) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Debe seleccionar un tipo de pregunta'
        })
      };
    }

    if (!process.env.GROQ_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'No está configurada la variable GROQ_API_KEY'
        })
      };
    }

    const prompt = `
Genera ${cantidad} pregunta(s) para una evaluación académica.

Tema: ${tema}
Tipo de pregunta: ${tipo}

Reglas:
- Responde únicamente en español.
- Devuelve solamente un arreglo JSON válido.
- No uses markdown.
- No escribas explicaciones fuera del JSON.

Si el tipo es "multiple", usa exactamente este formato:
[
  {
    "enunciado": "Texto de la pregunta",
    "opcionA": "Opción A",
    "opcionB": "Opción B",
    "opcionC": "Opción C",
    "opcionD": "Opción D",
    "respuesta": "A"
  }
]

Si el tipo es "vf", usa exactamente este formato:
[
  {
    "enunciado": "Texto de la pregunta",
    "respuesta": "V"
  }
]

Si el tipo es "abierta", usa exactamente este formato:
[
  {
    "enunciado": "Texto de la pregunta",
    "respuesta": "Respuesta esperada"
  }
]
`;

    const respuesta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente que genera preguntas académicas en formato JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1200
      })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      return {
        statusCode: respuesta.status,
        headers,
        body: JSON.stringify({
          error: 'Groq devolvió un error',
          detalle: data
        })
      };
    }

    const textoGenerado =
      data.choices?.[0]?.message?.content || '';

    if (!textoGenerado) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Groq respondió, pero no generó texto',
          detalle: data
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        modo: 'groq',
        preguntas: textoGenerado
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error interno en la función',
        detalle: String(error)
      })
    };
  }
};