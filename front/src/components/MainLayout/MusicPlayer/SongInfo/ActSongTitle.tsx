import { Link } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { ACTSONG_FONTSIZES } from "@/components/constants/MusicPlayerC";
import { SongResponse } from "@/types/songTypes";

const ActSongTitle = ({ id, name }: SongResponse) => {
    return(
        <Tooltip showArrow content={name} openDelay={200} closeDelay={0}
            contentProps={{ css: { "--tooltip-bg": "colors.blue.500", color: "white" } }}>
            <Link href={`/songs/${id}`} lineClamp={2} _focus={{ outline: "none" }} lineHeight={1.1} 
                textDecorationColor="white" fontSize={ACTSONG_FONTSIZES} fontWeight="700"
                textUnderlineOffset="1px" fontFamily="'Barlow', sans-serif">
                {name}
            </Link>
        </Tooltip>
    );
};

export default ActSongTitle;