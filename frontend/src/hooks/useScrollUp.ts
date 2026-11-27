import { useEffect, useState } from "react";

const useScrollUp = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const scrollUp = () => { window.scrollTo({ top: 0, behavior: "smooth" }) };

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            };
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return { scrollUp, isVisible }
};

export default useScrollUp;