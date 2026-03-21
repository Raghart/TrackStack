import { ButtonGroup } from "@chakra-ui/react";
import BtnPrevSong from "./BtnPrevSong";
import BtnNextSong from "./BtnNextSong";
import BtnPlaySong from "./BtnPlaySong";
import { SongResponse } from "@/types/songTypes";
import useLoadNextSong from "@/components/Utils/hooks/useLoadNextSong";
import useLoadPriorSong from "@/components/Utils/hooks/useLoadPriorSong";

const PlayControls = ({ activeSong, isPlaying }: { activeSong: SongResponse | null, isPlaying: boolean }) => {
    const loadNextSong = useLoadNextSong(activeSong);
    const loadPrevSong = useLoadPriorSong(activeSong);
    return(
        <ButtonGroup gap={0} pr={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            <BtnPrevSong loadPrevSong={loadPrevSong} />
            <BtnPlaySong isPlaying={isPlaying} />
            <BtnNextSong loadNextSong={loadNextSong} />
        </ButtonGroup>
    );
};

export default PlayControls;