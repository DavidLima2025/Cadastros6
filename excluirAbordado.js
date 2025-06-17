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

  // Verificar se é uma requisição DELETE
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Método não permitido. Use DELETE.' 
      })
    };
  }

  try {
    // Extrair ID do path
    const pathParts = event.path.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id || isNaN(parseInt(id))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'ID inválido ou não fornecido' 
        })
      };
    }

    // Configurar cliente PostgreSQL
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { 
        rejectUnauthorized: false 
      }
    });

    await client.connect();

    // Verificar se o registro existe
    const checkResult = await client.query('SELECT id FROM abordados WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      await client.end();
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Registro não encontrado' 
        })
      };
    }

    // Excluir o registro
    await client.query('DELETE FROM abordados WHERE id = $1', [id]);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Registro excluído com sucesso'
      })
    };

  } catch (error) {
    console.error('Erro ao excluir abordado:', error);
    
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

