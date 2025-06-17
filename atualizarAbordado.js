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

  // Verificar se é uma requisição PUT
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Método não permitido. Use PUT.' 
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

    // Parse dos dados recebidos
    const data = JSON.parse(event.body);
    
    // Validar dados obrigatórios
    if (!data.nome || !data.nome_mae || !data.local_fato || !data.tipo_envolvido) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Campos obrigatórios não preenchidos: nome, nome_mae, local_fato, tipo_envolvido' 
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

    // Atualizar dados na tabela
    const result = await client.query(`
      UPDATE abordados SET
        nome = $1, nome_mae = $2, cpf = $3, rg = $4, endereco = $5,
        profissao = $6, estado_civil = $7, escolaridade = $8, cutis = $9,
        telefone = $10, email = $11, observacoes = $12, local_fato = $13, 
        tipo_envolvido = $14, foto = $15, updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING id
    `, [
      data.nome,
      data.nome_mae,
      data.cpf || null,
      data.rg || null,
      data.endereco || null,
      data.profissao || null,
      data.estado_civil || null,
      data.escolaridade || null,
      data.cutis || null,
      data.telefone || null,
      data.email || null,
      data.observacoes || null,
      data.local_fato,
      data.tipo_envolvido,
      data.foto || null,
      id
    ]);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        id: result.rows[0].id,
        message: 'Registro atualizado com sucesso'
      })
    };

  } catch (error) {
    console.error('Erro ao atualizar abordado:', error);
    
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

