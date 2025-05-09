# Employee Management System - Backend

## Technology Stack
- NestJS
- Prisma ORM
- MySQL
- TypeScript
- Swagger Documentation

## Prerequisites
- Node.js (v18+)
- MySQL Database
- npm or yarn

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd employee-management-backend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Update database connection details

4. Generate Prisma Client
```bash
npm run prisma:generate
```

5. Run database migrations
```bash
npm run prisma:migrate
```

6. Seed the database (optional)
```bash
npm run prisma:seed
```

7. Start the development server
```bash
npm run start:dev
# or
yarn start:dev
```

8. Access Swagger Documentation
- Open `http://localhost:8000/api-docs` in your browser

## Project Structure
```
src/
├── prisma/         # Prisma ORM configuration
├── employee/       # Employee module
│   ├── controllers/
│   ├── services/
│   └── dto/
├── department/     # Department module
│   ├── controllers/
│   ├── services/
│   └── dto/
└── main.ts         # Application entry point
```

## Available Scripts
- `npm run start:dev`: Start development server
- `npm run build`: Compile TypeScript
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:seed`: Seed database with sample data

## Database Operations
- Schema changes: Modify `prisma/schema.prisma`
- Create migration: `npx prisma migrate dev --name description`
- Reset database: `npx prisma migrate reset`

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
```