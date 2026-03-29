import { HStack, Text, Icon } from "@chakra-ui/react";
import { MdGraphicEq } from "react-icons/md";
import { FaMusic, FaRegCommentDots } from "react-icons/fa";
import { SegmentButton } from "@/types/RecDataTypes";

export const SpeechOptions: SegmentButton[] = [
    {
        value: "Mixed",
        bg: "yellow.700",
        bgChecked: "yellow.500",
        shadow: "0 0 0 2px var(--chakra-colors-orange-500), 0 0 8px var(--chakra-colors-orange-500)",
        label: (
            <HStack gap={2}>
                <Icon color="orange.600" as={MdGraphicEq} boxSize={{ base: "18px", sm: "18px", lg: "20px"}} />
                <Text fontWeight="bold" letterSpacing="wide">Mixed</Text>
            </HStack>
        ),
    },
    {
        value: "Music",
        bg: "purple.700",
        bgChecked: "purple.500",
        shadow: "0 0 0 2px var(--chakra-colors-pink-500), 0 0 8px var(--chakra-colors-pink-500)",
        label: (
            <HStack gap={2}>
                <Icon color="pink.400" as={FaMusic} boxSize={{ base: "18px", sm: "18px", lg: "20px" }} />
                <Text fontWeight="bold" letterSpacing="wide">Music</Text>
            </HStack>
        ),
    },
    {
        value: "Speech",
        bg: "blue.700",
        bgChecked: "blue.500",
        shadow: "0 0 0 2px var(--chakra-colors-yellow-600), 0 0 8px var(--chakra-colors-yellow-600)",
        label: (
            <HStack gap={{ base: 1, sm: 1, lg: 2 }}>
                <Icon color="yellow.500" as={FaRegCommentDots} boxSize={{ base: "18px", sm: "18px", lg: "20px" }} />
                <Text fontWeight="bold" letterSpacing="wide">Speech</Text>
            </HStack>
        ),
    },
];