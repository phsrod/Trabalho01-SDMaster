from fastapi import APIRouter, Header

from app.dependencies.auth import get_user


router = APIRouter()


@router.get("/me")
def current_user(authorization: str | None = Header(default=None)):
    user = get_user(authorization)

    return {
        "id": user.id,
        "email": user.email
    }