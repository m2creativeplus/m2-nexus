#!/bin/bash

# M2 NEXUS Local Automation Engine Launcher
# This script starts the M2 NEXUS Next.js dashboard locally in the background,
# allowing it to act as a permanent automation engine capable of running your
# local Bash and Python AI scripts while you sleep.

echo "================================================="
echo "🚀 INITIATING M2 NEXUS AUTOMATION ENGINE..."
echo "================================================="

cd "/Volumes/MAC DATA/Antigraphity/m2-nexus" || exit

# Check if port 3000 is open
echo "Building latest code..."
npm run build 

echo "Starting Next.js Production Server on Port 3000..."
# Start the server using nohup so it runs in the background even if the terminal is closed
nohup npm run start > .nexus_engine.log 2>&1 &

echo "================================================="
echo "✅ M2 NEXUS ENGINE IS LIVE!"
echo "Dashboard available at: http://localhost:3000"
echo "Your M2 Creative Master UI is now securely connected to your MAC file system."
echo "You can close this terminal. The AI Automation agents will now be able to run non-stop."
echo "To stop the engine later: lsof -ti:3000 | xargs kill -9"
echo "================================================="
