from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.auth import AuthenticatedClient, get_authenticated_client
from app.models.task import TaskCreate, TaskUpdate


router = APIRouter()


def build_task_data(task, user_id=None):
    data = {
        "title": task.title,
        "description": task.description,
        "due_date": task.due_date.isoformat() if task.due_date else None,
        "priority": task.priority,
        "status": task.status,
    }

    if user_id:
        data["user_id"] = user_id

    return data


@router.post("/tasks")
def create_task(
    task: TaskCreate,
    auth: AuthenticatedClient = Depends(get_authenticated_client)
):
    response = (
        auth.client
        .table("tasks")
        .insert(build_task_data(task, auth.user.id))
        .execute()
    )

    return {
        "mensagem": "Tarefa criada com sucesso!",
        "tarefa": response.data[0]
    }


@router.get("/tasks")
def list_tasks(
    auth: AuthenticatedClient = Depends(get_authenticated_client)
):
    response = (
        auth.client
        .table("tasks")
        .select("*")
        .eq("user_id", auth.user.id)
        .execute()
    )

    return response.data


@router.put("/tasks/{task_id}")
def update_task(
    task_id: str,
    task: TaskUpdate,
    auth: AuthenticatedClient = Depends(get_authenticated_client)
):
    response = (
        auth.client
        .table("tasks")
        .update(build_task_data(task))
        .eq("id", task_id)
        .eq("user_id", auth.user.id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Tarefa não encontrada."
        )

    return {
        "mensagem": "Tarefa atualizada com sucesso!",
        "tarefa": response.data[0]
    }


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    auth: AuthenticatedClient = Depends(get_authenticated_client)
):
    response = (
        auth.client
        .table("tasks")
        .delete()
        .eq("id", task_id)
        .eq("user_id", auth.user.id)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="Tarefa não encontrada."
        )

    return {
        "mensagem": "Tarefa excluída com sucesso!"
    }
