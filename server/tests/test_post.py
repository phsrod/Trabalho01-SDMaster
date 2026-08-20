import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app
from app.dependencies.auth import AuthenticatedClient, get_authenticated_client

client = TestClient(app)


def test_criar_tarefa(monkeypatch):
    usuario = SimpleNamespace(
        id="usuario-teste-id",
        email="usuario@teste.com"
    )

    tarefa_criada = {
        "title": "Estudar FastAPI",
        "description": "Revisar testes de integração.",
        "due_date": "2099-12-31",
        "priority": "Alta",
        "status": "Pendente",
        "user_id": "usuario-teste-id"
    }

    class ClienteSupabaseFake:
        def table(self, nome_tabela):
            assert nome_tabela == "tasks"
            return self

        def insert(self, dados):
            assert dados == tarefa_criada
            return self

        def execute(self):
            return SimpleNamespace(data=[tarefa_criada])

    def obter_cliente_fake():
        return AuthenticatedClient(
            client=ClienteSupabaseFake(),
            user=usuario
        )

    monkeypatch.setitem(
        app.dependency_overrides,
        get_authenticated_client,
        obter_cliente_fake
    )

    response = client.post(
        "/tasks",
        json={
            "title": "Estudar FastAPI",
            "description": "Revisar testes de integração.",
            "due_date": "2099-12-31",
            "priority": "Alta",
            "status": "Pendente"
        }
    )

    assert response.status_code == 200
    assert response.json() == {
        "mensagem": "Tarefa criada com sucesso!",
        "tarefa": tarefa_criada
    }