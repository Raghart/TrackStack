#!/bin/bash

echo "Starting Build script"

echo "Install Backend dependencies"
npm install

echo "Build Backend"
npm run build

cd ../front

echo "Install Frontend dependencies"
npm install

echo "Build Frontend"
npm run build
