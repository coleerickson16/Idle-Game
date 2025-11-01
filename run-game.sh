#!/bin/bash
# Simple script to run the Adventure Idle game

echo "Starting Adventure Idle game server..."
echo "========================================"
echo ""
echo "The game will be available at:"
echo "  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8000
