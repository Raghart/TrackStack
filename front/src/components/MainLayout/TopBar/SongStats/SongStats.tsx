import { HStack, Icon, Stat, useBreakpointValue } from "@chakra-ui/react";
import { RiFolderMusicFill } from "react-icons/ri";
import { COUNT_FONTSIZE, COUNTBOX_SIZES } from "@/components/constants/TopBarC";
import { AttentionSeeker } from 'react-awesome-reveal';
import CountUp from 'react-countup';
import useGetCount from "@/components/Utils/hooks/useGetCount";
import { useState } from "react";
import MobileCount from "./MobileCount";

const SongStats = () => {
    const count: number = useGetCount();
    const isMobile = useBreakpointValue({ base: true, sm: false }); 
    const [isFinished, setIsFinished] = useState<boolean>(false);
    return(
        <Stat.Root pl={2} pr={2} rounded="md" border="1px solid" py="3px" borderColor="gray.700" maxW={COUNTBOX_SIZES} 
            boxShadow="lg" transition="transform 0.2s ease" userSelect="none" 
            _hover={{ transform: "scale(1.03)" }}>
            <HStack justify="space-between" align="center">
                <AttentionSeeker effect={isFinished ? "heartBeat" : undefined}>
                    <Stat.ValueText fontSize={COUNT_FONTSIZE} fontFamily="'Barlow', sans-serif" bgGradient="to-br" 
                        bgClip="text" gradientFrom="orange.500" fontWeight="600" gradientVia="yellow.500" 
                        gradientTo="orange.500">
                        {isMobile ? (<MobileCount setIsFinished={setIsFinished} /> ) : 
                        (<CountUp end={count} duration={5} separator="," onEnd={() => setIsFinished(true)} />)}
                    </Stat.ValueText>
                </AttentionSeeker>
                <Stat.Label fontSize="md" color="gray.300" fontFamily="'Barlow'" fontWeight="600" 
                    hideBelow="md">
                    Songs
                </Stat.Label>
                <Icon as={RiFolderMusicFill} color="blue.500" boxSize={{ base: 5, sm: 5, md: 6, lg: 6}} />
            </HStack>
        </Stat.Root>
    );
};

export default SongStats;