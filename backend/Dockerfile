# 1. Берём официальный образ Python 3.11 slim (лёгкий)
FROM python:3.11-slim

# 2. Обновляем системные пакеты и устанавливаем зависимости для bcrypt
RUN apt-get update && \
    apt-get install -y build-essential libffi-dev libssl-dev && \
    apt-get clean

# 3. Создаём рабочую директорию внутри контейнера
WORKDIR /app

# 4. Копируем файлы зависимостей
COPY requirements.txt .

# 5. Устанавливаем Python-зависимости
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 6. Копируем весь проект в контейнер
COPY . .

# 7. Указываем команду для запуска сервера FastAPI через Uvicorn
# --host 0.0.0.0 чтобы сервис был доступен извне
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
