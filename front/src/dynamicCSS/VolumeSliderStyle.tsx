import { PiSpeakerHighBold, PiSpeakerSlashBold, PiSpeakerLowBold } from "react-icons/pi";

const VolumeStyle = {
    threshold: 0.5,
    Icon: [PiSpeakerSlashBold, PiSpeakerLowBold, PiSpeakerHighBold ]
};

export const getVolumeIconStyle = (value: number) => {
    const idx = value === 0 ? "0" : value < 0.5 ? "1" : "2";
    return VolumeStyle.Icon[idx]
};