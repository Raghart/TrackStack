import { Box, For, Link, Text } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip"
import React from "react";

const ArtistLinks = ({ artists, color, hoverColor, size = "20px", txtDecor = false, lineClamp = 2, font = "body",
    fontWeight = "bold" }: { artists: string[], color: string, hoverColor: string, size?: string, txtDecor?: boolean, 
    lineClamp? : number, hasMore?: boolean, font?: string, fontWeight?: string }) => {
    return(
        <Text lineClamp={lineClamp} whiteSpace="normal" overflowWrap="break-word" wordBreak="break-word" zIndex={1}
        lineHeight={1}>
            <For each={artists}>
                {(artist: string, idx: number) => (
                <React.Fragment key={artist}>
                    <Tooltip showArrow content={artist} openDelay={200} closeDelay={0} positioning={{ placement: "right-start" }}
                    contentProps={{ css: { "--tooltip-bg": "colors.yellow.600", color: "white", fontWeight: "bold" } }}>
                        <Link href={`/artists/${encodeURIComponent(artist)}`} color={color} lineHeight={1}
                        fontStyle="italic" fontSize={size} fontWeight={fontWeight} transition="color 0.3s ease"
                        _hover={{ color: hoverColor, textDecoration: txtDecor ? "underline" : "none",
                        textUnderlineOffset: "1px" }} _focus={{ outline: "none" }} display="inline"
                        textDecorationColor={color} overflow={artist.length < 16 ? "visible" : "hidden"}
                        fontFamily={font} textShadow="0 1px 3px black">
                            {artist}
                        </Link>
                    </Tooltip>
                    {idx < artists.length - 1 && (
                        <Box as="span" color={color} display="inline" fontWeight="bold" overflow="visible" 
                            userSelect="none">,{" "}</Box>
                    )}
                </React.Fragment>
                )}
            </For>
        </Text>
    );
};

export default ArtistLinks;