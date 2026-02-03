@echo off
echo 🚀 AI Streamer Backend - Quick Start
echo ====================================
echo.

if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created!
    echo.
    echo ⚠️  IMPORTANT: Please edit .env and add your credentials:
    echo    - Twitch: Get tokens from https://twitchtokengenerator.com
    echo    - YouTube: Get API key from https://console.cloud.google.com
    echo    - OpenAI: Get API key from https://platform.openai.com
    echo.
    echo After adding credentials, run this script again.
    pause
    exit /b 0
)

if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed!
    echo.
)

echo 🏗️  Building TypeScript...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🚀 Starting server...
    call npm start
) else (
    echo ❌ Build failed. Please check for errors above.
    pause
    exit /b 1
)
