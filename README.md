# CV For Jobs - Job Search Platform

A Node.js-based job search platform that integrates with the Adzuna API to provide job listings and user management features.

## Features

- User registration and authentication (candidates and employers)
- Session-based authentication
- Job search by keyword and location
- Integration with Adzuna Jobs API
- Responsive web interface with EJS templates
- Secure password hashing with bcrypt
- MySQL database for user management

## Prerequisites

- Node.js (v14 or higher recommended)
- MySQL database
- Adzuna API credentials (get them from https://developer.adzuna.com/)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cfjnode
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Create a MySQL database named `cvforjobs`
   - Run the SQL schema from `readme/Tables.txt` (if available)

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your actual credentials:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=cvforjobs

# Session Configuration
SESSION_SECRET=your_random_secret_key_here

# Adzuna API Configuration
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm start
```

The server will start at `http://localhost:3000` (or the PORT specified in your .env file).

## Project Structure

```
cfjnode/
├── config/
│   └── db.js              # Database connection configuration
├── controllers/
│   ├── jobController.js   # Job-related route handlers
│   ├── loginController.js # Login/logout handlers
│   ├── pageController.js  # Page rendering controllers
│   └── userController.js  # User registration handler
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── index.js          # Main application routes
│   └── userRoutes.js     # User API routes
├── services/
│   └── adzunaService.js  # Adzuna API integration
├── views/
│   └── pages/            # EJS templates
├── public/               # Static assets (CSS, JS, images)
├── app.js               # Main application entry point
└── package.json         # Project dependencies
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user

### User API
- `POST /api/users/register` - Alternative registration endpoint
- `POST /api/users/login` - Alternative login endpoint

### Pages
- `GET /` - Home page (protected, requires login)
- `GET /login` - Login page
- `GET /register` - Registration page
- `GET /about` - About page
- `GET /contact` - Contact page
- `GET /jobs` - Job listings by location
- `GET /jobscountry` - Job listings by country
- `GET /jobform` - Job search form (protected)
- `GET /joblist` - Job list page
- `GET /jobdetail` - Job details page
- `GET /jobsearchtips` - Job search tips
- `GET /resumetips` - Resume tips

## Security Features

- Passwords are hashed using bcrypt with salt rounds
- Session-based authentication with secure session management
- Environment variables for sensitive configuration
- HTTPS-only cookies in production mode
- Database credentials stored in environment variables
- API keys stored in environment variables

## Database Schema

The application requires a MySQL database with the following tables:
- `users` - User accounts (candidates and employers)
- `CandidateProfile` - Candidate-specific information
- `EmployerProfile` - Employer-specific information

Refer to `readme/Tables.txt` for the complete database schema.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
