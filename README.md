# 🛒 Single Page Checkout – Next.js + TypeScript

This is a fully responsive, modern **Single Page Checkout** application built with **Next.js 15 App Router**, **TypeScript**, and **TailwindCSS**. It simulates a smooth e-commerce checkout experience with cart handling, address entry, and payment integration via **Stripe** and **Cash on Delivery (COD)** options.

---

##  Features

- ✅ **Single Page Flow**: Cart → Shipping Address → Payment → Confirmation
- 🛒 **Cart Management**: Increase, decrease, or remove products
- 📍 **Shipping Details**: Address input with validation
- 💳 **Stripe Payment Integration**: Secure card processing with card brand detection
- 💵 **COD Option**: Simulated processing with SweetAlert loading
- 🖼️ **Modern UI/UX**: Built with TailwindCSS, Lottie animations, and Framer Motion
- 🧠 **State Management**: Lightweight global state using Zustand
- 🔐 **Auth & MongoDB Setup**: Sign up/login flow and backend integration ready (via `authStore` and `route.ts`)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand
- **Animation**: Framer Motion + Lottie
- **Payment**: Stripe Elements
- **Backend**: Node.js + MongoDB (via Mongoose)

---

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/kishankumar07/single-page-checkout.git

# 2. Navigate into the project
cd single-page-checkout

# 3. Install dependencies
npm install

# 4. Run locally
npm run dev
```

⚠️ Ensure you have Node.js ≥ 18 installed.



### 🧪 Test Card Details (Stripe Demo)

| Card Type   | Number               | Expiry | CVC  |
|-------------|----------------------|--------|------|
| Visa        | 4242 4242 4242 4242  | 12/34  | 123  |
| Mastercard  | 5555 5555 5555 4444  | 12/34  | 123  |
| Amex        | 3782 822463 10005    | 12/34  | 1234 |






## Environment Variables

Create a .env.local file with:
```bash
MONGODB_URI=mongodb+srv://<your-uri>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📸 Screenshots

### 🛒 Cart Page
![Cart View](https://drive.google.com/file/d/11YHvMOZvRC73ePhODbOBrd17xQK8gx4v/view?usp=sharing)

### 💳 Payment Form
![Payment View](https://drive.google.com/file/d/1y9va8j4lcEnbjIqwOJD0xqrQo64RUZOL/view?usp=drive_link)

## 🔗 Links


[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kishan-ta)
[![medium](https://img.shields.io/badge/medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@kishantashok)


## 📄 License


This project is for demo/interview purposes only. Feel free to reuse for learning or personal projects.

