from dataclasses import dataclass
from typing import Any

from fastapi import Header, HTTPException
from supabase import Client

from app.database import create_authenticated_client, supabase


def extract_token(authorization: str | None) -> str:
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


def get_user(authorization: str | None):
    token = extract_token(authorization)
    response = supabase.auth.get_user(token)

    if response.user is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário não autenticado."
        )

    return response.user


@dataclass
class AuthenticatedClient:
    client: Client
    user: Any


def get_authenticated_client(
    authorization: str | None = Header(default=None)
) -> AuthenticatedClient:
    token = extract_token(authorization)
    user = get_user(authorization)
    client = create_authenticated_client(token)

    return AuthenticatedClient(client=client, user=user)
