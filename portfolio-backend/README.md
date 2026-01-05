# Portfolio Backend API

Universal backend for Portfolio Admin Hub supporting MySQL and PostgreSQL databases.

## Features
- Database-agnostic design (MySQL/PostgreSQL)
- JWT authentication
- Full CRUD operations for all portfolio entities
- TypeScript for type safety
- Security middleware (Helmet, CORS, Rate Limiting)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run migrations:
```bash
# For MySQL
npm run migrate:mysql

# For PostgreSQL
npm run migrate:postgres
```

4. Start server:
```bash
# Development
npm run dev

# Production
npm run build && npm start
```

## API Endpoints

See [API Documentation](./../../../.gemini/antigravity/brain/c946077d-dca1-4b97-9a93-b7a73840b50f/api-documentation.md) for complete endpoint reference.

### Quick Reference
- `POST /api/auth/login` - Admin login
- `GET /api/profile` - Get profile info
- `PUT /api/profile` - Update profile (authenticated)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (authenticated)
- `GET /api/skills` - List all skills
- `GET /api/experiences` - Work history
- `GET /api/certificates` - Certificates
- `GET /api/messages` - Contact messages (authenticated)

## Environment Variables

See `.env.example` for all available options.

Key variables:
- `DB_TYPE`: 'mysql' or 'postgres'
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)

## Database Schema

Located in `../db_schema.sql`. Contains tables for:
- Profile, Hero, About sections
- Projects, Skills, Experiences
- Certificates, Messages
- Admin users, SEO settings

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API routes
- CORS configuration
- Helmet security headers

## License

MIT
