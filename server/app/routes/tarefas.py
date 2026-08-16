from fastapi import APIRouter, Header, HTTPException
from app.models.tarefa import (TarefaCriacao, TarefaAtualizacao)
from app.dependencies.autenticacao import (obter_token, obter_usuario, criar_cliente_autenticado)
from app.models.tarefa import TarefaCriacao


router = APIRouter()


@router.post("/tasks")
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

@router.get("/tasks")
def listar_tarefas(
    authorization: str | None = Header(default=None)
):
    token = obter_token(authorization)

    cliente = criar_cliente_autenticado(token)

    resposta = (
        cliente
        .table("tasks")
        .select("*")
        .execute()
    )

    return resposta.data

@router.put("/tasks/{task_id}")
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

@router.delete("/tasks/{task_id}")
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