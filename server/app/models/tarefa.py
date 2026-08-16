from datetime import date
from typing import Optional
from pydantic import BaseModel


class TarefaBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: str
    status: str


class TarefaCriacao(TarefaBase):
    pass


class TarefaAtualizacao(TarefaBase):
    pass