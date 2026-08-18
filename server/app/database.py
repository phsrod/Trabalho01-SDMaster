from supabase import Client, create_client
from app.config import SUPABASE_URL, SUPABASE_KEY


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def create_authenticated_client(token: str) -> Client:
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    client.postgrest.auth(token)
    return client
