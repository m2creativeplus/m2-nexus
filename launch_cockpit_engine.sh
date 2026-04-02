#!/bin/bash
# M2 SOVEREIGN INTELLIGENCE - OPENCLAW COCKPIT LAUNCHER
# Starts OpenClaw Gateway, Nerve Standalone, and M2-Nexus UI

echo "Initializing Sovereign OpenClaw Cockpit Ecosystem..."

# 1. Start OpenClaw Gateway
openclaw gateway start

# 2. Start Nerve (Standalone UI on 4432) in background
cd "/Volumes/MAC DATA/Antigraphity/openclaw-workspace/openclaw-nerve"
npm run prod &
NERVE_PID=$!

# 3. Start M2-Nexus in foreground
cd "/Volumes/MAC DATA/Antigraphity/M2_PROJECTS_HUB/01_ACTIVE_MISSIONS/m2-nexus"
echo "Starting Nexus Dashboard..."
npm run dev

# Cleanup background Nerve process on exit
kill $NERVE_PID
