import { For, SegmentGroup } from "@chakra-ui/react";
import { SEGMENT_BTN_W, SEGMENT_FONTSIZE } from "@/components/constants/TopBarC";
import { SpeechOptions } from "../../DataOptions/SpeechLevelOptions";

const SegmentBtns = () => {
    return(
        <For each={SpeechOptions}>
            {(option) => (
                <SegmentGroup.Item key={option.value} value={option.value} mr={1} p={3} bg={option.bg} 
                    aria-label={option.value} _before={{ display: "none" }} position="relative" w="full"
                    _checked={{ bg: option.bgChecked, boxShadow: option.shadow }} cursor="pointer" maxW={SEGMENT_BTN_W}
                    _hover={{ boxShadow: option.shadow }} transition="box-shadow 0.3s ease, background 0.3s ease" 
                    fontSize={SEGMENT_FONTSIZE} fontFamily="'Barlow', sans-serif">
                    <SegmentGroup.ItemText>{option.label}</SegmentGroup.ItemText>
                    <SegmentGroup.ItemHiddenInput />
                </SegmentGroup.Item>
            )}
        </For>
    );
};

export default SegmentBtns;