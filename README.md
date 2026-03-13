# 🏥 ClinicOS – Doctor Appointment & Scheduling System

ClinicOS is a full-stack web application built to simplify and automate the appointment scheduling process in a medical clinic.

Clinics often rely on manual systems where receptionists manage bookings through phone calls and registers, leading to double bookings, missed cancellations, and inefficient schedules. ClinicOS solves this problem by providing a centralized digital system for managing appointments, users, and schedules.

This project was developed during a hackathon to demonstrate how modern web technologies can streamline clinic operations.

---

## 🚀 Problem Statement

Managing appointments in clinics is often chaotic and error-prone due to manual processes.

Receptionists typically:
- Handle appointment requests via phone or walk-ins
- Manually check doctor availability
- Maintain registers to avoid double bookings
- Inform patients about cancellations or schedule changes

This leads to several problems:
- Double bookings
- Missed appointments
- Scheduling gaps
- Poor patient communication

ClinicOS addresses these issues by providing a **browser-based clinic management system** that automates appointment scheduling and prevents conflicts.

---

## 💡 Our Solution

ClinicOS provides a **centralized system** that allows:

- Patients to book appointments easily
- Receptionists to manage schedules
- Doctors to view and update appointments
- The system to automatically prevent booking conflicts

The application ensures that clinic schedules remain organized while reducing manual workload.

---

## 👥 User Roles

The system supports three types of users.

### 👤 Patient
Patients can:
- Register and login
- Book appointments
- View upcoming appointments
- Cancel or reschedule appointments

---

### 🩺 Doctor
Doctors can:
- View their daily schedule
- Access appointment details
- Mark appointments as completed
- Manage patient visits

---

### 🧑‍💼 Receptionist
Receptionists can:
- Create appointments for patients
- Cancel or reschedule appointments
- View all appointments
- Manage clinic schedules

---

## ⭐ Key Features

### 🔐 Secure Authentication
- JWT based authentication
- Password hashing using bcrypt
- Role-based access control

### 📅 Smart Appointment Scheduling
- Prevents double booking
- Tracks appointment status
- Allows cancellation and rescheduling

### 🧑‍⚕️ Role-Based Dashboards
Separate dashboards for:
- Patients
- Doctors
- Receptionists

### 🌍 Multilingual Support
The platform supports multilingual UI to improve accessibility for users who prefer different languages.

### 🤖 AI Chatbot (Planned Feature)
We plan to integrate an AI-powered chatbot that can:
- Assist patients with booking appointments
- Answer common questions
- Provide guidance for clinic services

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Hooks

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT (JSON Web Token)
- bcrypt

---

## 📂 Project Structure
