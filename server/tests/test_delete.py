import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app
from app.dependencies.auth import AuthenticatedClient, get_authenticated_client

client = TestClient(app)


def test_deletar_tarefa_sucesso(monkeypatch):
    usuario = SimpleNamespace(
        id="usuario-teste-id",
        email="usuario@teste.com"
    )

    tarefa_existente = {
        "id": "tarefa-teste-id",
        "title": "Estudar FastAPI",
        "description": "Revisar testes de integração.",
        "due_date": "2099-12-31",
        "priority": "Alta",
        "status": "Pendente",
        "user_id": "usuario-teste-id"
    }

    class ClienteSupabaseFake:
        filtros = []

        def table(self, nome_tabela):
            assert nome_tabela == "tasks"
            return self

        def delete(self):
            return self

        def eq(self, campo, valor):
            self.filtros.append((campo, valor))
            return self

        def execute(self):
            assert self.filtros == [
                ("id", "tarefa-teste-id"),
                ("user_id", "usuario-teste-id")
            ]
            return SimpleNamespace(data=[tarefa_existente])

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

    response = client.delete("/tasks/tarefa-teste-id")

    assert response.status_code == 200
    assert response.json() == {
        "mensagem": "Tarefa excluída com sucesso!"
    }


def test_deletar_tarefa_nao_encontrada(monkeypatch):
    usuario = SimpleNamespace(
        id="usuario-teste-id",
        email="usuario@teste.com"
    )

    class ClienteSupabaseFake:
        filtros = []

        def table(self, nome_tabela):
            assert nome_tabela == "tasks"
            return self

        def delete(self):
            return self

        def eq(self, campo, valor):
            self.filtros.append((campo, valor))
            return self

        def execute(self):
            assert self.filtros == [
                ("id", "tarefa-inexistente-id"),
                ("user_id", "usuario-teste-id")
            ]
            return SimpleNamespace(data=[])

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

    response = client.delete("/tasks/tarefa-inexistente-id")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Tarefa não encontrada."
    }