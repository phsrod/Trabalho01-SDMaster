import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app
from app.dependencies import auth as auth_dependencies


client = TestClient(app)


def test_autenticacao_valida(monkeypatch): # Verifica se a autenticação é válida e retorna o usuário autenticado.
    usuario = SimpleNamespace(
        id="usuario-teste-id",
        email="usuario@teste.com"
    )
    resposta_supabase = SimpleNamespace(user=usuario)

    def get_user(token):
        assert token == "token-de-teste"
        return resposta_supabase

    monkeypatch.setattr(
        auth_dependencies,
        "supabase",
        SimpleNamespace(auth=SimpleNamespace(get_user=get_user))
    )

    response = client.get(
        "/me",
        headers={"Authorization": "Bearer token-de-teste"}
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": "usuario-teste-id",
        "email": "usuario@teste.com"
    }

def test_autenticacao_falha(monkeypatch): # Verifica se a autenticação falha quando o usuário não é autenticado.
    def get_user(token):
        assert token == "token-de-teste"
        return SimpleNamespace(user=None)

    monkeypatch.setattr(
        auth_dependencies,
        "supabase",
        SimpleNamespace(auth=SimpleNamespace(get_user=get_user))
    )

    response = client.get(
        "/me",
        headers={"Authorization": "Bearer token-de-teste"}
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Usuário não autenticado."
    }


def test_autenticacao_sem_token(): # Verifica se a autenticação falha quando o token não é informado.
    response = client.get("/me")

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Token de autenticação não informado."
    }

def test_autenticacao_formato_token_invalido(): # Verifica se a autenticação falha quando o formato do token é inválido.
    response = client.get(
        "/me",
        headers={"Authorization": "token-de-teste-invalido"}
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Formato do token inválido."
    }