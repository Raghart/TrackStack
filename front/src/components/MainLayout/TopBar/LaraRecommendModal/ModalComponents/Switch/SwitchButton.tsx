import { Box, Heading, Flex, Switch } from "@chakra-ui/react";
import { useAppDispatch } from "@/components/Utils/redux-hooks";
import { SwitchStyles } from "@/dynamicCSS/SwitchStyles";
import { SwitchOptionsType, SwitchLabelType } from "@/types/RecDataTypes";
import LeftSwitchTag from "./LeftSwitchTag";
import RightSwitchTag from "./RightSwitchTag";
import ControlSwitchStyle from "./ControlSwitchStyle";
import useSwitchValue from "@/components/Utils/hooks/useSwitchValue";
import { BLUE_SHADOW_MODAL, LARA_OPT_SIZES, SWITCH_BTN_TRANSITION } from "@/components/constants/TopBarC";

const SwitchButton = <SwitchLabel extends SwitchLabelType>({ params }:{ params: SwitchOptionsType<SwitchLabel> }) => {
    const { switchTagValue, toggleSwitchValue } = useSwitchValue(params.title, params.labels[0].label,
        params.labels[1].label, params.setValue);
    const dispatch = useAppDispatch();
    return(
        <Box p={5} bg="gray.800" borderRadius="full" border="1px solid" textAlign="center" flexDirection="column"
            borderColor="gray.600" boxShadow="lg" display="flex" justifyContent="space-between" w="full" h="120px" 
            _hover={{ boxShadow: BLUE_SHADOW_MODAL, transform: "scale(1.02)", borderColor: "blue.400" }} 
            transition={SWITCH_BTN_TRANSITION} maxW={LARA_OPT_SIZES}>

            <Heading fontSize="20px" mb={2} userSelect="none" fontWeight="700" letterSpacing="wider" 
                fontFamily="'Barlow Condensed', sans-serif">
                {params.title}
            </Heading>

            <Flex align="center" justify="center" gap={4}>
                <LeftSwitchTag label={params.labels[0].label} description={params.labels[0].description} />
                
                <Switch.Root size="lg" position="relative" display="flex" alignItems="center" w="75px" h="32px"
                    onChange={() => dispatch(toggleSwitchValue())}>
                    <Switch.HiddenInput />
                    <ControlSwitchStyle switchValue={switchTagValue} leftTag={SwitchStyles[params.labels[0].label]} 
                        rightTag={SwitchStyles[params.labels[1].label]} />
                    <Switch.Label />
                </Switch.Root>   

                <RightSwitchTag label={params.labels[1].label} description={params.labels[1].description} />
            </Flex>
        </Box>
    );
};

export default SwitchButton;