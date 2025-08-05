import { HStack, Icon, Stat } from "@chakra-ui/react";
import { RiFolderMusicFill } from "react-icons/ri";
import { COUNT_FONTSIZE } from "@/components/constants/TopBarC";
import { AttentionSeeker } from 'react-awesome-reveal';
import CountUp from 'react-countup';
import useGetCount from "@/components/Utils/hooks/useGetCount";
import { useState } from "react";

const SongStats = () => {
    const count = useGetCount();
    const [isFinished, setIsFinished] = useState<boolean>(false);
    return(
        <Stat.Root maxW="240px" pl={2} pr={2} rounded="md" border="1px solid" py="3px" borderColor="gray.700" 
            boxShadow="lg" transition="transform 0.2s ease" _hover={{ transform: "scale(1.03)" }} userSelect="none">
            <HStack justify="space-between" align="center">
                <AttentionSeeker effect={isFinished ? "heartBeat" : undefined}>
                    <Stat.ValueText fontSize={COUNT_FONTSIZE} fontFamily="'Barlow', sans-serif" bgGradient="to-br" 
                        bgClip="text" gradientFrom="orange.500" fontWeight="600" gradientVia="yellow.500" 
                        gradientTo="orange.500">  
                        <CountUp end={count} duration={5} separator="," onEnd={() => setIsFinished(true)} />
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