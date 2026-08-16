import os
from datetime import date
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import Client, create_client


load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODELOS
# ============================================================

class TarefaCriacao(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: str
    status: str


class TarefaAtualizacao(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: str
    status: str


# ============================================================
# AUTENTICAÇÃO
# ============================================================

def obter_token(authorization: str | None):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Token de autenticação não informado."
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Formato do token inválido."
        )

    return authorization.replace("Bearer ", "", 1)


def obter_usuario(authorization: str | None):
    token = obter_token(authorization)

    resposta = supabase.auth.get_user(token)

    if resposta.user is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário não autenticado."
        )

    return resposta.user


def criar_cliente_autenticado(token: str):
    cliente = create_client(
        SUPABASE_URL,
        SUPABASE_KEY
    )

    cliente.postgrest.auth(token)

    return cliente


# ============================================================
# ROTAS BÁSICAS
# ============================================================

@app.get("/")
def inicio():
    return {
        "mensagem": "API funcionando!"
    }


@app.get("/me")
def usuario_atual(
    authorization: str | None = Header(default=None)
):
    usuario = obter_usuario(authorization)

    return {
        "id": usuario.id,
        "email": usuario.email
    }


# ============================================================
# CRIAR TAREFA
# ============================================================

@app.post("/tasks")
def criar_tarefa(
    tarefa: TarefaCriacao,
    authorization: str | None = Header(default=None)
):
    token = obter_token(authorization)
    usuario = obter_usuario(authorization)

    cliente = criar_cliente_autenticado(token)

    dados = {
        "user_id": usuario.id,
        "title": tarefa.title,
        "description": tarefa.description,
        "due_date": (
            tarefa.due_date.isoformat()
            if tarefa.due_date
            else None
        ),
        "priority": tarefa.priority,
        "status": tarefa.status
    }

    resposta = (
        cliente
        .table("tasks")
        .insert(dados)
        .execute()
    )

    return {
        "mensagem": "Tarefa criada com sucesso!",
        "tarefa": resposta.data[0]
    }


# ============================================================
# LISTAR TAREFAS
# ============================================================

@app.get("/tasks")
def listar_tarefas(
    authorization: str | None = Header(default=None)
):
    token = obter_token(authorization)

    cliente = criar_cliente_autenticado(token)

    resposta = (
        cliente
        .table("tasks")
        .select("*")
        .order("id", desc=True)
        .execute()
    )

    return resposta.data


# ============================================================
# EDITAR TAREFA
# ============================================================

@app.put("/tasks/{task_id}")
def atualizar_tarefa(
    task_id: str,
    tarefa: TarefaAtualizacao,
    authorization: str | None = Header(default=None)
):
    token = obter_token(authorization)
    usuario = obter_usuario(authorization)

    cliente = criar_cliente_autenticado(token)

    dados = {
        "title": tarefa.title,
        "description": tarefa.description,
        "due_date": (
            tarefa.due_date.isoformat()
            if tarefa.due_date
            else None
        ),
        "priority": tarefa.priority,
        "status": tarefa.status
    }

    resposta = (
        cliente
        .table("tasks")
        .update(dados)
        .eq("id", task_id)
        .eq("user_id", usuario.id)
        .execute()
    )

    if not resposta.data:
        raise HTTPException(
            status_code=404,
            detail="Tarefa não encontrada."
        )

    return {
        "mensagem": "Tarefa atualizada com sucesso!",
        "tarefa": resposta.data[0]
    }


# ============================================================
# EXCLUIR TAREFA
# ============================================================

@app.delete("/tasks/{task_id}")
def excluir_tarefa(
    task_id: str,
    authorization: str | None = Header(default=None)
):
    token = obter_token(authorization)
    usuario = obter_usuario(authorization)

    cliente = criar_cliente_autenticado(token)

    resposta = (
        cliente
        .table("tasks")
        .delete()
        .eq("id", task_id)
        .eq("user_id", usuario.id)
        .execute()
    )

    if not resposta.data:
        raise HTTPException(
            status_code=404,
            detail="Tarefa não encontrada."
        )

    return {
        "mensagem": "Tarefa excluída com sucesso!"
    }