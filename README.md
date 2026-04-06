# Micro Bank

A full-stack banking application built with Spring Boot and React.

---

## Project Structure

```
Micro-Bank/
  Backend/    Spring Boot REST API
  frontend/   React + TypeScript frontend
```

---

## Backend

**Stack:** Java 21, Spring Boot 3.5.13, Spring Security, JWT, JPA, MySQL

**Package:** `com.example.Micro_Bank`

### Setup

1. Create a MySQL database named `microbank`
2. Update `src/main/resources/application.properties` with your DB credentials
3. Run the application

```
cd Backend
mvn spring-boot:run
```

The server starts on `http://localhost:9090`

### Configuration

```
spring.datasource.url=jdbc:mysql://localhost:3306/microbank
spring.datasource.username=<your_username>
spring.datasource.password=<your_password>
jwt.secret=<your_secret>
jwt.expiration=86400000
```

### API Endpoints

**Public**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/user/register | Register a new user |
| POST | /api/user/login | Login and receive JWT token |

**Protected (requires Authorization: Bearer token)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/account/deposit | Deposit amount |
| POST | /api/account/withdraw | Withdraw amount |
| POST | /api/transaction/transfer | Transfer to another account |
| GET | /api/transaction/history/{accountId} | Get transaction history |

### Request Examples

Register
```json
POST /api/user/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

Deposit
```json
POST /api/account/deposit
Authorization: Bearer <token>
{
  "accountId": 1,
  "amount": 500.0
}
```

Transfer
```json
POST /api/transaction/transfer
Authorization: Bearer <token>
{
  "senderAccountId": 1,
  "receiverAccountId": 2,
  "amount": 200.0
}
```

### Security

- Passwords are hashed using BCrypt
- Authentication is handled via JWT tokens
- All endpoints except register and login require a valid token
- Spring Security enforces access control on every request

### Project Layout

```
Backend/src/main/java/com/example/Micro_Bank/
  Controller/       AccountController, TransactionController, UserController
  DTO/              Request and response data transfer objects
  Entity/           User, Account, Transaction
  Repository/       JPA repositories
  Security/         JwtUtil, JwtFilter, SecurityConfig
  Service/          AccountService, TransactionService, UserService
```

---

## Frontend

**Stack:** React 19, TypeScript, Vite

### Setup

```
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`

### Pages

- Login - email and password login, redirects to dashboard on success
- Register - creates a new user and account, redirects to dashboard
- Dashboard - shows current balance with deposit, withdraw, and transfer actions
- History tab - lists all transactions with type, amount, and date

### API Communication

All API calls are in `src/api.ts`. After login or register, the JWT token is stored in `localStorage` and attached as an `Authorization` header on every subsequent request.

### Project Layout

```
frontend/src/
  pages/      Login.tsx, Register.tsx, Dashboard.tsx
  api.ts      All backend API calls
  App.tsx     Page routing and auth state
  index.css   Global styles
```
