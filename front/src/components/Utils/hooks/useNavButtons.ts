import { useLocation } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { FaTags } from "react-icons/fa6";
import { NavItem } from "@/types/utilTypes";
import { IoHomeSharp } from "react-icons/io5";

const useNavButtons = (): NavItem[] => {
    const location = useLocation();
    const current = location.pathname;
    return [
    { name: "Home", iconType: IoHomeSharp, IconColor: "blue.500", path: "/", bg: current === "/" ? "gray.800": "transparent", 
        hover: current === "/" ? "gray.700" : "gray.800" },
    { name: "Artists", iconType: FaUserAlt, IconColor: "yellow.500", path: "/artists", bg: current === "/artists" ? "gray.800": "transparent", 
        hover: current === "/artists" ? "gray.700" : "gray.800"},
    { name: "Genres", iconType: FaTags, IconColor: "teal.500", path: "/genres", bg: current === "/genres" ? "gray.800": "transparent",
        hover: current === "/genres" ? "gray.700" : "gray.800" },
    ];
};

export default useNavButtons;