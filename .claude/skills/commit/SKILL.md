---
name: commit
description: Crea un commit en formato Conventional Commits y en español a partir de los cambios en staging; úsala cuando el usuario escriba /commit.
disable-model-invocation: true
---

# Commit

1. Leer los cambios en staging con `git diff --staged`.
2. Si no hay nada en staging, avisar y detenerse. Nunca hacer `git add` por su cuenta.
3. Si los cambios incluyen `.env` o algo que parezca una clave, detenerse y avisar.
4. Escribir el mensaje en formato Conventional Commits (`feat`, `fix`, `docs`, `test`, `refactor`, `chore`), en español y con máximo 72 caracteres.
5. Mostrar el mensaje y hacer el commit. Nunca hacer `push`.
