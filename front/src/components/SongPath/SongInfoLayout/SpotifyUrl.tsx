import { SPOTIFY_LINK_FONTSIZE, SPOTIFY_LINK_SHADOW, SPOTIFY_URL_FONTSIZE } from "@/components/constants/SongDetailsC";
import { Heading, Link } from "@chakra-ui/react";

const SpotifyUrl = ({ url }: { url: string }) => {
    return(
        <Heading fontSize={SPOTIFY_URL_FONTSIZE} userSelect="none" textAlign="center" lineHeight={1} 
            fontFamily="'Barlow Condensed', sans-serif" letterSpacing="wide" textShadow="0 1px 3px black">
            Check out the Full Song{" "}
            <Link fontSize={SPOTIFY_LINK_FONTSIZE} fontWeight="700" href={url} color="teal.500" 
            transition="text-shadow 0.3s ease" 
                _hover={{ textShadow: SPOTIFY_LINK_SHADOW, textDecoration: "none" }} _focus={{ outline: "none" }}>
                Here
            </Link>
        </Heading>
    );
};

export default SpotifyUrl;