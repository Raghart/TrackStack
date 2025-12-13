import { Navigate, Route, Routes } from "react-router-dom";
import SongDetails from "./components/SongPath/SongInfoLayout/SongDetails";
import Home from "./components/Landpage/HomeLandpage";
import MainLayout from "./components/MainLayout/MainLayout";
import DetailsLayout from "./components/DetailsPath/Layout/DetailsLayout";
import GenreSelection from "./components/GenrePath/GenreSelection";
import ArtistSelection from "./components/ArtistPath/ArtistSelection";
import LaraRecommendations from "./components/LaraRecommendationsPath/LaraRecommendations";
import GenreDetails from "./components/GenreDetails/GenreDetails";

const App = () => {
  return (
      <Routes>
          <Route path="/" element={<MainLayout /> } >
            <Route index element={<Home /> } />
            <Route path="/songs/:songId" element={<SongDetails /> } />
            <Route path="/recommendations" element={<LaraRecommendations /> } />
            <Route path="/artists" element={<ArtistSelection /> } />
            <Route path="/artists/:artist" element={<DetailsLayout type="artist" gradientInit="orange.500" 
              gradientMid="yellow.500" error="Not found in the Database" /> } />
            <Route path="/albums/:album" element={<DetailsLayout type="album" gradientInit="yellow.500" 
              gradientMid="orange.500" error="Not found in the Database" /> } />
            <Route path="/genres" element={<GenreSelection /> } />
            <Route path="/genres/:genre" element={<GenreDetails /> } />
            <Route path="*" element={<Navigate to="/" replace /> } />
          </Route>
      </Routes>
  );
};

export default App;
