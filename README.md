# Sistema de Registro de Abordados - Netlify + Neon DB

Este é um sistema completo para registro e gerenciamento de pessoas abordadas, integrado com Netlify Functions e banco de dados Neon (PostgreSQL).

## 🚀 Funcionalidades

- ✅ Cadastro completo de abordados com todos os campos necessários
- ✅ Upload e visualização de fotos
- ✅ Catálogo organizado por tipo de envolvimento
- ✅ Geração de PDFs individuais e por seção
- ✅ Edição de dados e fotos
- ✅ Interface responsiva otimizada para iPhone/Safari
- ✅ Integração com banco de dados PostgreSQL via Netlify Functions
- ✅ Backup local via localStorage

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Netlify Functions (Node.js)
- **Banco de Dados**: Neon (PostgreSQL)
- **PDF**: jsPDF + html2canvas
- **Deploy**: Netlify

## 📋 Pré-requisitos

1. Conta no [Netlify](https://netlify.com)
2. Conta no [Neon](https://neon.tech) 
3. Node.js 18+ instalado localmente (para desenvolvimento)

## 🔧 Configuração

### 1. Configurar Banco de Dados Neon

1. Acesse [Neon Console](https://console.neon.tech)
2. Crie um novo projeto
3. Copie a string de conexão do banco
4. A tabela será criada automaticamente na primeira execução

### 2. Configurar Netlify

1. Faça fork/clone deste repositório
2. Conecte o repositório ao Netlify
3. Configure a variável de ambiente:
   - `DATABASE_URL`: String de conexão do Neon

### 3. Deploy

```bash
# Instalar dependências
npm install

# Deploy para produção
npm run deploy
```

## 📱 Otimizações para iPhone/Safari

- Font-size 16px em inputs (evita zoom automático)
- -webkit-appearance: none para elementos customizados
- -webkit-tap-highlight-color: transparent
- touch-action: manipulation em botões
- Suporte a -webkit-overflow-scrolling: touch
- Tamanho mínimo de 44px para elementos tocáveis

## 🗃️ Estrutura do Banco de Dados

```sql
CREATE TABLE abordados (
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
```

## 🔌 API Endpoints

### POST /.netlify/functions/salvarAbordado
Salva um novo registro de abordado.

**Body:**
```json
{
  "nome": "João da Silva",
  "nome_mae": "Maria da Silva",
  "local_fato": "Rua ABC, 123",
  "tipo_envolvido": "trafico",
  "cpf": "123.456.789-00",
  "rg": "1234567",
  "endereco": "Rua XYZ, 456",
  "profissao": "Autônomo",
  "estado_civil": "solteiro",
  "escolaridade": "medio_completo",
  "cutis": "parda",
  "telefone": "(11) 99999-9999",
  "email": "joao@email.com",
  "observacoes": "Observações adicionais",
  "foto": "data:image/jpeg;base64,..."
}
```

### GET /.netlify/functions/buscarAbordados
Retorna todos os registros de abordados.

### PUT /.netlify/functions/atualizarAbordado/{id}
Atualiza um registro existente.

### DELETE /.netlify/functions/excluirAbordado/{id}
Exclui um registro.

## 🔄 Funcionamento Híbrido

O sistema funciona de forma híbrida:

1. **Dados salvos localmente** (localStorage) para funcionamento offline
2. **Sincronização com banco Neon** via Netlify Functions
3. **Fallback automático** para localStorage se a API estiver indisponível

## 📄 Geração de PDFs

- PDF individual por abordado
- PDF por seção (tipo de envolvimento)
- PDF completo do catálogo
- Formatação otimizada para impressão

## 🎨 Interface

- Cores: Preto (#000000) e Caqui (#D2B48C)
- Design responsivo
- Navegação por abas
- Seções expansíveis no catálogo
- Modais para edição e confirmação

## 🔒 Segurança

- Validação de dados no frontend e backend
- Sanitização de inputs
- CORS configurado adequadamente
- SSL/TLS via Netlify e Neon

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o desenvolvedor.

---

**Desenvolvido para otimizar o trabalho policial com tecnologia moderna e confiável.**

