import { SLIDER_TAGS_GAP_SIZES, SLIDER_TAGS_PX_SIZES } from "@/components/constants/TopBarC";
import { MapSliderStyles } from "@/dynamicCSS/TagsSliderStyles";
import { SliderLabels } from "@/types/RecDataTypes";
import { Flex, For, Tag } from "@chakra-ui/react";

const SliderTags = ({ labels } : { labels: SliderLabels[] }) => {
    return(
        <Flex mt={3} gap={SLIDER_TAGS_GAP_SIZES}>
            <For each={labels}>
                {(label) => {
                    let labelStyle = MapSliderStyles.get(label);
                    if (labelStyle === undefined) {
                        labelStyle = {
                            bg: "gray.500", 
                            border: "0 0 0 2px var(--chakra-colors-gray-500), 0 0 8px var(--chakra-colors-gray-500)"
                        }
                    };
                    return ( 
                    <Tag.Root key={label} size="md" variant="subtle" borderRadius="full" color="gray.300" 
                        bg={labelStyle.bg} py={1} fontWeight="800"
                        boxShadow={labelStyle.border} letterSpacing="wide" 
                        px={SLIDER_TAGS_PX_SIZES} fontSize="'Barlow', sans-serif">
                            <Tag.Label>{label}</Tag.Label>
                    </Tag.Root>
                )
                }}
            </For>
        </Flex>
    );
};

export default SliderTags;