# Python backend with fastAPI
## Setup and running the backend

### Ollama
- pull the model "gemma3:latest" using `ollama pull "gemma3:latest"` in a terminal
- run `ollama serve` in terminal
    - if it says port already in use, it means it's already running

### Python
- Create a virtual environment for python (venv preferred)
- Activate the virtual environment
- Run the following commands one at a time:
```bash
    # MacOS / Linux
    pip install "fastapi[standard]"
    pip install -r requirements.txt
    cat .env.example > .env
    fastapi dev main.py
```

```pwsh
    # Windows
    pip install "fastapi[standard]"
    pip install -r requirements.txt
    Get-Content .env.example | Out-File .env
    fastapi dev main.py
```

## Using the API
Routes:
- `/` - GET
- `/api/ollama/test` - GET
- `/api/ollama/chat` - POST
    - body should be `{'message': <Your query here>}`