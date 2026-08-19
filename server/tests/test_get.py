import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app
from app.dependencies.auth import ClienteAutenticado, obter_cliente_autenticado

client = TestClient(app)


def test_listar_tarefas(monkeypatch):
    usuario = SimpleNamespace(
        id="usuario-teste-id",
        email="usuario@teste.com"
    )

    tarefas = [
        {
            "id": "tarefa-1",
            "title": "Estudar FastAPI",
            "description": "Revisar testes.",
            "due_date": "2099-12-31",
            "priority": "Alta",
            "status": "Pendente",
            "user_id": "usuario-teste-id"
        },
        {
            "id": "tarefa-2",
            "title": "Estudar Vue",
            "description": "Revisar componentes.",
            "due_date": "2099-12-30",
            "priority": "Média",
            "status": "Pendente",
            "user_id": "usuario-teste-id"
        },
        {
            "id": "tarefa-3",
            "title": "Estudar React",
            "description": "Revisar hooks.",
            "due_date": "2099-12-29",
            "priority": "Baixa",
            "status": "Pendente",
            "user_id": "usuario-teste-id"
        },
        {
            "id": "tarefa-4",
            "title": "Estudar Angular",
            "description": "Revisar diretivas.",
            "due_date": "2099-12-28",
            "priority": "Alta",
            "status": "Pendente",
            "user_id": "usuario-teste-id-2"
        }
    ]

    class ClienteSupabaseFake:
        filtro = None

        def table(self, nome_tabela):
            assert nome_tabela == "tasks"
            return self

        def select(self, campos):
            assert campos == "*"
            return self

        def eq(self, campo, valor):
            assert campo == "user_id"
            assert valor == "usuario-teste-id"
            self.filtro = (campo, valor)
            return self

        def execute(self):
            tarefas_filtradas = [
                tarefa
                for tarefa in tarefas
                if tarefa["user_id"] == self.filtro[1]
            ]
            return SimpleNamespace(data=tarefas_filtradas)

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

    response = client.get("/tasks")

    assert response.status_code == 200
    assert response.json() == [
        tarefa
        for tarefa in tarefas
        if tarefa["user_id"] == usuario.id
    ]