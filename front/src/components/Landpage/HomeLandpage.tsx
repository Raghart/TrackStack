import { Box } from "@chakra-ui/react";
import ArtistBar from "./ArtistBar/ArtistBar";
import GenreBar from "./GenreBar/GenreBar";
import LandpageSongs from "./LandpageSongs/LandpageSongs";

const Home = () => {
  return (
    <Box maxW="1120px" overflowX="hidden">
      <Box h={226} overflowX="hidden" mt={3}>
        <LandpageSongs />
      </Box>

      <GenreBar />      
      <ArtistBar />
    </Box>
  );
};

export default Home;