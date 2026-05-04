# API da Champions League com Node.js e Express

Uma API RESTful para gerenciar jogadores e clubes da Champions League, desenvolvida com **Node.js** e **Express**, utilizando TypeScript para tipagem segura.

---

## 📋 Sumário

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação e Setup](#-instalação-e-setup)
- [Como Executar](#-como-executar)
- [Endpoints](#-endpoints)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Status Codes HTTP](#-status-codes-http)

---

## 🛠 Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | ^18.0 | Runtime JavaScript |
| **Express** | ^5.2.1 | Framework Web |
| **TypeScript** | ^6.0.2 | Tipagem estática |
| **CORS** | ^2.8.6 | Middleware de controle de origem |
| **tsx** | ^4.21.0 | Executor TypeScript para Node.js |
| **tsup** | ^8.5.1 | Build tool TypeScript |

---

## 🏗 Arquitetura

A aplicação segue a arquitetura em **camadas** (Layered Architecture), separando responsabilidades em diferentes níveis:

```
┌─────────────────────────────────────────────────┐
│          HTTP Requests (Cliente)                │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────▼──────────┐
         │   Routes (routes.ts) │  ← Define endpoints
         └───────────┬──────────┘
                     │
         ┌───────────▼─────────────────┐
         │  Controllers                │  ← Recebe requisições
         │  (players-controller.ts)    │  ← Extrai dados
         └───────────┬─────────────────┘
                     │
         ┌───────────▼──────────────────┐
         │  Services                    │  ← Lógica de negócio
         │  (players-services.ts)       │  ← Validações
         └───────────┬──────────────────┘
                     │
         ┌───────────▼──────────────────┐
         │  Repositories                │  ← Acesso aos dados
         │  (players-repository.ts)     │  ← Manipulação do banco
         └───────────┬──────────────────┘
                     │
         ┌───────────▼──────────────────┐
         │  Database (In-memory)        │  ← Array de jogadores
         └──────────────────────────────┘
```

### 📊 Fluxo de uma Requisição

```
Requisição HTTP
    ↓
Routes → Define qual controller chamar
    ↓
Controller → Extrai parâmetros (body, params, query)
    ↓
Service → Aplica lógica de negócio
    ↓
Repository → Busca/modifica dados
    ↓
HTTP Response → Retorna resultado
```

### 🔄 Exemplo: DELETE /players/15

```typescript
// 1. Routes
router.delete("/players/:id", playerController.deletePlayer);

// 2. Controller
export const deletePlayer = async(req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const httpResponse = await service.deletePlayerService(id);
  res.status(httpResponse.statuscode).json(httpResponse.body);
}

// 3. Service
export const deletePlayerService = async (id: number) => {
  const deleted = await PlayerRepository.deleteonePlayer(id);
  
  if(deleted) {
    return httpResponse.ok("jogador deletado com sucesso");
  } else {
    return httpResponse.notFound("jogador não encontrado");
  }
}

// 4. Repository
export const deleteonePlayer = async (id: number) => {
  const index = database.findIndex(p => p.id === id);
  
  if(index !== -1) {
    database.splice(index, 1);
    return true;  // Sucesso
  }
  return false;   // Não encontrado
}
```

---

## 📦 Instalação e Setup

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/matheus-cmc/-API-da-Champions-League-com-Node.js-e-Express.git
cd -API-da-Champions-League-com-Node.js-e-Express
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente (Opcional)
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3333
```

Se não configurar, o servidor usa **porta 3333** por padrão.

---

## 🚀 Como Executar

### Desenvolvimento com Hot Reload
```bash
npm run start:watch
```
O servidor será reiniciado automaticamente quando você modificar arquivos.

### Desenvolvimento Normal
```bash
npm run start:dev
```

### Produção
```bash
npm run start:dist
```

A aplicação iniciará em: **http://localhost:3333**

---

## 📡 Endpoints

### Players (Jogadores)

#### 📋 GET /api/players
Retorna todos os jogadores
```http
GET http://localhost:3333/api/players
```

**Resposta (200):**
```json
{
  "statuscode": 200,
  "body": [
    {
      "id": 1,
      "name": "Cristiano Ronaldo",
      "club": "Manchester United",
      "nationality": "Portugal",
      "position": "ST",
      "statistics": {
        "overall": 92,
        "pace": 89,
        "shooting": 93,
        "passing": 82,
        "dribbling": 87,
        "defending": 35,
        "physical": 79
      }
    }
  ]
}
```

---

#### 🔍 GET /api/players/:id
Retorna um jogador específico
```http
GET http://localhost:3333/api/players/1
```

**Resposta (200):**
```json
{
  "id": 1,
  "name": "Cristiano Ronaldo",
  "club": "Manchester United",
  "nationality": "Portugal",
  "position": "ST",
  "statistics": {
    "overall": 92,
    "pace": 89,
    "shooting": 93,
    "passing": 82,
    "dribbling": 87,
    "defending": 35,
    "physical": 79
  }
}
```

---

#### ➕ POST /api/players
Cria um novo jogador
```http
POST http://localhost:3333/api/players
Content-Type: application/json

{
  "id": 20,
  "name": "Novo Jogador",
  "club": "Chelsea",
  "nationality": "Brazil",
  "position": "CM",
  "statistics": {
    "overall": 85,
    "pace": 88,
    "shooting": 80,
    "passing": 87,
    "dribbling": 86,
    "defending": 75,
    "physical": 82
  }
}
```

**Resposta (201):**
```json
{
  "statuscode": 201,
  "body": {
    "message": "sucesso"
  }
}
```

---

#### ✏️ PATCH /api/players/:id
Atualiza as estatísticas de um jogador
```http
PATCH http://localhost:3333/api/players/1
Content-Type: application/json

{
  "overall": 93,
  "pace": 90,
  "shooting": 94,
  "passing": 83,
  "dribbling": 88,
  "defending": 36,
  "physical": 80
}
```

**Resposta (200):**
```json
{
  "statuscode": 200,
  "body": "jogador atualizado com sucesso"
}
```

---

#### 🗑️ DELETE /api/players/:id
Remove um jogador
```http
DELETE http://localhost:3333/api/players/1
```

**Resposta (200):**
```json
{
  "statuscode": 200,
  "body": "jogador deletado com sucesso"
}
```

---

### Clubs (Clubes)

#### 📋 GET /api/clubs
Retorna todos os clubes
```http
GET http://localhost:3333/api/clubs
```

---

## 🧪 Exemplos de Uso

### Usando cURL

#### Listar todos os jogadores
```bash
curl -X GET http://localhost:3333/api/players
```

#### Buscar jogador pelo ID
```bash
curl -X GET http://localhost:3333/api/players/15
```

#### Criar novo jogador
```bash
curl -X POST http://localhost:3333/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "id": 25,
    "name": "João Silva",
    "club": "Real Madrid",
    "nationality": "Portugal",
    "position": "LW",
    "statistics": {
      "overall": 88,
      "pace": 92,
      "shooting": 85,
      "passing": 80,
      "dribbling": 89,
      "defending": 50,
      "physical": 76
    }
  }'
```

#### Deletar jogador
```bash
curl -X DELETE http://localhost:3333/api/players/25
```

### Usando Thunder Client (VS Code)

1. Abra a extensão **Thunder Client**
2. Crie uma nova requisição
3. Configure:
   - **Método:** DELETE
   - **URL:** `http://localhost:3333/api/players/15`
4. Clique em **Send**

---

## 📁 Estrutura de Pastas

```
src/
├── app.ts                          # Configuração do Express
├── server.ts                       # Inicialização do servidor
├── routes.ts                       # Definição de rotas
├── controllers/
│   ├── players-controller.ts       # Lógica de requisição dos players
│   └── clubs-controller.ts         # Lógica de requisição dos clubs
├── services/
│   ├── players-services.ts         # Lógica de negócio dos players
│   └── clubs-services.ts           # Lógica de negócio dos clubs
├── repositories/
│   ├── players-repository.ts       # Acesso aos dados dos players
│   └── clubs-repository.ts         # Acesso aos dados dos clubs
├── models/
│   ├── player-model.ts             # Interface PlayerModel
│   └── statistics-model.ts         # Interface StatisticsModel
└── utils/
    └── http-helper.ts              # Funções auxiliares HTTP
```

---

## 📊 Status Codes HTTP

| Código | Significado | Exemplo |
|--------|------------|---------|
| **200** | OK - Requisição bem-sucedida | GET, DELETE bem-sucedido |
| **201** | Created - Recurso criado | POST bem-sucedido |
| **204** | No Content - Sem conteúdo | Lista vazia |
| **400** | Bad Request - Erro na requisição | Dados inválidos |
| **404** | Not Found - Recurso não encontrado | ID inexistente |
| **500** | Server Error - Erro interno | Erro do servidor |

---

## 🔐 Validações

- ✅ Verifica se o ID do jogador existe antes de deletar
- ✅ Valida se o corpo da requisição não está vazio
- ✅ Converte parâmetros para os tipos corretos (string → number)
- ✅ Retorna mensagens de erro descritivas

---

## 🚧 Melhorias Futuras

- [ ] Conectar a um banco de dados real (MongoDB/PostgreSQL)
- [ ] Adicionar autenticação (JWT)
- [ ] Implementar paginação
- [ ] Adicionar testes unitários
- [ ] Adicionar filtros avançados
- [ ] Documentação Swagger/OpenAPI

---

## 📝 Licença

ISC

---

## 👤 Autor

**Matheus Cavalcanti**  
GitHub: [@matheus-cmc](https://github.com/matheus-cmc)
