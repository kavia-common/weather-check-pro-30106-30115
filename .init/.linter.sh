#!/bin/bash
cd /home/kavia/workspace/code-generation/weather-check-pro-30106-30115/weather_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

