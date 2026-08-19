import sys
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient
from main import app
from app.dependencies.auth import ClienteAutenticado, obter_cliente_autenticado

client = TestClient(app)



def test_atualizar_tarefa_sucesso(monkeypatch):
	usuario = SimpleNamespace(
		id="usuario-teste-id",
		email="usuario@teste.com"
	)

	tarefa_atualizada = {
		"id": "tarefa-1",
		"title": "Estudar FastAPI atualizado",
		"description": "Revisar testes de integração.",
		"due_date": "2099-12-31",
		"priority": "Alta",
		"status": "Concluída",
		"user_id": "usuario-teste-id"
	}

	class ClienteSupabaseFake:
		filtros = []

		def table(self, nome_tabela):
			assert nome_tabela == "tasks"
			return self

		def update(self, dados):
			assert dados == {
				"title": "Estudar FastAPI atualizado",
				"description": "Revisar testes de integração.",
				"due_date": "2099-12-31",
				"priority": "Alta",
				"status": "Concluída"
			}
			return self

		def eq(self, campo, valor):
			self.filtros.append((campo, valor))
			return self

		def execute(self):
			assert self.filtros == [
				("id", "tarefa-1"),
				("user_id", "usuario-teste-id")
			]
			return SimpleNamespace(data=[tarefa_atualizada])

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

	response = client.put(
		"/tasks/tarefa-1",
		json={
			"title": "Estudar FastAPI atualizado",
			"description": "Revisar testes de integração.",
			"due_date": "2099-12-31",
			"priority": "Alta",
			"status": "Concluída"
		}
	)

	assert response.status_code == 200
	assert response.json() == {
		"mensagem": "Tarefa atualizada com sucesso!",
		"tarefa": tarefa_atualizada
	}



def test_atualizar_tarefa_falha(monkeypatch):
	usuario = SimpleNamespace(
      id="usuario-teste-id",
      email="usuario@teste.com"
    )
	
	class ClienteSupabaseFake:
		filtros = []

		def table(self, nome_tabela):
			assert nome_tabela == "tasks"
			return self

		def update(self, dados):
			return self

		def eq(self, campo, valor):
			self.filtros.append((campo, valor))
			return self

		def execute(self):
			assert self.filtros == [
				("id", "tarefa-2"),
				("user_id", "usuario-teste-id")
			]
			return SimpleNamespace(data=[])

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

	response = client.put(
		"/tasks/tarefa-2",
		json={
			"title": "Estudar FastAPI atualizado",
			"description": "Revisar testes de integração.",
			"due_date": "2099-12-31",
			"priority": "Alta",
			"status": "Concluída"
		}
	)

	assert response.status_code == 404
	assert response.json() == {
		"detail": "Tarefa não encontrada."
	}

