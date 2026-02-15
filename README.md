# 🚀 Freelance CRM

> CRM-система для фрилансеров — управление клиентами, проектами, задачами и финансами в одном интерфейсе.

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)

</div>

---

## 🛠️ Стек

| Направление | Технологии |
|:---|:---|
| **Frontend** | React · Tailwind CSS |
| **Backend** | FastAPI · SQLAlchemy (async) · Pydantic |
| **БД / Кэш** | PostgreSQL · Redis |
| **Безопасность** | JWT · bcrypt · httponly cookies |

---

## ⚙️ Возможности

| | Описание |
|:---|:---|
| 📊 **Дашборд** | Метрики: активные проекты, задачи, доходы, ожидаемые платежи |
| 🔐 **Аутентификация** | JWT, хэширование паролей, изоляция данных между пользователями |
| 👥 **Клиенты** | CRUD с контактами, компаниями, заметками |
| 📋 **Проекты** | Статусы, бюджеты, дедлайны, привязка к клиенту |
| ✅ **Задачи** | Приоритеты, статусы, дедлайны |
| 💰 **Платежи** | Отслеживание оплаченных и ожидающих сумм |
| ⚡ **Кэширование** | Redis для снижения нагрузки на БД |

---

## 🚀 Запуск

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
