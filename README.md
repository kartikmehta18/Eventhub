# Event Registration Platform

A modern web application for event registration and management with Stripe payment integration.

## Features

- User authentication and authorization
- Event listing and detailed views
- Event registration (free and paid events)
- Stripe payment integration
- Event management for organizers
- Responsive design

## Tech Stack

- React + TypeScript
- Vite
- Supabase (Authentication & Database)
- Stripe (Payments)
- React Router
- Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Stripe account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

⚠️ **Important Security Notes:**
- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use environment variables for all sensitive information
- For production, use proper secret management solutions
- Keep your Stripe secret keys secure and never expose them in client-side code

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-directory
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── api/              # API functions
├── components/       # React components
├── context/         # React context providers
├── lib/            # Utility functions
├── pages/          # Page components
└── types/          # TypeScript type definitions
```

## Database Schema

### Events Table
```sql
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date timestamp with time zone,
  location text,
  is_paid boolean default false,
  price integer,
  max_participants integer,
  current_participants integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Event Registrations Table
```sql
create table event_registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id),
  user_id uuid references auth.users(id),
  status text check (status in ('pending', 'registered')),
  created_at timestamp with time zone default now(),
  unique(event_id, user_id)
);
```

## Stripe Integration

The application uses Stripe Checkout for handling payments. When a user registers for a paid event:

1. A pending registration is created
2. User is redirected to Stripe Checkout
3. On successful payment, the registration status is updated to 'registered'

### Security Considerations for Stripe Integration
- Always use HTTPS in production
- Implement proper error handling for failed payments
- Use Stripe's test keys during development
- Never expose Stripe secret keys in client-side code
- Implement proper webhook handling for payment status updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Security Guidelines for Contributors
- Never commit sensitive information or API keys
- Follow the principle of least privilege
- Report any security vulnerabilities responsibly
- Keep dependencies updated
- Follow secure coding practices

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 