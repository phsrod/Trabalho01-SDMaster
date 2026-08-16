from fastapi import Header, HTTPException
from supabase import create_client

from app.config import SUPABASE_URL, SUPABASE_KEY, supabase


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