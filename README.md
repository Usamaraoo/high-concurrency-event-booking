# 🎟 Distributed Event Booking System

A concurrency-safe event booking system built with:

-   Node.js + Express
-   TypeScript
-   PostgreSQL (TypeORM)
-   Redis (atomic seat reservation + expiry handling)
-   BullMQ (email queue processing)
-   Stripe (secure payment processing)
-   Lua scripting (atomic seat restoration)

------------------------------------------------------------------------

# 🧠 System Overview

This system prevents overselling seats under heavy concurrency using
Redis atomic operations and Lua scripts.

Flow:

Client\
↓\
Express API\
↓\
Redis (seat reservation with TTL)\
↓\
Stripe Checkout\
↓\
Stripe Webhook\
↓\
PostgreSQL update\
↓\
BullMQ email job

------------------------------------------------------------------------

# 🗄 Database Layer (PostgreSQL + TypeORM)

## Configuration

-   synchronize: false
-   Migrations enabled
-   Logging enabled (development)

## Entities

### User

Represents platform users.

### Event

Contains: - title - available_seats - price

### Booking

Tracks lifecycle: - PENDING - CONFIRMED - EXPIRED

------------------------------------------------------------------------

# 🔴 Redis Layer

Redis is used for:

-   Real-time seat decrement
-   Temporary reservation storage
-   Automatic expiration handling
-   Atomic seat restoration via Lua

## Reservation Key Format

reservation:{eventId}:{seats}:{token}

Example: reservation:12:2:abc123

TTL applied to key ensures auto-expiry.

------------------------------------------------------------------------

# ⚡ Lua Script (Atomic Seat Restore)

When a reservation expires:

1.  Redis emits expired key event
2.  Subscriber captures event
3.  Lua script restores seats atomically

Guarantees: - No race conditions - No inconsistent seat counts

------------------------------------------------------------------------

# 🔔 Redis Expiry Subscriber

Subscribes to: **keyevent@0**:expired

On expiration:

1.  Extract eventId and seats
2.  Execute Lua restore
3.  Update booking status to EXPIRED

------------------------------------------------------------------------

# 💳 Stripe Integration

API Version: 2026-01-28.clover

Flow:

1.  Seats reserved in Redis
2.  Booking created (PENDING)
3.  Stripe Checkout session created
4.  User pays
5.  Webhook verifies payment
6.  Booking marked CONFIRMED
7.  Email job queued

------------------------------------------------------------------------

# 🪝 Webhook Handling

Uses pessimistic locking to prevent duplicate confirmations.

Ensures idempotent payment processing.

------------------------------------------------------------------------

# 📬 Queue System (BullMQ)

Queue Name: email-queue

Worker processes: - bookingId - userEmail - eventTitle

Email sending is asynchronous and fault-tolerant.

------------------------------------------------------------------------

# 🧱 Middleware

## Request Logger

Logs request metadata and duration.

## Auth Middleware

-   Verifies JWT from cookies
-   Attaches req.user
-   Returns 401 if invalid

## Validation Middleware

-   Uses Zod
-   Parses and validates request body
-   Returns structured validation errors

------------------------------------------------------------------------

# 🌱 Seeding

Seed script:

-   Connects to PostgreSQL
-   Connects to Redis
-   Seeds users
-   Seeds events

------------------------------------------------------------------------

# 🚀 Running the Project

Install dependencies:

npm install

Run migrations:

npm run migration:run

Start server:

npm run dev

------------------------------------------------------------------------

# ⚙ Environment Variables

DATABASE_HOST= DATABASE_PORT= DATABASE_USER= DATABASE_PASSWORD=
DATABASE_NAME=

REDIS_URL=

STRIPE_SECRET_KEY= STRIPE_WEBHOOK_SECRET=

JWT_SECRET=

------------------------------------------------------------------------

# 🛡 Concurrency Strategy

-   Redis atomic seat decrement
-   TTL-based reservation expiry
-   Lua script atomic restoration
-   Database pessimistic locking
-   Webhook idempotency

------------------------------------------------------------------------

# 📌 Key Guarantees

-   No seat overselling
-   Expired reservations automatically restored
-   Payment confirmation is safe and idempotent
-   Email processing does not block API
