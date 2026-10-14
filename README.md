# Wayfare – Full-Stack Travel, Tour & Hotel Booking System

Wayfare is a modern, production-ready web platform for discovering destinations, searching and booking tour packages, booking luxury hotels, managing user profiles and bookings, and managing the entire system via an executive Admin Dashboard.

---

## 🌟 Key Features

### 👤 Customer Features
- **Discover Destinations:** Browse top destinations with rich travel imagery, highlights, attractions, and local best-time-to-visit info.
- **Tour Booking:** Search & filter tours by destination, price range, duration, category, and minimum rating. Dynamic guest count & real-time total price calculation.
- **Hotel Booking:** Search & filter hotels by location, rating, price, and amenities. View available room types (Single, Double, Deluxe, Suite, Family Suite) and book instantly.
- **Booking Management:** View booking history (All, Upcoming, Completed, Cancelled) with unique booking references (`WF-TR-XXXXXX`, `WF-HT-XXXXXX`) and printable voucher details.
- **Reviews & Moderation:** Submit star ratings and feedback for tours and hotels.
- **User Profile:** Manage profile picture, contact details, country, and change password securely.

### 🛡️ Admin Features
- **Executive Dashboard:** Real-time analytics on Total Users, Total Destinations, Total Tours, Total Hotels, Total Bookings, and Total Revenue with monthly revenue charts.
- **User Management (CRUD):** View registered users, update permissions (Customer / Admin), and manage accounts.
- **Destination Management (CRUD):** Create, update, and remove travel destinations.
- **Tour Management (CRUD):** Create, update, and remove tour packages with itinerary and included services.
- **Hotel Management (CRUD):** Manage hotel properties, locations, amenities, and rates.
- **Room Management (CRUD):** Manage hotel room inventory, capacity, per-night pricing, and room availability.
- **Booking Management:** Monitor all customer bookings, search by reference or customer name, and update status (`confirmed`, `pending`, `completed`, `cancelled`).
- **Review Moderation:** Approve, reject, or delete customer reviews.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Routing:** React Router DOM (v7)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), Custom Glassmorphism, Responsive CSS
- **HTTP Client:** Axios (configured with token interceptors)
- **Icons:** React Icons (`react-icons/fi`)
- **Notifications:** React Hot Toast (`react-hot-toast`)

### Backend
- **Runtime:** Node.js & Express.js (ES Modules)
- **Database:** MongoDB & Mongoose ORM
- **Authentication:** JWT (JSON Web Tokens) with 30-day expiration
- **Security:** Password hashing via `bcryptjs`, CORS configuration, Input validation, Centralized error handling
- **Environment:** `dotenv`

---

## 📂 Project Structure

```
Wayfare/
├── Backend/
│   ├── config/
│   │   └── db.js                 # Mongoose database connection
│   ├── controllers/
│   │   ├── adminController.js     # Dashboard stats & admin booking endpoints
│   │   ├── authController.js      # Register, login, getMe
│   │   ├── destinationController.js
│   │   ├── hotelBookingController.js
│   │   ├── hotelController.js
│   │   ├── reviewController.js
│   │   ├── roomController.js
│   │   ├── tourBookingController.js
│   │   ├── tourController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authentication.js     # JWT protection & Admin authorization
│   ├── models/
│   │   ├── Destination.js
│   │   ├── Hotel.js
│   │   ├── HotelBooking.js
│   │   ├── Review.js
│   │   ├── Room.js
│   │   ├── Tour.js
│   │   ├── TourBooking.js
│   │   └── User.js
│   ├── routes/ (Routers/)
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── hotelBookingRoutes.js
│   │   ├── hotelRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── tourBookingRoutes.js
│   │   └── userRouter.js
│   ├── seed/
│   │   └── seed.js               # Database seeder with realistic data
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator
│   ├── index.js                  # Main Express application
│   ├── package.json
│   └── .env
└── Frontend/
    ├── src/
    │   ├── components/           # Reusable Navbar, Footer, Hero, Cards, Modals, Spinners
    │   ├── context/              # AuthContext for global user & token management
    │   ├── pages/                # Public & Customer Pages (Home, Tours, Hotels, Bookings, Profile)
    │   │   └── admin/            # Admin Dashboard & CRUD Management Modules
    │   ├── services/             # Axios API service modules
    │   ├── utils/                # Currency & Date Formatters
    │   ├── App.jsx               # Routes setup & Theme provider
    │   ├── main.jsx              # React DOM mounting
    │   └── index.css             # Tailwind CSS & Glassmorphism styles
    ├── vite.config.js
    └── package.json
```

---

## 🔑 Default Accounts (Development / Demo)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@wayfare.com` | `Admin@123456` |
| **Customer** | `user@wayfare.com` | `User@123456` |

---

## ⚡ Quick Start & Installation

### 1. Backend Setup
```bash
cd Backend
npm install
npm run seed     # Populate 10 destinations, 10+ tours, 10+ hotels, 30 rooms & sample reviews
npm start        # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 🌐 API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Destinations:** `GET /api/destinations`, `GET /api/destinations/:id`, `POST /api/destinations`, `PUT /api/destinations/:id`, `DELETE /api/destinations/:id`
- **Tours:** `GET /api/tours`, `GET /api/tours/:id`, `POST /api/tours`, `PUT /api/tours/:id`, `DELETE /api/tours/:id`
- **Hotels:** `GET /api/hotels`, `GET /api/hotels/:id`, `POST /api/hotels`, `PUT /api/hotels/:id`, `DELETE /api/hotels/:id`
- **Rooms:** `GET /api/rooms`, `GET /api/rooms/:id`, `POST /api/rooms`, `PUT /api/rooms/:id`, `DELETE /api/rooms/:id`
- **Bookings:** `POST /api/tour-bookings`, `GET /api/tour-bookings/my`, `POST /api/hotel-bookings`, `GET /api/hotel-bookings/my`
- **Admin:** `GET /api/admin/stats`, `GET /api/admin/bookings`, `PUT /api/admin/bookings/:id/status`
- **Reviews:** `GET /api/reviews`, `POST /api/reviews`, `PUT /api/reviews/:id`, `DELETE /api/reviews/:id`
