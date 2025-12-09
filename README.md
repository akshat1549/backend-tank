# Tank Backend API

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure Oracle Database:
   - Update `.env` file with your Oracle credentials
   - Run `database/schema.sql` in your Oracle database

3. Start the server:
```bash
npm run dev
```

## API Endpoints

- GET `/api/items` - Get all items
- POST `/api/items` - Create new item
- GET `/api/items/count` - Get items count using PL/SQL function

## Database Requirements

- Oracle Database 12c or higher
- PL/SQL support enabled