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

  // Verificar se é uma requisição POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Método não permitido. Use POST.' 
      })
    };
  }

  try {
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

    // Criar tabela se não existir
    await client.query(`
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
      )
    `);

    // Inserir dados na tabela
    const result = await client.query(`
      INSERT INTO abordados (
        nome, nome_mae, cpf, rg, endereco,
        profissao, estado_civil, escolaridade, cutis,
        telefone, email, observacoes, local_fato, 
        tipo_envolvido, foto, data_registro
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, 
        $14, $15, $16
      )
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
      data.data_registro ? new Date(data.data_registro) : new Date()
    ]);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        id: result.rows[0].id,
        message: 'Registro salvo com sucesso no banco de dados'
      })
    };

  } catch (error) {
    console.error('Erro ao salvar abordado:', error);
    
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

