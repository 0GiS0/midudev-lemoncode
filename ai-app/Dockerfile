
# Usar una imagen base oficial de Python
FROM python:3.11-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar requirements primero para aprovechar el cache
COPY requirements.txt ./

# Instalar dependencias
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código fuente
COPY . .

# Crear un usuario no root por seguridad
RUN useradd -m appuser \
    && chown -R appuser /app
USER appuser

# Exponer el puerto si aplica (ajustar si la app usa otro puerto)
EXPOSE 8000

# Comando por defecto para ejecutar la app
CMD ["python", "app.py"]
