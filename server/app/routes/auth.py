from fastapi import APIRouter, Header

from app.dependencies.auth import obter_usuario


router = APIRouter()


@router.get("/me")
def usuario_atual(
    authorization: str | None = Header(default=None)
):
    usuario = obter_usuario(authorization)

    return {
        "id": usuario.id,
        "email": usuario.email
    }