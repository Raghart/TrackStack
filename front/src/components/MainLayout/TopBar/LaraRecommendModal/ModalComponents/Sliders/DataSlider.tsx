import { Heading, Slider, Flex } from "@chakra-ui/react";
import { useAppDispatch } from "@/components/Utils/redux-hooks";
import { useState } from "react";
import { SlidersDataTypes } from "@/types/RecDataTypes";
import { getSliderStyle } from "@/dynamicCSS/getDynamicSlider";
import SliderTags from "./SliderTags";
import { BLUE_SHADOW_MODAL, LARA_OPT_SIZES, SLIDER_SIZES } from "@/components/constants/TopBarC";

const DataSlider = ({ params }:{ params: SlidersDataTypes }) => {
    const [sliderValue, setSliderValue] = useState<number>(params.default);
    const { Bg, Icon, IconBorder, Shadow } = getSliderStyle(params.title, sliderValue);
    const dispatch = useAppDispatch();
    return(
        <Flex direction="column" p={3} bg="gray.800" borderRadius="full" border="1px solid" borderColor="gray.600" 
        boxShadow="lg" transition="all 0.2s ease-in-out" _hover={{ transform: "scale(1.02)", borderColor: "blue.400",
        boxShadow: BLUE_SHADOW_MODAL }} w="full" h="120px" maxW={LARA_OPT_SIZES} justify="center" align="center">

            <Heading fontSize="20px" mb={2} color="gray.100" textAlign="center" userSelect="none" fontWeight="700"
                fontFamily="'Barlow Condensed', sans-serif" letterSpacing="wider">
                {params.title}
            </Heading>

            <Slider.Root min={params.min} value={[sliderValue]} max={params.max} colorScheme="blue" cursor="pointer" 
                transition="all 0.3s ease" step={params.step} onValueChange={(e) => setSliderValue(e.value[0])} 
                size="lg" onValueChangeEnd={(e) => dispatch(params.setValue(e.value[0]))} w={SLIDER_SIZES}>
                <Slider.Control>
                    <Slider.Track bg="gray.700" h="10px" borderRadius="full">
                        <Slider.Range bg={Bg} transition="background-color 0.3s ease" />
                    </Slider.Track>   

                    <Slider.Thumb index={0} boxSize={6} border="2px solid" borderColor={IconBorder} 
                        _hover={{ boxShadow: Shadow }} bg="blackAlpha.800">
                            <Slider.DraggingIndicator layerStyle="fill.solid" top={6} rounded="sm" px="1.5">
                                <Slider.ValueText />
                            </Slider.DraggingIndicator>
                            {Icon}
                    </Slider.Thumb>

                    <Slider.Marks marks={params.min === 0 ? [0.30, 0.70] : [1.71, 3.60]} />
                </Slider.Control>
            </Slider.Root>
            <SliderTags labels={params.labels} /> 
        </Flex>
    );
};

export default DataSlider;