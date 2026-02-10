#!/bin/bash
nohup npm run dev > server.log 2>&1 &
echo $! > server.pid
echo "Server started with PID $(cat server.pid)"
