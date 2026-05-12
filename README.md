# Wedding Photo App

Welcome to the **Wedding Photo App**, a platform designed to manage and share wedding photos seamlessly. This application is built using modern web technologies, ensuring a smooth and efficient user experience.

## Features

### Backend (API)

- Built with **NestJS** for scalable and maintainable server-side logic.
- **Prisma ORM** for database management.
- Authentication and authorization modules.
- Event management system.
- Photo upload and management.

### Frontend (Web)

- Developed with **Next.js** for server-side rendering and static site generation.
- Responsive design for optimal viewing on all devices.
- User-friendly dashboard for managing events and photos.

## Project Structure

```
apps/
  api/       # Backend application
  web/       # Frontend application
packages/    # Shared packages and configurations
```

### Backend

- **Prisma**: Database schema and client generation.
- **Modules**: Organized by feature (e.g., `auth`, `events`, `photos`).

### Frontend

- **Pages**: Organized by routes (e.g., `/dashboard`, `/login`).
- **Components**: Reusable UI components.

## Getting Started

### Prerequisites

- **Node.js** (v18.x or higher recommended)
- **npm** or **yarn**
- **PostgreSQL** (or any supported database by Prisma)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/wedding-photo-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd wedding-photo-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database credentials and other environment variables.

### Database Setup

1. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

2. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```

### Running the Application

#### Backend

Start the API server:

```bash
npm run start:dev --prefix apps/api
```

#### Frontend

Start the web application:

```bash
npm run dev --prefix apps/web
```

### Testing

Run tests for the backend:

```bash
npm run test --prefix apps/api
```

Run tests for the frontend:

```bash
npm run test --prefix apps/web
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **NestJS** for the backend framework.
- **Next.js** for the frontend framework.
- **Prisma** for database management.
- All contributors and supporters!
