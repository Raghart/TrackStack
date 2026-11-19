import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import type { SliderValueChangeDetails } from "@chakra-ui/react";
import useAudioData from "@/hooks/useAudioData";

export const DEFAULT_DURATION = 30;

export const createAudioMock = () => {
    const audio = document.createElement("audio");

    let durationValue = Number.NaN;
    let currentTimeValue = 0;

    Object.defineProperty(audio, "duration", {
        configurable: true,
        get: () => durationValue,
    });
    Object.defineProperty(audio, "currentTime", {
        configurable: true,
        get: () => currentTimeValue,
        set: (value: number) => {
            currentTimeValue = value;
        },
    });

    const addEventListenerSpy = vi.spyOn(audio, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(audio, "removeEventListener");

    return {
        audio,
        addEventListenerSpy,
        removeEventListenerSpy,
        setDuration: (value: number) => {
            durationValue = value;
        },
        setCurrentTime: (value: number) => {
            currentTimeValue = value;
        },
    };
};

export type AudioMock = ReturnType<typeof createAudioMock>;

export const sliderDetails = (value: number[]) =>
    ({ value, valueAsString: value.map(String) }) as SliderValueChangeDetails;

export const renderAudioData = (audio: HTMLAudioElement | null, isPlaying = false) => {
    const audioRef = { current: audio } as React.RefObject<HTMLAudioElement>;
    const view = renderHook(
        (props: { isPlaying: boolean }) => useAudioData(audioRef, props.isPlaying),
        { initialProps: { isPlaying } },
    );

    return { ...view, audioRef };
};

export const createRafHarness = () => {
    let nextId = 1;
    const pending = new Map<number, FrameRequestCallback>();

    const requestAnimationFrameMock = vi.fn((callback: FrameRequestCallback) => {
        const id = nextId++;
        pending.set(id, callback);
        return id;
    });
    const cancelAnimationFrameMock = vi.fn((id: number) => {
        pending.delete(id);
    });

    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);

    return {
        requestAnimationFrameMock,
        cancelAnimationFrameMock,
        pendingCount: () => pending.size,
        runFrame: (time = 0) => {
            const callbacks = [...pending.values()];
            pending.clear();
            act(() => {
                callbacks.forEach(callback => callback(time));
            });
        },
        reset: () => {
            pending.clear();
            requestAnimationFrameMock.mockClear();
            cancelAnimationFrameMock.mockClear();
        },
    };
};
