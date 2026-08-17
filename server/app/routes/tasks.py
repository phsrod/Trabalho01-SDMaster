from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import ClienteAutenticado, obter_cliente_autenticado
from app.models.task import TarefaAtualizacao, TarefaCriacao


router = APIRouter()


def montar_dados(tarefa, user_id=None):
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

    if user_id:
        dados["user_id"] = user_id

    return dados


@router.post("/tasks")
def criar_tarefa(
    tarefa: TarefaCriacao,
    auth: ClienteAutenticado = Depends(obter_cliente_autenticado)
):
    resposta = (
        auth.cliente
        .table("tasks")
        .insert(montar_dados(tarefa, auth.usuario.id))
        .execute()
    )

    return {
        "mensagem": "Tarefa criada com sucesso!",
        "tarefa": resposta.data[0]
    }

@router.get("/tasks")
def listar_tarefas(
    auth: ClienteAutenticado = Depends(obter_cliente_autenticado)
):
    resposta = (
        auth.cliente
        .table("tasks")
        .select("*")
        .eq("user_id", auth.usuario.id)
        .execute()
    )

    return resposta.data

@router.put("/tasks/{task_id}")
def atualizar_tarefa(
    task_id: str,
    tarefa: TarefaAtualizacao,
    auth: ClienteAutenticado = Depends(obter_cliente_autenticado)
):
    resposta = (
        auth.cliente
        .table("tasks")
        .update(montar_dados(tarefa))
        .eq("id", task_id)
        .eq("user_id", auth.usuario.id)
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
    auth: ClienteAutenticado = Depends(obter_cliente_autenticado)
):
    resposta = (
        auth.cliente
        .table("tasks")
        .delete()
        .eq("id", task_id)
        .eq("user_id", auth.usuario.id)
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