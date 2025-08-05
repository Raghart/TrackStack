import { Box, Flex, For, SimpleGrid } from "@chakra-ui/react";
import GenreSelector from "./ModalComponents/GenreSelector/GenreSelector";
import { SliderOptions } from "./DataOptions/SliderOptions";
import { AcousticnessOptions, MoodOptions, SlidersDataTypes, SwitchOptionsType, VoiceTypeOptions } from "@/types/RecDataTypes";
import { Fragment } from "react/jsx-runtime";
import DataSlider from "./ModalComponents/Sliders/DataSlider";
import { SwitchDataOptions } from "./DataOptions/SwitchOptions";
import SegmentOptions from "./ModalComponents/Segments/SegmentOptions";
import SwitchButton from "./ModalComponents/Switch/SwitchButton";

const HandleModalOptions = () => {
    return(
        <Flex align="center" justify="center">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} gap={5}>
                <Box zIndex={1}>
                    <GenreSelector />
                </Box>

                <For each={SliderOptions}>
                    {(SliderParams: SlidersDataTypes, idx: number) => (
                    <Fragment key={SliderParams.title}>
                        <DataSlider params={SliderParams} />
                        {idx === 0 && (<SegmentOptions key="segment-options" />)}
                    </Fragment>
                    )}
                </For>

                <For each={SwitchDataOptions}>
                    {(SwitchParams) => {
                    switch (SwitchParams.title) {
                        case "Voice Type":
                            return(
                            <SwitchButton<VoiceTypeOptions> key={SwitchParams.title}
                            params={SwitchParams as SwitchOptionsType<VoiceTypeOptions>} />
                        )
                        case "Mood":
                            return(
                            <SwitchButton<MoodOptions> key={SwitchParams.title} 
                            params={SwitchParams as SwitchOptionsType<MoodOptions>} />
                        )
                        case "Acousticness":
                            return(
                            <SwitchButton<AcousticnessOptions> key={SwitchParams.title} 
                            params={SwitchParams as SwitchOptionsType<AcousticnessOptions>} />
                        )
                    }}}
                </For>   
            </SimpleGrid>
        </Flex>  
    );
};

export default HandleModalOptions;