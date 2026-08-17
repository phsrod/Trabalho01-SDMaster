from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, field_validator


class TarefaBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: date
    priority: Literal["Baixa", "Média", "Alta"]
    status: Literal["Pendente", "Em andamento", "Concluída"]

    @field_validator("title")
    @classmethod
    def validar_titulo(cls, valor):
        valor = valor.strip()

        if not valor:
            raise ValueError("O título não pode ser vazio.")

        return valor

    @field_validator("due_date")
    @classmethod
    def validar_data_limite(cls, valor):
        if valor < date.today():
            raise ValueError(
                "A data limite não pode ser anterior ao dia atual."
            )

        return valor


class TarefaCriacao(TarefaBase):
    pass


class TarefaAtualizacao(TarefaBase):
    pass