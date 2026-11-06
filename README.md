# 🌱 AgriShare – Smart Agricultural Resource Sharing Platform

**AgriShare** is a smart agricultural platform designed to help farmers access and share essential agricultural resources. It connects farmers with machinery owners, labour providers, and seed suppliers through a single digital marketplace.

The platform aims to make agricultural resources more accessible, affordable, and convenient through technology.

---

## 🚀 Key Features

### 👨‍🌾 Farmer Marketplace
- Browse and rent agricultural machinery.
- Explore available seeds and agricultural products.
- Find and connect with agricultural labour providers.
- Share farming equipment with other farmers.

### 📅 Booking Management
- Book available agricultural machinery and services.
- Check availability before booking.
- Manage and track bookings.

### 📍 Location-Based Services
- Google Maps integration.
- Discover nearby machinery, labour providers, and resources.
- Location-based resource discovery.

### 🤖 AI Crop Assistant
- AI-powered agricultural assistance.
- Get information and guidance related to farming and crops.
- Interactive assistant for farmer queries.

### 🔐 Authentication & Security
- User registration and login.
- JWT-based authentication.
- Role-based access for different users.
- Admin management features.

### ⭐ Additional Features
- Farmer-to-farmer resource sharing.
- Reviews and ratings.
- Real-time chat functionality.
- Admin dashboard for platform management.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React.js, TypeScript |
| Styling | CSS |
| Backend | Java, Spring Boot |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Maps | Google Maps API |
| Build Tool | Maven |
| Development Tools | Antigravity IDE, Git, GitHub |

---

## 📂 Project Structure

```text
AgriShare/
│
├── app/                    # Next.js application pages
├── components/             # Reusable UI components
├── context/                # Application context
├── lib/                    # API and utility functions
├── public/                 # Static assets and images
├── stitch_reference/       # UI reference designs
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/       # Spring Boot source code
│   │       └── resources/  # Application configuration
│   └── pom.xml             # Maven dependencies
│
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SomaRakesh1717/Agrishare-Project.git
```

### 2. Navigate to the Project

```bash
cd Agrishare-Project
```

### 3. Configure the Frontend

Install the dependencies:

```bash
npm install
```

Configure the required frontend environment variables in a `.env.local` file.

### 4. Configure the Backend

Navigate to the backend folder:

```bash
cd backend
```

Configure your MongoDB Atlas connection string and other required application properties.

**Important:** Never upload database passwords, JWT secrets, or API keys to GitHub.

### 5. Run the Backend

On Windows, execute:

```bash
.\mvnw.cmd spring-boot:run
```

Alternatively, if Maven is installed:

```bash
mvn spring-boot:run
```

### 6. Run the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## 🗄️ Database

AgriShare uses **MongoDB Atlas** as its cloud database.

The database stores application information such as:

- User accounts and profiles
- Machinery details
- Seed information
- Labour information
- Booking records
- Reviews and chat messages

Configure your MongoDB connection securely before starting the backend.

---

## 🎯 Project Objectives

- Digitize agricultural resource sharing.
- Reduce the difficulty of accessing farming equipment.
- Connect farmers with machinery owners and labour providers.
- Improve resource availability through location-based services.
- Provide intelligent agricultural assistance.
- Build a centralized agricultural marketplace.

---

## 🔮 Future Enhancements

- Advanced AI-based crop recommendations.
- Weather-based agricultural suggestions.
- Multilingual support for regional farmers.
- Online payment integration.
- Advanced analytics for farmers and administrators.
- Push notifications for booking updates.

---

## 👨‍💻 Developed By

**Soma Rakesh**

B.Tech Student | Full Stack Java Developer

GitHub: [SomaRakesh1717](https://github.com/SomaRakesh1717)

---

## 🤝 Contributions

Contributions, suggestions, and feedback are welcome!

If you find an issue or have an idea to improve AgriShare, feel free to open an issue or submit a pull request.

---

## ⭐ Support

If you find this project useful, consider giving this repository a ⭐ on GitHub!

**AgriShare – Empowering Farmers Through Technology.** 🌾
