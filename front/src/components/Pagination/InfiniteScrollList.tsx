import { useCallback, useEffect, useRef } from "react";
import { Box, For } from "@chakra-ui/react";
import { InfiniteScrollItems } from "@/types/utilTypes";

const InfiniteScrollList = <Items extends InfiniteScrollItems >({ items, renderItem, error, onLoadMore }: 
    { items: Items[], error: string, renderItem: (item: Items) => React.ReactNode, onLoadMore: () => void  }) => {
    const loader = useRef<HTMLDivElement>(null);
    
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting) {
            onLoadMore();
        };
    }, [onLoadMore])

    useEffect(() => {
        const option = { root: null, rootMargin: "20px", threshold: 0.25 };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
        return () => observer.disconnect();
    }, [handleObserver]);
    
    return(
        <>
            <For each={items} fallback={<Box>{error}</Box>}>
                {(renderItem)}
            </For>
            <Box ref={loader} />
        </>
    );
};

export default InfiniteScrollList;