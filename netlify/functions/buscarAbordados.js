const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Responder a requisições OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Verificar se é uma requisição GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Método não permitido. Use GET.' 
      })
    };
  }

  try {
    // Configurar cliente PostgreSQL
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { 
        rejectUnauthorized: false 
      }
    });

    await client.connect();

    // Buscar todos os abordados
    const result = await client.query(`
      SELECT 
        id, nome, nome_mae, cpf, rg, endereco,
        profissao, estado_civil, escolaridade, cutis,
        telefone, email, observacoes, local_fato, 
        tipo_envolvido, foto, data_registro,
        created_at, updated_at
      FROM abordados 
      ORDER BY data_registro DESC
    `);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: result.rows,
        total: result.rows.length
      })
    };

  } catch (error) {
    console.error('Erro ao buscar abordados:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: `Erro interno do servidor: ${error.message}` 
      })
    };
  }
};

