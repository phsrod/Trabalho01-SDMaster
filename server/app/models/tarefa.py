from datetime import date
from typing import Optional
from pydantic import BaseModel


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