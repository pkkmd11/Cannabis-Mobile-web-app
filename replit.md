# Cannabis Inventory and Sales Tracking App

## Overview

A cannabis inventory and sales tracking application designed for retail dispensaries to manage products, record sales, conduct audits, and generate compliance reports. The app is built as a Progressive Web App (PWA) with offline-first capabilities, featuring multi-language support (English, Myanmar, Thai) and mobile-optimized responsive design. The system emphasizes compliance with cannabis industry regulations while providing intuitive tools for inventory management, sales tracking, and audit procedures.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and developer experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful endpoints for CRUD operations on products, sales, and audits
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Storage Interface**: Abstract storage layer supporting both in-memory and database implementations
- **Development Server**: Integrated Vite development server with HMR support

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Local Storage**: IndexedDB for offline-first functionality and data synchronization
- **Database Provider**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for database migrations and schema management

### Offline-First Design
- **Local Data**: All CRUD operations work offline using IndexedDB
- **Sync Strategy**: Graceful degradation when server is unavailable, with automatic retry mechanisms
- **Progressive Enhancement**: Server APIs enhance local functionality when available
- **Data Persistence**: Forms and user interactions persist across sessions

### Internationalization
- **Multi-language Support**: Built-in i18n system supporting English, Myanmar, and Thai
- **Context-based Translation**: React Context API for language state management
- **Persistent Language Selection**: LocalStorage for user language preferences
- **Extensible Translation System**: JSON-based translation keys for easy content management

### Mobile-First Responsive Design
- **Bottom Navigation**: Mobile-optimized navigation for key app sections
- **Touch-Friendly Interface**: Large touch targets and swipe gestures
- **Progressive Web App**: Service worker ready for offline functionality and app-like experience
- **Responsive Components**: Adaptive layouts for mobile, tablet, and desktop viewports

### Cannabis Industry Features
- **Product Management**: Strain tracking with THC/CBD levels, batch numbers, and expiry dates
- **Compliance Tracking**: Audit trails, regulatory reporting, and inventory reconciliation
- **Sales Recording**: Transaction logging with customer information and batch traceability
- **Inventory Audits**: Physical count reconciliation with discrepancy tracking
- **Reporting**: Compliance reports, sales analytics, and inventory status dashboards

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+, React DOM, React Hook Form for form management
- **TypeScript**: Full TypeScript support for type safety across the application
- **Vite**: Modern build tool with plugin ecosystem for development and production

### Database and ORM
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL provider via @neondatabase/serverless
- **Database Migrations**: Drizzle Kit for schema management and migrations

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Consistent icon library for UI elements
- **Class Variance Authority**: Type-safe component variant management

### State Management and Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition

### Development and Build Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **Replit Integration**: Development environment plugins and error handling

### Routing and Navigation
- **Wouter**: Lightweight routing library for single-page application navigation
- **History API**: Browser history management for seamless navigation experience

### Utility Libraries
- **Date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional className utility for dynamic styling
- **Nanoid**: Unique ID generation for client-side record creation