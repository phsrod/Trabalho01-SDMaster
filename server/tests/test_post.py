import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app
from app.dependencies.auth import ClienteAutenticado, obter_cliente_autenticado

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
        return ClienteAutenticado(
            cliente=ClienteSupabaseFake(),
            usuario=usuario
        )

    monkeypatch.setitem(
        app.dependency_overrides,
        obter_cliente_autenticado,
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