# LMS Zhi - Learning Management System

LMS Zhi is a modern, full-stack Learning Management System built with Next.js, offering a simple and organized platform for students and administrators to manage course materials. It features role-based access, course enrollment, and a hierarchical file/folder system for study materials.

## Key Features

- **User Authentication**: Secure sign-up and sign-in functionality using Clerk, with support for email/password and SSO.
- **Role-Based Access Control**: Differentiates between `admin` and `user` roles, granting admins content management capabilities.
- **Course Management**: Admins can create courses, and users can enroll in them to access materials.
- **File & Folder System**:
  - Hierarchical folder structure within each course.
  - File uploads for admins, with storage handled by Cloudflare R2.
  - Secure file downloads via pre-signed URLs.
  - Students can mark files as "read" or "unread" to track their progress.
- **Responsive Dashboard**: A user-friendly dashboard with a collapsible sidebar, built with Shadcn/ui and Tailwind CSS.
- **API Endpoints**: A comprehensive set of API routes to manage users, courses, files, and folders.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **File Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- Bun (or npm/yarn/pnpm)
- A PostgreSQL database
- Clerk account for authentication keys
- Cloudflare R2 bucket for file storage

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/lms-zhi.git
    cd lms-zhi
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in the `.env` file. See the [Environment Variables](#environment-variables) section for more details.

4.  **Push the database schema:**
    Apply the database schema to your PostgreSQL database using Prisma.
    ```bash
    bunx prisma db push
    ```

5.  **Generate Prisma Client:**
    ```bash
    bunx prisma generate
    ```

### Running the Development Server

To start the development server, run:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

The following environment variables are required to run the application. These should be placed in a `.env` file in the project root.

- `DATABASE_URL`: The connection string for your PostgreSQL database.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your publishable key from the Clerk dashboard.
- `CLERK_SECRET_KEY`: Your secret key from the Clerk dashboard.
- `CLERK_WEBHOOK_SECRET_KEY`: The webhook secret key for Clerk webhooks.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: The sign-in page URL (e.g., `/sign-in`).
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: The sign-up page URL (e.g., `/sign-up`).
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`: Fallback redirect URL after sign-in.
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`: Fallback redirect URL after sign-up.
- `NEXT_PUBLIC_BASE_URL`: The base URL of your application (e.g., `http://localhost:3000`).
- `R2_ACCESS_KEY`: Your Cloudflare R2 access key ID.
- `R2_SECRET_KEY`: Your Cloudflare R2 secret access key.
- `R2_ENDPOINT`: Your Cloudflare R2 S3 API endpoint.
- `R2_BUCKET`: The name of your R2 bucket.
- `NEXT_PUBLIC_R2_Public_URL`: The public URL for your R2 bucket.

## Available Scripts

- `bun run dev`: Starts the development server with Turbopack.
- `bun run build`: Builds the application for production.
- `bun run start`: Starts a production server.
- `bun run lint`: Runs the linter.

## Project Structure

The project is organized as follows:

- `src/app/`: Contains all the routes, pages, and layouts for the Next.js App Router.
  - `(auth)/`: Routes for authentication (sign-in, sign-up).
  - `(main)/`: Protected routes for authenticated users.
  - `api/`: API routes for backend functionality.
- `src/components/`: Shared React components.
  - `ui/`: Components from Shadcn/ui.
- `src/contexts/`: React context providers for global state management.
- `src/hooks/`: Custom React hooks.
- `src/lib/`: Utility functions and library initializations (e.g., Prisma client).
- `prisma/`: Contains the Prisma schema file (`schema.prisma`).
- `public/`: Static assets like images and logos.

## API Endpoints

The application exposes several API endpoints to handle backend logic:

- `/api/clerk/webhooks/user-created`: Handles user creation events from Clerk.
- `/api/courses`: GET all courses.
- `/api/file/delete`: DELETE a file.
- `/api/file/download`: GET a pre-signed URL for file download.
- `/api/file/mark-read`: POST to mark a file as read.
- `/api/file/mark-unread`: POST to mark a file as unread.
- `/api/file/read-status`: GET the read status of files.
- `/api/file/upload`: POST to upload a new file.
- `/api/folder/create`: POST to create a new folder.
- `/api/folder/delete`: DELETE a folder.
- `/api/user/enrolled-courses`: GET or POST user's course enrollments.
- `/api/user/user-details`: GET details for the authenticated user.

---