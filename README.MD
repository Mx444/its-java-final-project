# Sistema di Gestione Biblioteca Digitale - ITS Steve Jobs Academy

This repository contains a complete application for digital library management, developed as a final project for the course at ITS Steve Jobs Academy. The application consists of a Spring Boot backend and a React frontend, offering comprehensive functionality for managing books, loans, and users.

## Project Structure

The project is organized into two main components:

- **biblioteca-backend**: RESTful API developed with Spring Boot
  - User management and JWT authentication
  - Complete CRUD for books and loans
  - Reporting and statistics

- **biblioteca-frontend**: User interface developed with React and Material-UI
  - Dashboard for users and administrators
  - Responsive book catalog management
  - Loan and return system

## Main Features

### For Users
- View the complete book catalog
- Search and filter available books
- Request book loans
- Manage personal loans
- Return borrowed books

### For Administrators
- Complete catalog management (add, edit, remove books)
- Monitor all active loans
- View statistical reports on most read books
- Register new users

## Technologies Used

### Backend
- **Spring Boot**: Application development framework
- **Spring Security**: Authentication and authorization management
- **Spring Data JPA**: Data access and persistence
- **PostgreSQL**: Relational database
- **JWT**: Authentication token management

### Frontend
- **React**: JavaScript library for user interface
- **Material-UI**: React component framework
- **Axios**: HTTP client for API calls
- **React Router**: Navigation management
- **Context API**: Application state management

## System Requirements

- Java 17
- Node.js and npm
- PostgreSQL or cloud database access
- Maven

## Installation and Launch

### Backend
```bash
cd biblioteca-backend
mvn spring-boot:run
```

### Frontend
```bash
# In another terminal, navigate to the frontend folder
cd biblioteca-frontend

# Install dependencies
npm install

# Start the frontend application
npm run start
```

The application will be available at `http://localhost:3000`

## Screenshots

### Login (User)
![Login](https://i.ibb.co/mCC23X9H/Screenshot-2025-04-15-173020.png)

### Book Catalog Page (User)
![Book Catalog](https://i.ibb.co/CGP8VmS/Screenshot-2025-04-15-172857.png)

### Loan Management (User)
![My Loans](https://i.ibb.co/LhXHV659/Screenshot-2025-04-15-172912.png)

### Book Management (Administrator)
![Book Management](https://i.ibb.co/Hf3xMQfk/Screenshot-2025-04-15-172923.png)

### Statistical Reports (Administrator)
![Statistical Reports](https://i.ibb.co/s9sgtdRF/Screenshot-2025-04-15-173004.png)

### Register User (Administrator)
![Register User](https://i.ibb.co/r2qV7qhL/Screenshot-2025-04-15-173013.png)

## Data Models

### Book
- ID
- Title
- Author
- Genre
- Publication Year
- Available Copies

### Loan
- ID
- Start Date
- End Date
- Return Date
- Return Status
- Book Reference
- User Reference

### User
- ID
- Name
- Email
- Password (encrypted)
- Role (USER/ADMIN)

## Security

The application implements a JWT-based authentication system with:
- Authentication tokens with configurable expiration
- Differentiated roles and permissions
- Protection of sensitive endpoints
- Input data validation
- Passwords encrypted with BCrypt

## Development Notes

### Data Model
- **Users**: User information with roles (user or administrator)
- **Books**: Book details with title, author, genre, year, and availability
- **Loans**: Relationships between users and books with start, end, and return dates

### Security
- JWT-based authentication with token expiration
- Distinct roles for users and administrators
- Passwords encrypted with BCrypt

### UI/UX
- Responsive design compatible with mobile and desktop devices
- Custom theme with consistent primary and secondary colors
- Interactive components with visual feedback (hover, animations, etc.)
- Clear error and success messages for operations

### State Management
- Use of React Context API to manage authentication state
- Local state management in components for specific data
- Centralized API calls in services for code reuse

### Implemented Best Practices
- Client and server-side input validation
- Complete error handling with user feedback

---

*This repository was created as part of the educational journey at ITS Steve Jobs Academy.*