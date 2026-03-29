import { Box, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/effect-coverflow";
import { EffectCoverflow } from 'swiper/modules';
import React from "react";
import LandpageSongCard from "@/components/Landpage/LandpageSongs/SongCard/LandpageSongCard";
import useLandpageSongs from "@/components/Utils/hooks/useLandpageSongs";
import { useAppSelector } from "@/components/Utils/redux-hooks";

const LandpageSongs = () => {
   const { landpageSongs, loading } = useLandpageSongs();
   const { isPlaying, activeSong } = useAppSelector(state => state.songs.songState);
    const responsiveSize = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5 });

    return(
        <Box w="full" h="full" borderRadius="2xl" bgGradient="to-br" gradientFrom="blackAlpha.800"
            gradientVia="purple.950" gradientTo="blackAlpha.800" border="2px solid" borderColor="blue.900">
            <Swiper effect="coverflow" grabCursor={true} centeredSlides={true} slidesPerView={responsiveSize} 
                coverflowEffect={{ rotate: 20, stretch: 0, depth: 200, modifier: 1, slideShadows: true }} 
                className="mySwiper" modules={[EffectCoverflow]} style={{ height: "100%" }} initialSlide={10} 
                loop={landpageSongs.length >= 10} speed={600} data-testid="Landpage-Cont">
                    {loading ? Array.from({ length: 15 }).map((_, idx) => (
                        <SwiperSlide key={`skeleton-${idx}`}>
                            <Skeleton h="full" w="full" borderRadius="xl" />
                        </SwiperSlide>
                    )) : landpageSongs.map((song) => (
                        <SwiperSlide key={song.id}>
                            <LandpageSongCard {...song} isSongPlaying={isPlaying && activeSong?.id === song.id} />
                        </SwiperSlide>
                    ))}
            </Swiper>
        </Box>
    );
};

export default React.memo(LandpageSongs);