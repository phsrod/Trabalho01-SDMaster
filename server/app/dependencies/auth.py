from dataclasses import dataclass
from typing import Any

from fastapi import Header, HTTPException
from supabase import Client

from app.database import criar_cliente_autenticado, supabase


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


@dataclass
class ClienteAutenticado:
    cliente: Client
    usuario: Any


def obter_cliente_autenticado(
    authorization: str | None = Header(default=None)
) -> ClienteAutenticado:
    token = obter_token(authorization)
    usuario = obter_usuario(authorization)
    cliente = criar_cliente_autenticado(token)

    return ClienteAutenticado(
        cliente=cliente,
        usuario=usuario
    )