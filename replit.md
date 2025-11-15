# Overview

This is a full-stack web application for Crownix, a premium construction and development company operating across Australia. The application serves as a corporate website showcasing the company's services, projects, team, and insights. It features a modern React-based frontend with Express.js backend, designed to present a professional image while providing comprehensive information about residential and commercial construction services.

The project includes both a main application structure and a separate website subdirectory containing a construction-themed template that appears to be integrated or referenced by the main application.

# Recent Changes

## November 15, 2025
- **Privacy Policy Page**: Added comprehensive Privacy Policy page at `/privacy` route with full legal content covering data collection, usage, security, user rights, and contact information. Page follows consistent design patterns with hero banner and structured content sections.
- **Footer Navigation**: Updated footer to include working link to Privacy Policy page (previously was placeholder "#" link).
- **Production Deployment**: Website successfully deployed and live at https://crownix.com.au

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server

**Routing**: React Router (react-router-dom) for client-side navigation with dedicated pages for Home, About, Services, Contact, Privacy Policy, Projects, and Insights

**UI Component System**: 
- Radix UI primitives for accessible, unstyled components
- shadcn/ui design system (New York style variant) for consistent, customized UI components
- Custom components built on top of Radix primitives following a structured component library approach

**Styling**: 
- Tailwind CSS with custom configuration for design tokens
- CSS custom properties for theming (light/dark mode support)
- Design follows VS Code/Developer Tools pattern with focus on content visibility and information density
- Custom color system using HSL values with alpha channel support
- Typography uses Inter for UI elements and JetBrains Mono for code

**State Management**: 
- React Query (@tanstack/react-query) for server state management
- Local component state using React hooks
- Custom hooks for reusable logic (use-mobile, use-toast)

**Design System Specifications**:
- Split-panel layout pattern (3-column: navigator 20%, editor 50%, preview 30%)
- Consistent spacing using Tailwind units (2, 3, 4, 6, 8, 12, 14)
- Font families: Inter (UI), JetBrains Mono (code), with additional Google Fonts support
- Responsive breakpoint: 768px for mobile detection

## Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Server Structure**:
- Modular route registration system (server/routes.ts)
- Custom Vite middleware integration for development
- Request/response logging with timing metrics
- Session management capabilities (connect-pg-simple for PostgreSQL sessions)

**Storage Layer**:
- Abstract storage interface (IStorage) defining CRUD operations
- In-memory storage implementation (MemStorage) for development
- Database schema defined using Drizzle ORM
- PostgreSQL support via Neon serverless driver

**Development Features**:
- Hot module replacement (HMR) through Vite
- Runtime error overlay for development
- Replit-specific plugins for development environment integration
- Custom logger with formatted timestamps

## Data Architecture

**ORM**: Drizzle ORM with PostgreSQL dialect

**Schema Design**:
- Users table with UUID primary keys, username/password authentication
- Zod schema validation for data insertion
- Type-safe database queries with TypeScript inference

**Database Configuration**:
- Connection via DATABASE_URL environment variable
- Migration files stored in ./migrations directory
- Schema definitions in shared/schema.ts for cross-environment consistency

## Authentication & Authorization

**Current Implementation**: Basic user model with username/password fields (schema defined, authentication logic not yet implemented in visible routes)

**Session Management**: Infrastructure prepared with connect-pg-simple for PostgreSQL-backed sessions

## Project Structure

**Monorepo Layout**:
- `/client` - React frontend application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Route-specific page components
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and React Query configuration
- `/server` - Express.js backend
- `/shared` - Shared TypeScript types and schemas
- `/website` - Separate website template/implementation
- `/migrations` - Database migration files

**Path Aliases**:
- `@/` maps to `client/src/`
- `@shared/` maps to `shared/`
- `@assets/` maps to `attached_assets/`

## Build & Deployment

**Development**: 
- `npm run dev` - Runs Express server with Vite middleware for HMR
- TypeScript compilation without emit for type checking
- Environment: NODE_ENV=development

**Production Build**:
- Vite builds frontend to `dist/public`
- esbuild bundles backend to `dist/index.js` with ESM format
- Platform: Node.js with external package bundling

**Type Checking**: Standalone TypeScript compilation via `npm run check`

# External Dependencies

## Third-Party Services

**GitHub Integration**: Octokit REST API client for GitHub repository operations (clone-repo.ts suggests repository cloning functionality)

**Replit Platform Integration**:
- Replit Connectors API for GitHub authentication (OAuth flow)
- Environment-specific identity tokens (REPL_IDENTITY, WEB_REPL_RENEWAL)
- Vite plugins for Replit development environment (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)

## Database

**PostgreSQL**: Primary database via Neon serverless driver (@neondatabase/serverless)

**Connection Management**: 
- Environment variable: DATABASE_URL
- Drizzle ORM for migrations and queries
- Session store: connect-pg-simple for PostgreSQL-backed sessions

## UI Component Libraries

**Radix UI**: Comprehensive set of accessible, unstyled component primitives
- Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
- Popover, Select, Tabs, Toast, Tooltip, and 20+ other primitives

**Supporting Libraries**:
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for conditional className handling
- cmdk for command palette functionality
- react-hook-form with @hookform/resolvers for form validation
- lucide-react for iconography
- date-fns for date manipulation

## Development Tools

**Build Tools**:
- Vite - Frontend build tool and dev server
- esbuild - Backend bundler
- PostCSS with Tailwind CSS and Autoprefixer

**TypeScript Configuration**:
- Strict mode enabled
- ESNext module system
- Bundler module resolution
- Path aliases for cleaner imports

## Asset Management

**Image Handling**: Custom ImageWithFallback component with error state handling using base64-encoded SVG fallback

**External Images**: Unsplash images referenced throughout the application (used under Unsplash license as noted in website/src/Attributions.md)

## Design Attribution

**shadcn/ui**: UI components used under MIT license
**Figma Design**: Website based on "Responsive Construction Website Design" Figma template