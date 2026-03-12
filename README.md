# 🌟 Bohra Collection — Production-Ready E-Commerce Website
### ٧٨٦ | Premium Islamic & Traditional Clothing

---

## 📁 Project Structure

```
bohra-collection/
├── client/                         # React + Vite Frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx      # Fixed navbar with mobile menu
│   │   │   │   └── Footer.jsx      # Footer with social links & delivery info
│   │   │   └── products/
│   │   │       └── ProductCard.jsx # Product card with contact buttons
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Firebase auth (email + Google)
│   │   │   └── ProductsContext.jsx # Products state (Firestore + demo data)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Full homepage with all sections
│   │   │   ├── ProductsPage.jsx    # Filtered products listing
│   │   │   ├── ProductDetailPage.jsx # Single product + related
│   │   │   ├── LoginPage.jsx       # Login with email/Google
│   │   │   ├── SignupPage.jsx      # Registration
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx # Full admin panel
│   │   ├── services/
│   │   │   └── firebase.js         # Firebase initialization
│   │   ├── App.jsx                 # Routes + page transitions
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                         # Node.js + Express Backend
│   ├── models/
│   │   ├── Product.js              # MongoDB product schema
│   │   └── Visitor.js              # Visitor analytics schema
│   ├── controllers/
│   │   └── productController.js   # CRUD + stats
│   ├── middleware/
│   │   └── auth.js                 # Firebase token verification
│   ├── routes/
│   │   ├── products.js             # Product API routes
│   │   └── visitors.js            # Analytics routes
│   └── server.js                   # Express app entry
│
├── .env.example                    # Environment variables template
├── firebase.json                   # Firebase hosting config
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)
- Firebase project

### 1. Clone & Install

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies  
cd ../server && npm install
```

### 2. Configure Environment Variables

```bash
# Root directory
cp .env.example .env

# Client directory
cp .env.example client/.env
# Edit with your Firebase credentials
```

### 3. Start Development

```bash
# Terminal 1 — Start backend
cd server && npm run dev

# Terminal 2 — Start frontend
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project" → name it "bohra-collection"
3. Enable Google Analytics (optional)

### Step 2: Enable Authentication
1. Firebase Console → Authentication → Get Started
2. Enable **Email/Password** provider
3. Enable **Google** provider

### Step 3: Get Web Config
1. Project Settings → General → Your apps → Web app
2. Copy the `firebaseConfig` object
3. Add each value to your `client/.env` file

### Step 4: Enable Firestore (Database)
1. Firebase Console → Firestore Database → Create database
2. Choose "Production mode"
3. Select a region (asia-south1 for India)

Set these Firestore Security Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@bohracollection.com'];
    }
  }
}
```

### Step 5: Enable Storage (Images)
1. Firebase Console → Storage → Get Started
2. Set Storage Security Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 👑 Admin Access

To make an email admin:
1. Register with that email at `/signup`
2. Add the email to `VITE_ADMIN_EMAIL` in client `.env`
3. Also add to `ADMIN_EMAILS` in server `.env`

Admin Panel: `/admin`

Admin Features:
- Dashboard with product & view statistics
- Add/Edit/Delete products
- Charts: category distribution, price ranges, view leaderboard
- Product management with image URLs, sizes, delivery notes

---

## 📦 MongoDB Schema

### Products Collection
```js
{
  name: String,          // Product name
  category: String,      // 'men' | 'women' | 'accessories'
  price: Number,         // Price in INR
  description: String,   // Full description
  images: [String],      // Array of image URLs
  sizes: [String],       // ['S', 'M', 'L', 'XL']
  featured: Boolean,     // Show in featured section
  inStock: Boolean,      // Availability
  deliveryNote: String,  // Custom delivery message
  views: Number,         // Auto-incremented
  createdAt: Date,       // Auto-managed
  updatedAt: Date,       // Auto-managed
}
```

---

## 🚢 Deployment Guide

### Option A: Firebase Hosting (Frontend) + Railway (Backend)

#### Deploy Frontend to Firebase:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting)
firebase init

# Build the client
cd client && npm run build

# Deploy
firebase deploy
```

#### Deploy Backend to Railway:
1. Go to https://railway.app
2. Connect GitHub repo
3. Select `/server` as root
4. Add environment variables
5. Deploy

### Option B: Vercel (Frontend) + Render (Backend)

#### Frontend to Vercel:
```bash
npm install -g vercel
cd client && vercel --prod
```

#### Backend to Render:
1. Create account at https://render.com
2. New Web Service → connect GitHub
3. Set root dir to `server/`
4. Add env vars
5. Deploy

---

## 📞 Contact System

This store uses a **WhatsApp-first ordering system**:

| Method | Purpose |
|--------|---------|
| WhatsApp | Primary order channel (auto-filled message) |
| Phone Call | Direct inquiry |
| Email | Formal orders & bulk inquiries |

Contact buttons are pre-filled with product details and selected size.

---

## 📬 Delivery Rules

| Order Size | Delivery |
|-----------|---------|
| Under ₹2,000 | Local area only |
| ₹2,000+ | Pan-India via courier |
| Free delivery | Orders ₹2,000+ within city |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Navy `#1a2744` |
| Accent | Gold `#d4a017` |
| Background | Cream `#fdf9ed` |
| Font (headings) | Playfair Display |
| Font (body) | Lato |
| Font (Arabic) | Amiri |

---

## 🔐 Security Features

- Firebase Authentication (no passwords stored)
- Admin route protection
- Rate limiting on API
- Helmet.js security headers
- CORS configured
- Input validation on all forms

---

## 📊 Analytics

Built-in visitor tracking:
- Total visitors
- Page visit counts
- Product view tracking
- Category analytics
- Admin-only dashboard

---

## ✅ Production Checklist

- [ ] Firebase project created
- [ ] Authentication providers enabled
- [ ] Firestore database created
- [ ] Security rules configured  
- [ ] Environment variables set
- [ ] Admin email configured
- [ ] MongoDB Atlas connected
- [ ] Images uploaded to Firebase Storage
- [ ] Domain configured in Firebase Hosting
- [ ] CORS updated with production URL
- [ ] Google OAuth domain whitelist updated

---

Made with ❤️ for the Bohra Community | ٧٨٦
