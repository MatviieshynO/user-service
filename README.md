# 🔐 User Service

🚀 **Auth Microservice** is a microservice responsible for user management, authentication, and authorization. Built with **NestJS** and **TypeScript**, it uses **JWT**, **Prisma (PostgreSQL)**, **Redis**, **Nodemailer**, **ElasticSearch**, and **Docker**.

---

## 📌 Technologies & Stack

- **Backend:** [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
- **Validation:** [Joi](https://joi.dev/)
- **Password Hashing:** [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Caching & Token Blacklist:** [Redis](https://redis.io/)
- **Logging:** [ElasticSearch](https://www.elastic.co/), [Kibana](https://www.elastic.co/kibana), [Winston](https://www.npmjs.com/package/winston)
- **Task Scheduling:** [Cron Jobs](https://www.npmjs.com/package/node-cron)
- **Email Notifications:** [Nodemailer](https://nodemailer.com/)
- **Configuration Management:** [dotenv](https://www.npmjs.com/package/dotenv)
- **Docker:** for containerization

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-repo/auth-microservice.git
cd auth-microservice
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up environment variables
Create a `.env` file:
```ini
# Server
PORT=3000

# Logger &  Elasticsearch & Kibana & Write in logs/app.log file
LOG_LEVEL=debug
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_ENABLED=false
LOG_TO_FILE=false

# Postgres + Prisma
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=nestDB
DATABASE_URL=postgresql://admin:admin@localhost:5432/nestDB?schema=sample

#  JWT
JWT_ACCESS_SECRET=my-access-secret
JWT_REFRESH_SECRET=my-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_DEFAULT_SECRET=defoult_secret

# Gmail SMTP Config
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password
MAIL_FROM=Your App <no-reply@yourapp.com>


# Hash BCript
SALT_ROUNDS=10

# Confirm email or phone code expired 
 CODE_EXPIRATION_TIME= 1800000

# Redis
REDIS_PASSWORD=mystrongpassword
REDIS_URL=redis://default:mystrongpassword@127.0.0.1:6379
```

### 4️⃣ Start database with Docker
```sh
docker-compose up -d
```

### 5️⃣ Run Prisma migrations
```sh
npx prisma migrate dev --name init
```

### 6️⃣ Start the server
```sh
npm run start:dev
```

---

## 🔑 Key Features
✅ User Registration  
✅ Authentication (Login) with JWT  
✅ Token Refresh (refresh token)  
✅ Password Change  
✅ Password Recovery via Email (Nodemailer)  
✅ Logout with Token Blacklist (Redis)  
✅ User Management (CRUD)  
✅ Logging with Elasticsearch + Kibana  
✅ Old Session Cleanup via Cron Jobs  

---

## 🛠 API Endpoints

### 📌 Authentication
| Method | Endpoint | Description |
|--------|----------------|--------------------------------|
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | Login (returns `accessToken` + `refreshToken`) |
| `POST` | `/auth/refresh` | Refresh access token (`refreshToken`) |
| `POST` | `/auth/logout` | Logout (deletes session + blacklist token) |

### 📌 Users
| Method | Endpoint | Description |
|--------|----------------|---------------------------|
| `GET` | `/users/me` | Get current user |
| `GET` | `/users/:id` | Get user by ID |
| `PATCH` | `/users/:id` | Update user data |
| `DELETE` | `/users/:id` | Delete user |

---

## 📡 API Documentation (Swagger)

API documentation is available at:  
🔗 `http://localhost:3000/api/docs`

---

## 📜 Project Structure
```
auth-microservice/
│── src/
│   ├── auth/         # Authentication logic
│   ├── users/        # User management logic
│   ├── common/       # Shared services and utilities
│   ├── config/       # Configuration (dotenv)
│   ├── prisma/       # ORM Prisma
│── docker-compose.yml # Docker configuration
│── .env.example       # Example environment variables
│── README.md          # This file 🙂
```

---

## 📬 Contact
✉️ Email: Olopromotion@gmail.com  
---
