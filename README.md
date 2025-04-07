# Exactconnect

A modern fullstack application for managing shopper insights and e-commerce functionality.

## Project Overview

This project is a fullstack application that combines a React frontend with a Django backend, utilizing the FakeStore API for product data. The application is designed to provide a seamless e-commerce experience with robust user authentication and order management capabilities.

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Vite as build tool
  - Tailwind CSS for styling
  - ESLint for code linting
  - Bun/pnpm for package management

- **Backend**:
  - Django for API endpoints
  - Django REST Framework
  -  PostgreSQL

- **External APIs**:
  - FakeStore API (https://fakestoreapi.com) for product data

## Project Structure

```
shopper-insight-hub/
├── API/              # Django backend code
├── src/             # React frontend source code
├── public/          # Static assets
├── components.json  # Component configuration
├── package.json     # Frontend dependencies
└── vite.config.ts   # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (LTS version)
- Python 3.8+
- Bun or npm (for frontend)
- PostgreSQL (optional)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd shopper-insight-hub
```

2. Install frontend dependencies:
```bash
bun install  # or npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_FAKESTORE_API_URL=https://fakestoreapi.com
```

4. Start the frontend development server:
```bash
bun run dev  # or npm run dev
```

5. For backend setup (in a separate terminal):
```bash
cd API
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Features

- User Authentication (Sign up/Sign in)
- Product Browsing (via FakeStore API)
- Order Management (via Django backend)
- Responsive Design
- Modern UI with Tailwind CSS
- TypeScript for type safety

## API Endpoints

The application uses a hybrid API approach:

1. **FakeStore API** (https://fakestoreapi.com):
   - `/products` - Get all products
   - `/products/{id}` - Get specific product
   - `/categories` - Get product categories

2. **Django Backend** (http://localhost:8000):
   - `/api/auth/` - Authentication endpoints
   - `/api/orders/` - Order management
   - `/api/profile/` - User profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact [your email].

## Acknowledgments

- Thanks to the FakeStore API team for providing the product data API
- Special thanks to the React and Django communities for their excellent documentation and support