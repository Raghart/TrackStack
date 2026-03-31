echo "Build TrackStack script"

cd ..

echo "Installing Backend and Frontend dependencies"
npm install

cd backend/

echo "Build Backend"
npm run build

cd ../frontend

echo "Build Frontend"
npm run build