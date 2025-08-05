import { Tag } from "@chakra-ui/react";
import { motion } from "framer-motion";

const GenreMoreTag = ({ selectedGenres } : { selectedGenres: string[] }) => {
    return(
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.2 }} key={"more" + selectedGenres.length}>
            <Tag.Root px={2} py={1} bg="gray.600" borderRadius="full" fontSize="xs" fontFamily="'Barlow', sans-serif" 
                fontWeight="600" whiteSpace="nowrap">
                <Tag.Label>+ {selectedGenres.length - 3} more</Tag.Label>
            </Tag.Root>
        </motion.div>
    );
};

export default GenreMoreTag;