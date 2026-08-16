from supabase import Client, create_client
from app.config import SUPABASE_URL, SUPABASE_KEY


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


def criar_cliente_autenticado(token: str):
    cliente = create_client(
        SUPABASE_URL,
        SUPABASE_KEY
    )

    cliente.postgrest.auth(token)

    return cliente