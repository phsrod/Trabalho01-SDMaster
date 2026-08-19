# 📋 Gerenciador de Tarefas — Trabalho 01 (SD)

Sistema de gerenciamento de tarefas com autenticação, permitindo criar, listar, editar e excluir tarefas de forma organizada. Desenvolvido como projeto acadêmico da disciplina de Sistemas Distribuídos.

![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8.2.1-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white) ![Python](https://img.shields.io/badge/Python-3.13+-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688?logo=fastapi&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-2.31-3FCF8E?logo=supabase&logoColor=white) ![pytest](https://img.shields.io/badge/pytest-9.1.1-0A9EDC?logo=pytest&logoColor=white)

---

## 📦 Instruções de Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18
- [Python](https://www.python.org/) ≥ 3.12
- Conta no [Supabase](https://supabase.com/) (projeto com URL e chave publishable)

### 1. Clonar o repositório

```bash
git clone https://github.com/phsrod/Trabalho01-SDMaster.git
cd Trabalho01-SDMaster
```

### 2. Configurar variáveis de ambiente

Copie o `.env.example` para `.env` na raiz do projeto e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-aqui
VITE_API_URL=http://localhost:8000
```

### 3. Instalar e rodar o Backend

```bash
cd server

# Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate    # Windows

# Instalar dependências
pip install -r requirements.txt

# Iniciar o servidor (porta 8000)
uvicorn main:app --reload
```

### 4. Instalar e rodar o Frontend

```bash
cd client

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento (porta 5173)
npm run dev
```

### 5. Acessar a aplicação

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

---

## 🖼️ Prints da Interface

> **TODO:** Adicionar prints das principais telas da aplicação.
>
> - [ ] Tela de Login
> - [ ] Tela de Cadastro
> - [ ] Página Inicial (Home)
> - [ ] Lista de Tarefas
> - [ ] Formulário de Criação de Tarefa
> - [ ] Tela de Erro (404)

---

## 🗂️ Estrutura do Código

```
.
├── .env.example              # Template de variáveis de ambiente
├── .gitignore
├── LICENSE
├── README.md
│
├── client/                   # ── Frontend (React + Vite) ──────────────
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── src/
│       ├── main.jsx              # Entry point
│       ├── App.jsx               # Componente raiz
│       ├── api.js                # Configuração de chamadas à API
│       ├── supabaseClient.js     # Cliente Supabase (front)
│       ├── constants.js          # Labels, estilos e mapeamentos
│       ├── index.css             # Estilos globais (Tailwind)
│       ├── router/
│       │   ├── AppRouter.jsx     # Rotas da aplicação
│       │   └── ProtectedLayout.jsx  # Layout autenticado
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── HomePage.jsx
│       │   ├── TasksPage.jsx
│       │   ├── CreateTaskPage.jsx
│       │   └── NotFoundPage.jsx
│       ├── components/
│       │   ├── common/           # Componentes reutilizáveis
│       │   ├── layout/           # Layouts de página
│       │   └── tasks/            # Componentes de tarefas
│       │       ├── TaskForm.jsx
│       │       └── TaskList.jsx
│       └── context/
│           ├── TaskContext.jsx   # Context global de tarefas
│           ├── taskContext.js
│           └── useTaskContext.js
│
└── server/                   # ── Backend (FastAPI) ───────────────────
    ├── main.py                   # Entrada do servidor
    ├── requirements.txt
    └── app/
        ├── config.py             # Leitura de variáveis de ambiente
        ├── database.py           # Cliente Supabase (server)
        ├── models/
        │   └── task.py           # Pydantic models (TaskCreate, TaskUpdate)
        ├── routes/
        │   ├── auth.py           # GET /me
        │   └── tasks.py          # CRUD /tasks
        └── dependencies/
            └── auth.py           # Autenticação via Bearer token
```

---

## 🧪 Testes

### Como Instalar as Dependências de Testes

> **TODO:** Confirmar e documentar a instalação completa.

```bash
cd server

# Ativar o ambiente virtual (caso não esteja ativo)
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate    # Windows

# As dependências de teste já estão no requirements.txt:
pip install -r requirements.txt

# Ou instalar manualmente:
pip install pytest httpx
```

### Como Executar os Testes

```bash
cd server
pytest
```

Para verbose com detalhes:

```bash
pytest -v
```

### Quantidade de Testes Implementados

> **TODO:** Informar a quantidade total de testes.

```
Total de testes implementados: __
```

### Resultado da Execução dos Testes

> **TODO:** Colar aqui a saída do comando `pytest -v` após executar os testes.

```
Cole aqui a saída do pytest
```

### Descrição dos Grupos de Testes

> **TODO:** Descrever o que cada grupo de testes valida.

| Grupo | Descrição | Qtd |
|---|---|---|
| **Autenticação** | Valida fluxo de login, registro e obtenção de usuário atual | __ |
| **Tarefas — CRUD** | Valida criação, listagem, atualização e exclusão de tarefas | __ |
| **Validação de Modelos** | Valida regras de negócio dos Pydantic models (título vazio, datas inválidas) | __ |
| **Autorização** | Valida que usuários não autenticados recebem erro 401/403 | __ |

---

## 📄 Licença

Este projeto é licenciado sob a [Apache License 2.0](LICENSE).

Este projeto faz parte de um trabalho acadêmico da disciplina de Sistemas Distribuídos.