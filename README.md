# Al Nab'a Event Registration App

A professional, full-stack mobile application designed to streamline the event registration process for Al Nab'a employees. This app provides a seamless interface for verifying employee details, managing registrations, and generating unique registration numbers (RND).

## 🚀 Project Overview

This project consists of a **React Native (Expo)** frontend and a **Python (Flask)** backend. It connects to a corporate **SQL Server** database to validate employee credentials and store registration data in real-time.

### Key Features

- **Employee Verification**: Instantly validates Employee IDs against the company database.
- **Auto-Population**: Automatically fetches and displays Employee Name and Company upon valid ID entry.
- **Duplicate Prevention**: Checks if an employee is already registered and prevents duplicate entries.
- **Smart Redirection**: If an employee is already registered, they are immediately guided to their existing confirmation page.
- **RND Generation**: Generates and assigns a unique 8-digit Registration Number (RND) upon successful registration.
- **Network Health Check**: Automatically verifies server connectivity before allowing the user to proceed.
- **Robust Error Handling**: Gracefully handles network timeouts and server errors with user-friendly prompts.
- **Modern UI/UX**: Features smooth animations using `react-native-reanimated` and a clean, professional design.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React Native (via Expo)
- **Language**: TypeScript
- **Styling**: StyleSheet, React Native Reanimated
- **Navigation**: Conditional Rendering (State-based)

### Backend
- **Framework**: Flask (Python)
- **Database Driver**: `pyodbc`
- **CORS**: `flask-cors` for cross-origin resource sharing

### Database
- **System**: Microsoft SQL Server
- **Table**: `Registration`

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

1.  **Node.js** (LTS version recommended)
2.  **Python 3.x**
3.  **ODBC Driver for SQL Server** (Required for `pyodbc`)
    - [Download ODBC Driver 17/18 for Windows](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)
4.  **Expo Go App** (on your mobile device) or an Android/iOS Emulator.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd reg-app
```

### 2. Backend Setup
The backend handles database connections and business logic.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  (Optional) Create a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configuration**:
    Open `backend/app.py` and verify the database credentials:
    ```python
    SERVER_IP = '172.16.31.60' # Update if your SQL Server IP changes
    DATABASE = 'AlnabaIT'
    USERNAME = 'your_username'
    PASSWORD = 'your_password'
    ```

### 3. Frontend Setup
The frontend is the mobile application interface.

1.  Navigate to the project root (if you are in `backend`, go back up):
    ```bash
    cd ..
    ```

2.  Install Node dependencies:
    ```bash
    npm install
    ```

3.  **Configuration**:
    Open `App.tsx` and ensure the `API_URL` matches your backend server's IP address:
    ```typescript
    // App.tsx
    const API_URL = 'http://172.16.31.60:8000'; // Must match the machine running app.py
    ```
    *Note: If running on a physical device, ensure your phone and computer are on the same Wi-Fi network.*

---

## 🚀 Running the Application

### Step 1: Start the Backend Server
Open a terminal in the `backend` folder and run:
```bash
python app.py
```
*You should see output indicating the server is running on `0.0.0.0:8000`.*

### Step 2: Start the Expo Frontend
Open a new terminal in the project root and run:
```bash
npx expo start
```

### Step 3: Launch on Device
1.  Scan the QR code displayed in the terminal using the **Expo Go** app (Android) or Camera app (iOS).
2.  The app will load on your device.

---

## 🔧 Troubleshooting

### Network Error / "Unable to connect"
- Ensure both devices are on the **same Wi-Fi network**.
- Check if the **Firewall** on the backend machine is blocking port `8000`.
- Verify the `API_URL` in `App.tsx` is correct.

### Database Connection Failed
- Ensure the **ODBC Driver** is installed.
- Verify the SQL Server credentials in `app.py`.
- Ensure SQL Server is configured to allow remote connections (TCP/IP enabled).

### "Employee ID not found"
- The entered ID does not exist in the `Registration` table. Ensure the database is populated with employee data.

---

## 📄 License
[Your License Here]
