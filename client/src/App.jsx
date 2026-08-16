import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function obterDataDeHoje() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

const hoje = obterDataDeHoje();

async function apiFetch(caminho, { method = "GET", body } = {}) {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        return {
            ok: false,
            autenticado: false,
            dados: { detail: "Usuário não autenticado." }
        };
    }

    const token = data.session.access_token;

    const headers = { Authorization: `Bearer ${token}` };
    if (body) {
        headers["Content-Type"] = "application/json";
    }

    const resposta = await fetch(`${API_URL}${caminho}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    const dados = await resposta.json();

    // Erros de validação do FastAPI (422) vêm como lista {loc, msg, type}
    if (Array.isArray(dados?.detail) && dados.detail.length > 0) {
        dados.detail = dados.detail.map((d) => d.msg).join("; ");
    }

    return { ok: resposta.ok, autenticado: true, dados };
}

function App() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [usuarioBackend, setUsuarioBackend] = useState(null);

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataLimite, setDataLimite] = useState("");
    const [prioridade, setPrioridade] = useState("Baixa");
    const [status, setStatus] = useState("Pendente");

    const [tarefas, setTarefas] = useState([]);
    const [tarefaEditando, setTarefaEditando] = useState(null);

    async function verificarSessao() {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Erro ao verificar sessão:", error);
            return;
        }

        if (data.session) {
            setUsuario(data.session.user);
            await listarTarefas();
        } else {
            setUsuario(null);
        }
    }

    useEffect(() => {
        // Restauração de sessão no carregamento é intencional:
        // setState aqui é assíncrono (após getSession) e roda uma única vez.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        verificarSessao();
    }, []);

    async function cadastrar() {
        setMensagem("");

        const { error } = await supabase.auth.signUp({
            email: email,
            password: senha
        });

        if (error) {
            setMensagem(error.message);
            return;
        }

        setMensagem("Cadastro realizado! Verifique seu email.");
    }

    async function entrar() {
        setMensagem("");

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: email,
                password: senha
            });

        if (error) {
            setMensagem(error.message);
            return;
        }

        setUsuario(data.user);
        setMensagem("Login realizado com sucesso!");

        await listarTarefas();
    }

    async function testarBackend() {
        setMensagem("");

        const { ok, dados } = await apiFetch("/me");

        if (!ok) {
            setMensagem(
                dados.detail || "Erro ao acessar o backend."
            );
            return;
        }

        setUsuarioBackend(dados);
        setMensagem("Backend respondeu com sucesso!");
    }

    function validarFormulario() {
        if (!titulo.trim()) {
            setMensagem("Preencha o título da tarefa.");
            return false;
        }

        if (!dataLimite) {
            setMensagem("Preencha a data limite.");
            return false;
        }

        return true;
    }

    function montarPayload() {
        return {
            title: titulo,
            description: descricao || null,
            due_date: dataLimite,
            priority: prioridade,
            status: status
        };
    }

    function limparFormulario() {
        setTitulo("");
        setDescricao("");
        setDataLimite("");
        setPrioridade("Baixa");
        setStatus("Pendente");
    }

    async function criarTarefa() {
        setMensagem("");

        if (!validarFormulario()) {
            return;
        }

        const { ok, dados } = await apiFetch("/tasks", {
            method: "POST",
            body: montarPayload()
        });

        if (!ok) {
            setMensagem(dados.detail || "Erro ao criar tarefa.");
            return;
        }

        setMensagem("Tarefa criada com sucesso!");

        limparFormulario();

        await listarTarefas();
    }

    async function listarTarefas() {
        const { ok, autenticado, dados } = await apiFetch("/tasks");

        if (!autenticado) {
            return;
        }

        if (!ok) {
            setMensagem(dados.detail || "Erro ao listar tarefas.");
            return;
        }

        setTarefas(dados);
    }

    function iniciarEdicao(tarefa) {
        setTarefaEditando(tarefa);

        setTitulo(tarefa.title);
        setDescricao(tarefa.description || "");
        setDataLimite(tarefa.due_date || "");
        setPrioridade(tarefa.priority);
        setStatus(tarefa.status);
    }

    async function atualizarTarefa() {
        setMensagem("");

        if (!validarFormulario()) {
            return;
        }

        const { ok, dados } = await apiFetch(
            `/tasks/${tarefaEditando.id}`,
            {
                method: "PUT",
                body: montarPayload()
            }
        );

        if (!ok) {
            setMensagem(dados.detail || "Erro ao atualizar tarefa.");
            return;
        }

        setMensagem("Tarefa atualizada com sucesso!");

        setTarefaEditando(null);

        limparFormulario();

        await listarTarefas();
    }

    async function excluirTarefa(id) {
        setMensagem("");

        const { ok, dados } = await apiFetch(`/tasks/${id}`, {
            method: "DELETE"
        });

        if (!ok) {
            setMensagem(dados.detail || "Erro ao excluir tarefa.");
            return;
        }

        setMensagem("Tarefa excluída com sucesso!");

        await listarTarefas();
    }

    async function sair() {
        await supabase.auth.signOut();

        setUsuario(null);
        setUsuarioBackend(null);
        setTarefas([]);
        setMensagem("Logout realizado com sucesso!");
    }

    return (
        <div>
            <h1>Gerenciador de Tarefas</h1>

            {usuario && (
                <>
                    <p>
                        Usuário autenticado:{" "}
                        {usuario.email}
                    </p>

                    <button onClick={sair}>
                        Sair
                    </button>
                </>
            )}

            <hr />

            <h2>Autenticação</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) =>
                    setSenha(e.target.value)
                }
            />

            <div>
                <button onClick={cadastrar}>
                    Cadastrar
                </button>

                <button onClick={entrar}>
                    Entrar
                </button>
            </div>

            {usuario && (
                <button onClick={testarBackend}>
                    Testar comunicação com backend
                </button>
            )}

            {usuarioBackend && (
                <div>
                    <p>ID retornado pelo backend:</p>
                    <p>{usuarioBackend.id}</p>

                    <p>
                        Email retornado pelo backend:
                    </p>
                    <p>{usuarioBackend.email}</p>
                </div>
            )}

            {usuario && (
                <>
                    <hr />

                    <h2>
                        {tarefaEditando
                            ? "Editar tarefa"
                            : "Nova tarefa"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) =>
                            setTitulo(e.target.value)
                        }
                    />

                    <br />

                    <textarea
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) =>
                            setDescricao(e.target.value)
                        }
                    />

                    <br />

                    <label>
                        Data limite:

                        <input
                            type="date"
                            min={hoje}
                            value={dataLimite}
                            onChange={(e) =>
                                setDataLimite(
                                    e.target.value
                                )
                            }
                        />
                    </label>

                    <br />

                    <label>
                        Prioridade:

                        <select
                            value={prioridade}
                            onChange={(e) =>
                                setPrioridade(
                                    e.target.value
                                )
                            }
                        >
                            <option value="Baixa">
                                Baixa
                            </option>

                            <option value="Média">
                                Média
                            </option>

                            <option value="Alta">
                                Alta
                            </option>
                        </select>
                    </label>

                    <br />

                    <label>
                        Status:

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                        >
                            <option value="Pendente">
                                Pendente
                            </option>

                            <option value="Em andamento">
                                Em andamento
                            </option>

                            <option value="Concluída">
                                Concluída
                            </option>
                        </select>
                    </label>

                    <br />

                    <button
                        onClick={
                            tarefaEditando
                                ? atualizarTarefa
                                : criarTarefa
                        }
                    >
                        {tarefaEditando
                            ? "Salvar alterações"
                            : "Criar tarefa"}
                    </button>
                </>
            )}

            {usuario && tarefas.length > 0 && (
                <>
                    <hr />

                    <h2>Minhas tarefas</h2>

                    <div>
                        {tarefas.map((tarefa) => (
                            <div key={tarefa.id}>
                                <h3>
                                    {tarefa.title}
                                </h3>

                                <p>
                                    {tarefa.description}
                                </p>

                                <p>
                                    Data limite:{" "}
                                    {tarefa.due_date ||
                                        "Não definida"}
                                </p>

                                <p>
                                    Prioridade:{" "}
                                    {tarefa.priority}
                                </p>

                                <p>
                                    Status:{" "}
                                    {tarefa.status}
                                </p>

                                <button onClick={() => excluirTarefa(tarefa.id)}>
                                    Excluir
                                </button>

                                <button
                                    onClick={() =>
                                        iniciarEdicao(
                                            tarefa
                                        )
                                    }
                                >
                                    Editar
                                </button>

                                <hr />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {mensagem && (
                <p>{mensagem}</p>
            )}
        </div>
    );
}

export default App;
