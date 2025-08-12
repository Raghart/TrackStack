import { Box } from "@chakra-ui/react";
import ArtistBar from "./ArtistBar/ArtistBar";
import GenreBar from "./GenreBar/GenreBar";
import LandpageSongs from "./LandpageSongs/LandpageSongs";
import { LANDPAGE_SONGS_HEIGHT } from "../constants/MainLayoutC";

const Home = () => {
  return (
    <Box maxW="1120px" overflowX="hidden">
      <Box h={LANDPAGE_SONGS_HEIGHT} overflowX="hidden" mt={3}>
        <LandpageSongs />
      </Box>

      <GenreBar />      
      <ArtistBar />
    </Box>
  );
};

export default Home;