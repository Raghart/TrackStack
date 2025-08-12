import { Box } from "@chakra-ui/react";
import HomeBar from "./HomeBar/HomeBar";
import { Outlet } from "react-router-dom";
import MusicPlayer from "./MusicPlayer/MusicPlayer";
import TopBar from "./TopBar/TopBar";
import { useAppSelector } from "../Utils/redux-hooks";
import useGetSongCover from "../Utils/hooks/useGetSongCover";
import { MAIN_LAYOUT_HEIGHT, MAIN_LAYOUT_ML, MAIN_LAYOUT_MR } from "../constants/MainLayoutC";
import TrackSearch from "../Landpage/TrackSearch/TrackSearch";

const MainLayout = () => {
    const song = useGetSongCover();
    const isTyping = useAppSelector(state => state.search.query.length > 0);
    return(
        <Box position="relative" minH="100vh" pt={4} pl={3} overflowX="hidden" w="full" bgRepeat="no-repeat"
            bgImage={song?.album_cover ? `url(${song.album_cover})` : undefined} bgSize="cover" bgPos="center">
            <HomeBar />
            <TopBar />

            <Box ml={MAIN_LAYOUT_ML} minH={MAIN_LAYOUT_HEIGHT} mr={MAIN_LAYOUT_MR}>
                {isTyping ? <TrackSearch /> : <Outlet />}
            </Box>

            <MusicPlayer />
        </Box>
    );
};

export default MainLayout;