#!/bin/bash

echo "🚀 AI Streamer Backend - Quick Start"
echo "===================================="
echo ""

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your credentials:"
    echo "   - Twitch: Get tokens from https://twitchtokengenerator.com"
    echo "   - YouTube: Get API key from https://console.cloud.google.com"
    echo "   - OpenAI: Get API key from https://platform.openai.com"
    echo ""
    echo "After adding credentials, run this script again."
    exit 0
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

echo "🏗️  Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting server..."
    npm start
else
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi
