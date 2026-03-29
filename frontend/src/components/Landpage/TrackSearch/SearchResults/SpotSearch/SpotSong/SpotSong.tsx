import { Card, Heading, LinkBox, LinkOverlay, useBreakpointValue } from "@chakra-ui/react";
import ArtistLinks from "@/components/Utils/ArtistLinks";
import { SONG_TITLE_FONTSIZES, SPOT_CARD_SIZES, SPOTSONG_ARTISTS_FONTSIZES, SPOTSONG_FONTSIZES } from "@/components/constants/TrackSearchC";
import PlaySongBox from "./PlaySongBox";
import { SongResponse } from "@/types/songTypes";

const SpotSong = ({ id, name, artists, album_cover, url_preview } : SongResponse) => {
    const artistFontsize = useBreakpointValue(SPOTSONG_ARTISTS_FONTSIZES);
    return(
        <Card.Root flexDirection="row" overflow="hidden" mt={2} bg="transparent" border="transparent" p={2} 
            _hover={{ "& .hover-card": { transform: "scale(1.1)" }, bg: "blue.800", "& .hover-play": { opacity: 1 } }} 
            transition="background-color 0.3s ease" w="full" maxW={SPOT_CARD_SIZES} data-testid="spotSongCard">

            <PlaySongBox id={id} name={name} artists={artists} album_cover={album_cover} url_preview={url_preview} />

            <Card.Body alignItems="center" justifyContent="center" className="hover-card" as={LinkBox} p={3}
                transition="transform 0.3s ease"gap={{ base: 1, sm: 1, md: 2, lg: 2 }}>

                <LinkOverlay href={`/songs/${id}`} lineHeight={0.9} textAlign="center" letterSpacing="wide"
                    fontSize={SPOTSONG_FONTSIZES} lineClamp={2} fontFamily="'Barlow Condensed', sans-serif" 
                    fontWeight="600" color="white">
                    {name}
                </LinkOverlay>  

                <ArtistLinks artists={artists} color="yellow.500" hoverColor="yellow.600" size={artistFontsize}
                    font="'Barlow', sans-serif" fontWeight="600" lineClamp={1} />

                <Heading fontSize={SONG_TITLE_FONTSIZES} lineHeight={1} fontWeight="700" color="blue.500" 
                    letterSpacing="wide" fontFamily="'Barlow Condensed', sans-serif">
                    Song
                </Heading>
            </Card.Body>
        </Card.Root>
    );
};

export default SpotSong;