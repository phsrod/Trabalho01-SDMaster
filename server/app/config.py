import os
from pathlib import Path

from dotenv import load_dotenv


# Carrega o .env da raiz do repositório (um único arquivo para client e server).
# Client e server compartilham as mesmas variáveis VITE_ (URL e chave publishable).
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")