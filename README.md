# 🏦 Loan Application Management System

A modern, full-stack loan application management system built with Spring Boot backend, React/TypeScript frontend, and MongoDB database integration. The application provides a seamless experience for loan eligibility checking, application submission, and application history tracking.

## ✨ Features

- 🎯 **Loan Eligibility Calculator** - Real-time eligibility assessment
- 📝 **Application Management** - Submit and track loan applications
- 📊 **Application History** - View all previous applications with status
- 🔒 **Secure Backend** - Spring Boot with robust exception handling
- 💾 **MongoDB Integration** - Scalable NoSQL database storage
- 🎨 **Modern UI** - Responsive TypeScript/React frontend
- ⚡ **Real-time Validation** - Client and server-side form validation


### Prerequisites

Make sure you have the following installed:
- ☕ **Java 17+** 
- 🟢 **Node.js 18+** 
- 📦 **npm or yarn**
- 🍃 **MongoDB 6.0+**
- 🔧 **Maven 3.6+**

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd loan-application-system
   ```

2. **Set up MongoDB**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Install dependencies and run
   mvn clean install
   mvn spring-boot:run
   ```
  

4. **Frontend Setup**
   ```bash
   # Navigate to frontend directory (open new terminal)
   cd frontend
   
   # Install dependencies
   npm install
   # or
   yarn install
   
   # Start development server
   npm run dev
   # or
   yarn dev
   ```

### 🏠 Home Page
*The landing page providing an overview of loan services and quick navigation*

![Home Page](./screenshots/home-page.png)

### 📋 Eligibility Form
*Interactive form to check loan eligibility with real-time validation*

![Eligibility Form](./screenshots/eligibility-form.png)

### 📈 Application History
*Comprehensive view of all loan applications with status tracking*

![Application History](./screenshots/application-history.png)

## 🛠️ Development Commands

### Backend Commands
```bash
# Run tests
mvn test

# Package application
mvn package

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Build Docker image
docker build -t loan-app-backend .
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

