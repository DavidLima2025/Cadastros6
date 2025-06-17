const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Use POST' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    if (!data.nome || !data.nome_mae || !data.local_fato || !data.tipo_envolvido) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Campos obrigatórios: nome, nome_mae, local_fato, tipo_envolvido',
        }),
      };
    }

    await sql`
      CREATE TABLE IF NOT EXISTS abordados (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        nome_mae VARCHAR(255) NOT NULL,
        cpf VARCHAR(14),
        rg VARCHAR(20),
        endereco TEXT,
        profissao VARCHAR(255),
        estado_civil VARCHAR(50),
        escolaridade VARCHAR(100),
        cutis VARCHAR(50),
        telefone VARCHAR(20),
        email VARCHAR(255),
        observacoes TEXT,
        local_fato VARCHAR(500) NOT NULL,
        tipo_envolvido VARCHAR(100) NOT NULL,
        foto TEXT,
        data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const result = await sql`
      INSERT INTO abordados (
        nome, nome_mae, cpf, rg, endereco,
        profissao, estado_civil, escolaridade, cutis,
        telefone, email, observacoes, local_fato, 
        tipo_envolvido, foto, data_registro
      )
      VALUES (
        ${data.nome}, ${data.nome_mae}, ${data.cpf || null}, ${data.rg || null}, ${data.endereco || null},
        ${data.profissao || null}, ${data.estado_civil || null}, ${data.escolaridade || null}, ${data.cutis || null},
        ${data.telefone || null}, ${data.email || null}, ${data.observacoes || null}, ${data.local_fato},
        ${data.tipo_envolvido}, ${data.foto || null}, ${data.data_registro ? new Date(data.data_registro) : new Date()}
      )
      RETURNING id
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: result[0].id,
        message: 'Registro salvo com sucesso!',
      }),
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Erro interno: ${error.message}`,
      }),
    };
  }
};
