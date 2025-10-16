# ForteTec Asset Manager - Frontend

Sistema de gerenciamento de ativos desenvolvido em Angular 20 com Material Design. Permite o gerenciamento completo de empresas, funcionários e ativos de forma intuitiva e responsiva.

## 🚀 Tecnologias Utilizadas

- **Angular 20.3.0** - Framework principal
- **Angular Material 20.2.8** - Componentes de UI
- **Angular CDK 20.2.8** - Component Development Kit
- **RxJS 7.8.0** - Programação reativa
- **TypeScript 5.9.2** - Linguagem de programação
- **ngx-mask 20.0.3** - Máscaras para inputs
- **ESLint** - Linting e formatação de código

## 📋 Funcionalidades Implementadas

### 🏢 Gestão de Empresas
- **Listagem de empresas** com tabela responsiva
- **Criação de novas empresas** com validação de CNPJ
- **Edição de dados** das empresas existentes
- **Exclusão de empresas** com confirmação
- **Visualização detalhada** de cada empresa

### 👥 Gestão de Funcionários
- **Cadastro de funcionários** por empresa
- **Listagem de funcionários** com informações completas
- **Edição de dados** dos funcionários
- **Exclusão de funcionários** com confirmação
- **Validação de CPF** e email

### 📦 Gestão de Ativos
- **Cadastro de ativos** (equipamentos, ferramentas, etc.)
- **Associação de ativos** a funcionários
- **Controle de status** dos ativos
- **Edição e exclusão** de ativos
- **Histórico de movimentações**

## 🏗️ Estrutura do Projeto

```
src/app/
├── components/           # Componentes da aplicação
│   ├── companies/       # Gestão de empresas
│   ├── company-details/ # Detalhes e funcionários
│   ├── employee-asset-management/ # Gestão de ativos
│   └── header/          # Cabeçalho da aplicação
├── models/              # Interfaces TypeScript
│   ├── company.model.ts
│   ├── employee.model.ts
│   └── asset.model.ts
├── services/            # Serviços de API
│   ├── company.service.ts
│   ├── employee.service.ts
│   └── asset.service.ts
└── utils/               # Utilitários
    └── error-handler.ts
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend da aplicação rodando na porta 3000

### Instalação
1. Clone o repositório:
```bash
git clone https://github.com/andressafortuna/asset-management-system.git
cd asset-management-system/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
ng serve
```

A aplicação estará disponível em `http://localhost:4200/`

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Inicia o servidor de desenvolvimento
npm run watch      # Build em modo watch

# Build
npm run build      # Build para produção

# Testes
npm test           # Executa testes unitários
npm run lint       # Executa linting do código
```

## 🎨 Interface do Usuário

O sistema utiliza **Angular Material** para uma interface moderna e responsiva:

- **Tabelas interativas** com ordenação e filtros
- **Formulários validados** com feedback visual
- **Modais de confirmação** para ações críticas
- **Loading states** e indicadores de progresso
- **Design responsivo** para diferentes dispositivos
- **Tema consistente** com Material Design

## 🔗 Integração com Backend

O frontend se comunica com a API REST através dos serviços:

- **CompanyService**: `/companies` - CRUD de empresas
- **EmployeeService**: `/employees` - CRUD de funcionários  
- **AssetService**: `/assets` - CRUD de ativos

### Configuração da API
A URL base da API está configurada como `http://localhost:3000` nos serviços. Para alterar, modifique a propriedade `apiUrl` em cada serviço.

## 🧪 Testes

```bash
# Executar testes unitários
ng test

# Executar testes com coverage
ng test --code-coverage
```

## 📱 Navegação

O sistema possui as seguintes rotas:

- `/empresas` - Lista de empresas (página inicial)
- `/empresas/:id` - Detalhes da empresa e funcionários
- `/funcionario/:employeeId` - Gestão de ativos do funcionário

## 🔧 Desenvolvimento

### Estrutura de um componente
Cada componente segue a estrutura:
- `componente.ts` - Lógica do componente
- `componente.html` - Template
- `componente.scss` - Estilos
- `componente.spec.ts` - Testes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
