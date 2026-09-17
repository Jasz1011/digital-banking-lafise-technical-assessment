# API Examples

Los montos JSON son números decimales. La referencia visual `C$` corresponde al contexto nicaragüense y no agrega una propiedad `Currency` al modelo.

## Create Customer

```http
POST /api/customers
Content-Type: application/json
```

```json
{
  "fullName": "María Fernanda López",
  "birthDate": "1992-06-15",
  "gender": "Femenino",
  "monthlyIncome": 42000.50
}
```

Respuesta `201 Created`:

```json
{
  "id": "8ab967c7-9062-4fca-afc7-247e8fe2fbb2",
  "fullName": "María Fernanda López",
  "birthDate": "1992-06-15",
  "gender": "Femenino",
  "monthlyIncome": 42000.50,
  "createdAt": "2026-09-17T23:40:15.154Z"
}
```

## Create Account

```http
POST /api/accounts
Content-Type: application/json
```

```json
{
  "customerId": "8ab967c7-9062-4fca-afc7-247e8fe2fbb2",
  "initialBalance": 10000.00
}
```

Respuesta `201 Created`:

```json
{
  "id": "fae36eb6-6ffc-47ae-b467-0c8863134174",
  "accountNumber": "ACC-20260917-8967",
  "customerId": "8ab967c7-9062-4fca-afc7-247e8fe2fbb2",
  "balance": 10000.00,
  "createdAt": "2026-09-17T23:40:15.321Z"
}
```

## Get Balance

```http
GET /api/accounts/ACC-20260917-8967/balance
```

Respuesta `200 OK`:

```json
{
  "accountNumber": "ACC-20260917-8967",
  "balance": 10000.00
}
```

## Deposit

```http
POST /api/accounts/ACC-20260917-8967/deposits
Content-Type: application/json
```

```json
{
  "amount": 2500.00
}
```

Respuesta `200 OK`:

```json
{
  "accountNumber": "ACC-20260917-8967",
  "balance": 12500.00
}
```

## Withdrawal

```http
POST /api/accounts/ACC-20260917-8967/withdrawals
Content-Type: application/json
```

```json
{
  "amount": 850.00
}
```

Respuesta `200 OK`:

```json
{
  "accountNumber": "ACC-20260917-8967",
  "balance": 11650.00
}
```

## Transaction History

```http
GET /api/accounts/ACC-20260917-8967/transactions
```

Respuesta `200 OK`:

```json
[
  {
    "transactionId": "e8be0de8-aaf8-4f8c-92df-a10716d3a028",
    "type": "Deposit",
    "amount": 2500.00,
    "timestamp": "2026-09-17T23:40:15.417Z",
    "balanceAfterTransaction": 12500.00
  },
  {
    "transactionId": "db4bff7c-19c9-41c8-a7ce-e2813904d342",
    "type": "Withdrawal",
    "amount": 850.00,
    "timestamp": "2026-09-17T23:40:15.498Z",
    "balanceAfterTransaction": 11650.00
  }
]
```

## ProblemDetails

Retiro sin fondos, respuesta `400 Bad Request`:

```json
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#name-400-bad-request",
  "title": "Fondos insuficientes",
  "status": 400,
  "detail": "La cuenta no dispone de fondos suficientes para completar el retiro.",
  "instance": "/api/accounts/ACC-20260917-8967/withdrawals",
  "traceId": "0HNOL2HHCC6H1:00000001"
}
```

Cuenta inexistente, respuesta `404 Not Found`:

```json
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#name-404-not-found",
  "title": "Cuenta no encontrada",
  "status": 404,
  "detail": "No se encontró la cuenta bancaria 'ACC-19000101-0000'.",
  "instance": "/api/accounts/ACC-19000101-0000/balance",
  "traceId": "0HNOL2HHCC6H2:00000001"
}
```
