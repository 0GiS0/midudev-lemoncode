import os
from dotenv import load_dotenv
from openai import OpenAI
from rich import print as rprint
from rich.panel import Panel
from rich.console import Console

# Load environment variables from a .env file
load_dotenv()

console = Console()

# Styled startup message
console.print(Panel("[bold green]🚀 Starting AI App...[/bold green]", expand=False, border_style="green"))

# Print the environment variables for debugging
llm_url = os.getenv('LLM_URL')
llm_model = os.getenv('LLM')
console.print(f"[bold cyan]LLM_URL:[/bold cyan] [white]{llm_url}[/white]")
console.print(f"[bold cyan]LLM MODEL:[/bold cyan] [white]{llm_model}[/white]")

# Create OpenAI client
client = OpenAI(
    base_url=llm_url,
    api_key="docker",
)

prompt = """
"Escribe un mensaje de bienvenida en español para una descripción de Twitch. 
El mensaje debe ser divertido, cercano, con emojis y debe contar que en este directo hemos hecho un repaso al mundo de los contenedores
y que, como no podía ser de otra forma, hemos terminando hablando de IA. ¡Hazlo atractivo para el que se lo encuentra por primera vez!"
"""


# Call the OpenAI API to generate text
response = client.chat.completions.create(
    messages=[{"role": "user", "content": prompt}], 
    model=llm_model
)

# Pretty print the response in a panel
content = response.choices[0].message.content
console.print(Panel(f"[bold yellow]Response from OpenAI:[/bold yellow]\n[white]{content}[/white]", title="🤖 OpenAI", border_style="magenta"))