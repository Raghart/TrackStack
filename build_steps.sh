echo "Build TrackStack script"

echo "Installing Backend and Frontend dependencies"
npm install

echo "Build Frontend"
npm run build:frontend

echo "Build Backend"
npm run build:backend