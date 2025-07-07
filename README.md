# CommunityHub - Reddit-Style Community Portal

A modern, responsive community portal built with Next.js that allows users to share posts, vote on content, and engage with a community — all without requiring a backend database.

![CommunityHub Screenshot](assets/dashboard.png)

---

## 🚀 Features

### Core Functionality
- **User Authentication** – Register/login system with admin privileges  
- **Post Creation** – Create text posts or link posts with rich content  
- **Voting System** – Upvote/downvote posts with real-time vote counting  
- **Feed Interface** – View posts sorted by popularity (most upvoted first)  
- **Admin Dashboard** – Comprehensive admin panel for content moderation  

### Additional Features
- ✅ Responsive Design  
- ⚡ Real-time Updates  
- 🔐 Admin Controls  
- 👥 User Management  
- 📝 Post Types (Text & Link)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** – React framework with App Router  
- **React 18** – Modern React with hooks  
- **TypeScript** – Type-safe development  
- **Tailwind CSS** – Utility-first styling  
- **shadcn/ui** – Modern component library  
- **Lucide React** – Beautiful icons  

### Data Storage
- **localStorage** – Browser-based persistence  
- **JSON** – Structured data format  

### Development Tools
- ESLint, PostCSS, Next.js Dev Server

---

## 📦 Installation

### Prerequisites
- Node.js 18+  
- npm or yarn  

### Setup Instructions

```bash
git clone https://github.com/YugmPatel/CommunityHub.git
cd CommunityHub
npm install
npm run dev
````

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Usage

### Getting Started

1. **Register a new account** or use the demo credentials
2. **Create your first post** using the "Create Post" button
3. **Vote on posts** using the up/down arrows
4. **Explore the feed** to see community content

### Demo Credentials

**Admin Account:**

* Email: `admin@communityportal.com`
* Password: `admin123`

---

## 📸 Screenshots

### 🏠 Main Feed

Users can browse posts, vote, and interact.

![Dashboard](assets/dashboard.png)

---

### 📝 Create a New Post

**Text Post:**

![Text Post Modal](assets/Text%20post.png)

**Link Post:**

![Link Post Modal](assets/Link%20Post.png)

---

### 🧑‍💼 Admin Dashboard

Track stats and moderate content.

![Admin Panel](assets/admin%20dashboard.png)

---

### 🔐 Login Page

![Login Page](assets/login.png)

---

### 🧾 Signup Page

![Signup Page](assets/signup.png)

---

## 🏗️ Project Structure

```
communityhub/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── register/
│   │   └── page.tsx          # Signup page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── page.tsx              # Main feed
├── components/
│   └── post-dialog.tsx       # Post creation modal
├── public/
│   └── assets/               # Screenshots
└── README.md
```
## 🎨 Design System

* **Primary Color**: `#f97316` (orange)
* **Typography**: Inter font
* **Components**: Built using `shadcn/ui`
* **Icons**: Lucide-react


## 📈 Future Features

* 💬 Comments system
* 🔍 Search bar
* 🧑 User profiles
* 📁 Categories/tags
* 🔄 Real-time updates via WebSocket
* 🖼️ Image/media upload
* 📧 Email notifications

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👥 Author

**Yugm Patel** – [GitHub](https://github.com/YugmPatel)
📧 [yugm1213@gmail.com](mailto:yugm1213@gmail.com)
