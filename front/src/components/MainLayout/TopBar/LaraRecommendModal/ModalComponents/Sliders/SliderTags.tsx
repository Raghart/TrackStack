import { SLIDER_TAGS_GAP_SIZES, SLIDER_TAGS_PX_SIZES } from "@/components/constants/TopBarC";
import { TagSliderStyles } from "@/dynamicCSS/TagsSliderStyles";
import { SliderLabels } from "@/types/RecDataTypes";
import { Flex, For, Tag } from "@chakra-ui/react";

const SliderTags = ({ labels } : { labels: SliderLabels[] }) => {
    return(
        <Flex mt={3} gap={SLIDER_TAGS_GAP_SIZES}>
            <For each={labels}>
                {(label) => ( 
                    <Tag.Root key={label} size="md" variant="subtle" borderRadius="full" color="gray.300" 
                        bg={TagSliderStyles[label].bg} py={1} fontWeight="800" fontSize="'Barlow', sans-serif"
                        boxShadow={TagSliderStyles[label].border} letterSpacing="wide" px={SLIDER_TAGS_PX_SIZES}>
                            <Tag.Label>{label}</Tag.Label>
                    </Tag.Root>
                )}
            </For>
        </Flex>
    );
};

export default SliderTags;