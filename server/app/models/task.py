from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, field_validator


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: date
    priority: Literal["Baixa", "Média", "Alta"]
    status: Literal["Pendente", "Em andamento", "Concluída"]

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("O título não pode ser vazio.")
        return value

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, value):
        if value < date.today():
            raise ValueError("A data limite não pode ser anterior ao dia atual.")
        return value


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass
