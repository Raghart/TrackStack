import { ButtonGroup } from "@chakra-ui/react";
import useLoadBtnLogic from "@/components/Utils/hooks/useLoadBtnLogic";
import BtnPrevSong from "./BtnPrevSong";
import BtnNextSong from "./BtnNextSong";
import BtnPlaySong from "./BtnPlaySong";
import { SongResponse } from "@/types/songTypes";

const PlayControls = ({ activeSong, isPlaying }: { activeSong: SongResponse | null, isPlaying: boolean }) => {
    const { loadPrevSong, loadNextSong } = useLoadBtnLogic(activeSong);

    return(
        <ButtonGroup gap={0} pr={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            <BtnPrevSong loadPrevSong={loadPrevSong} />
            <BtnPlaySong isPlaying={isPlaying} />
            <BtnNextSong loadNextSong={loadNextSong} />
        </ButtonGroup>
    );
};

export default PlayControls;