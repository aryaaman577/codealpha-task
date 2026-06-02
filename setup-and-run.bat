@echo off
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║              CircleSphere - Setup and Run Script                  ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

echo [Step 1/4] Checking Node.js...
node --version
if errorlevel 1 (
    echo ✗ Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found!
echo.

echo [Step 2/4] Installing dependencies...
echo This will take 2-3 minutes...
echo.
call npm install
if errorlevel 1 (
    echo ✗ Installation failed!
    echo.
    echo Try running in Command Prompt:
    echo    npm install
    pause
    exit /b 1
)
echo ✓ Dependencies installed!
echo.

echo [Step 3/4] Adding sample data...
echo This is optional but recommended for testing
echo.
call npm run seed
echo.

echo [Step 4/4] Starting server...
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║  Server will start now...                                         ║
echo ║                                                                   ║
echo ║  After server starts, open your browser:                          ║
echo ║  http://localhost:3000                                            ║
echo ║                                                                   ║
echo ║  Login credentials:                                               ║
echo ║  Email: john@example.com                                          ║
echo ║  Password: password123                                            ║
echo ║                                                                   ║
echo ║  Press Ctrl+C to stop the server                                  ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo.

call npm start
