#!/bin/bash

# M2 NEXUS Secure Online Engine Launcher
# This script starts the Next.js dashboard locally and opens a secure HTTPS tunnel
# to the internet, allowing you to access it from anywhere while maintaining 
# access to your local MacBook scripts.

echo "================================================="
echo "🌐 INITIATING M2 NEXUS ONLINE AUTOMATION ENGINE..."
echo "================================================="

cd "/Volumes/MAC DATA/Antigraphity/m2-nexus" || exit

echo "[1/2] Starting Local Production Server on Port 3000..."
# Start the server using nohup so it runs in the background
nohup npm run start > .nexus_engine.log 2>&1 &

# Brief pause to ensure the server starts
sleep 3

echo "[2/2] Opening Secure HTTPS Tunnel..."
echo "================================================="
echo "Generating your secure online dashboard link..."
echo "Keep this terminal open to maintain the online connection."
echo "================================================="

# Use localtunnel to expose port 3000 to the web. 
# We request a custom subdomain linked to M2 NEXUS.
npx localtunnel --port 3000 --subdomain m2-nexus-control
