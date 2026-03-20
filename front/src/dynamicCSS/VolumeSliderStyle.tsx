import { IconType } from "react-icons/lib";
import { PiSpeakerHighBold, PiSpeakerSlashBold, PiSpeakerLowBold } from "react-icons/pi";

const MapVolumeStyle = new Map<number, IconType> ([
    [0, PiSpeakerSlashBold],
    [1, PiSpeakerLowBold],
    [2, PiSpeakerHighBold]
]);

export const getVolumeIconStyle = (value: number) => {
    const idx = value === 0 ? 0 : value < 0.5 ? 1 : 2;
    return MapVolumeStyle.get(idx) ?? PiSpeakerHighBold;
};