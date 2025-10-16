# Backend - Forte Asset Manager

Backend da aplicação de gerenciamento de ativos, desenvolvido com NestJS, Prisma e PostgreSQL.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando a aplicação](#-executando-a-aplicação)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [API Documentation](#-api-documentation)
- [Banco de dados](#-banco-de-dados)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Testes](#-testes)
- [Contribuição](#-contribuição)

## 🚀 Tecnologias

- **NestJS** - Framework Node.js para aplicações server-side
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Prisma** - ORM moderno para TypeScript e Node.js
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização do banco de dados
- **Swagger** - Documentação automática da API
- **Jest** - Framework de testes
- **ESLint** - Linter para TypeScript
- **Prettier** - Formatador de código

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Docker e Docker Compose
- Git

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/andressafortuna/asset-management-system.git
cd asset-management-system/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do backend
cp .env.example .env
```

4. Configure a variável `DATABASE_URL` no arquivo `.env`:
```env
DATABASE_URL="postgresql://user_sa:postgres@localhost:5432/forte_asset_manager?schema=public"
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://user_sa:postgres@localhost:5432/forte_asset_manager?schema=public"

# Application
PORT=3000
NODE_ENV=development
```

## 🏃‍♂️ Executando a aplicação

### Desenvolvimento

1. **Inicie o banco de dados:**
```bash
docker-compose up -d
```

2. **Execute as migrações:**
```bash
npm run prisma:migrate
```

3. **Inicie a aplicação em modo de desenvolvimento:**
```bash
npm run start:dev
```

A aplicação estará disponível em:
- **API:** http://localhost:3000
- **Documentação Swagger:** http://localhost:3000/api

### Produção

1. **Build da aplicação:**
```bash
npm run build
```

2. **Inicie em modo de produção:**
```bash
npm run start:prod
```

## 📁 Estrutura do projeto

```
backend/
├── src/
│   ├── app.module.ts              # Módulo principal da aplicação
│   ├── main.ts                    # Arquivo de inicialização
│   ├── assets/                    # Módulo de ativos
│   │   ├── controllers/           # Controladores REST
│   │   ├── services/              # Lógica de negócio
│   │   ├── repositories/          # Camada de acesso a dados
│   │   ├── dto/                   # Data Transfer Objects
│   │   └── assets.module.ts       # Módulo de ativos
│   ├── companies/                 # Módulo de empresas
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── dto/
│   │   └── companies.module.ts
│   ├── employees/                 # Módulo de funcionários
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── dto/
│   │   └── employees.module.ts
│   ├── prisma/                    # Configuração do Prisma
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   └── common/                    # Utilitários compartilhados
│       ├── exceptions/            # Exceções customizadas
│       └── interceptors/          # Interceptadores
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   └── migrations/                # Migrações do banco
├── docker-compose.yml             # Configuração do Docker
├── package.json                   # Dependências e scripts
└── README.md                      # Este arquivo
```

## 📚 API Documentation

A documentação da API está disponível através do Swagger UI em:
**http://localhost:3000/api**

### Endpoints principais:

#### Empresas
- `GET /companies` - Listar todas as empresas
- `POST /companies` - Criar nova empresa
- `GET /companies/:id` - Buscar empresa por ID
- `PUT /companies/:id` - Atualizar empresa
- `DELETE /companies/:id` - Deletar empresa

#### Funcionários
- `GET /employees` - Listar todos os funcionários
- `POST /employees` - Criar novo funcionário
- `GET /employees/:id` - Buscar funcionário por ID
- `PUT /employees/:id` - Atualizar funcionário
- `DELETE /employees/:id` - Deletar funcionário

#### Ativos
- `GET /assets` - Listar todos os ativos
- `POST /assets` - Criar novo ativo
- `GET /assets/:id` - Buscar ativo por ID
- `PUT /assets/:id` - Atualizar ativo
- `DELETE /assets/:id` - Deletar ativo

## 🗄️ Banco de dados

### Modelos

#### Company
- `id` - Identificador único (CUID)
- `name` - Nome da empresa
- `cnpj` - CNPJ (único)
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

#### Employee
- `id` - Identificador único (CUID)
- `name` - Nome do funcionário
- `email` - Email (único)
- `cpf` - CPF (único)
- `companyId` - ID da empresa
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

#### Asset
- `id` - Identificador único (CUID)
- `name` - Nome do ativo
- `type` - Tipo do ativo
- `status` - Status do ativo
- `employeeId` - ID do funcionário (opcional)
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização

### Comandos do Prisma

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio
```

## 📜 Scripts disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo de desenvolvimento
npm run start:debug        # Inicia em modo debug

# Produção
npm run build              # Compila a aplicação
npm run start:prod         # Inicia em modo de produção

# Banco de dados
docker-compose up -d       # Inicia o banco de dados
docker-compose down        # Para o banco de dados
docker-compose restart     # Reinicia o banco de dados

# Prisma
npm run prisma:generate    # Gera o cliente Prisma
npm run prisma:migrate     # Executa migrações
npm run prisma:studio      # Abre Prisma Studio

# Testes
npm run test               # Executa testes
npm run test:watch         # Executa testes em modo watch
npm run test:cov           # Executa testes com cobertura
npm run test:e2e           # Executa testes end-to-end

# Qualidade de código
npm run lint               # Executa ESLint
npm run format             # Formata código com Prettier
```

## 🧪 Testes

### Testes Implementados

O projeto possui **testes unitários** implementados com Jest para todos os services principais:

- ✅ **CompanyService** - Testes unitários para CRUD de empresas
- ✅ **EmployeeService** - Testes unitários para CRUD de funcionários  
- ✅ **AssetService** - Testes unitários para CRUD de ativos

### Executando testes

```bash
# Todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:cov

```

### Estrutura de testes

```
src/
├── companies/services/company.service.spec.ts    # Testes do CompanyService
├── employees/services/employee.service.spec.ts   # Testes do EmployeeService
└── assets/services/asset.service.spec.ts         # Testes do AssetService
```

## 🐳 Docker

O projeto utiliza Docker para o banco de dados PostgreSQL:

```bash
# Iniciar banco de dados
docker-compose up -d

# Parar banco de dados
docker-compose down

# Ver logs
docker-compose logs -f
```

## 🔧 Configuração do ambiente de desenvolvimento

### Configurações recomendadas

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🚀 Deploy

### Variáveis de ambiente para produção

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV=production
PORT=3000
```

### Build para produção

```bash
npm run build
npm run start:prod
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de código

- Use TypeScript strict mode
- Siga as convenções do ESLint configurado
- Escreva testes para novas funcionalidades
- Use commits semânticos
- Documente APIs com Swagger