import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    DEFAULT_DURATION,
    createAudioMock,
    createRafHarness,
    renderAudioData,
    sliderDetails,
} from "@/test/audioDataSetups";

describe("useAudioData", () => {
    let raf: ReturnType<typeof createRafHarness>;

    beforeEach(() => {
        raf = createRafHarness();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("exposes the default state before any media metadata is loaded", () => {
        const { audio } = createAudioMock();

        const { result } = renderAudioData(audio);

        expect(result.current.currentTime).toBe(0);
        expect(result.current.duration).toBe(DEFAULT_DURATION);
        expect(typeof result.current.handleSongTime).toBe("function");
    });

    it("updates the duration from the loadedmetadata event", () => {
        const { audio, setDuration } = createAudioMock();
        const { result } = renderAudioData(audio);

        setDuration(42.5);
        act(() => {
            audio.dispatchEvent(new Event("loadedmetadata"));
        });

        expect(result.current.duration).toBe(42.5);
    });

    it("subscribes and unsubscribes the loadedmetadata listener", () => {
        const { audio, addEventListenerSpy, removeEventListenerSpy } = createAudioMock();

        const { unmount } = renderAudioData(audio);

        const listener = addEventListenerSpy.mock.calls.find(
            ([event]) => event === "loadedmetadata",
        )?.[1];
        expect(listener).toBeDefined();

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith("loadedmetadata", listener);
    });

    it("does not attach media listeners when there is no audio element", () => {
        const { addEventListenerSpy } = createAudioMock();

        renderAudioData(null);

        expect(addEventListenerSpy).not.toHaveBeenCalled();
        expect(raf.requestAnimationFrameMock).not.toHaveBeenCalled();
    });

    it("seeks the audio element and exposes the new time on slider change", () => {
        const { audio } = createAudioMock();
        const { result } = renderAudioData(audio);

        act(() => {
            result.current.handleSongTime(sliderDetails([12.5]));
        });

        expect(result.current.currentTime).toBe(12.5);
        expect(audio.currentTime).toBe(12.5);
    });

    it("still updates the slider state when the audio element is gone", () => {
        const { result } = renderAudioData(null);

        expect(() => {
            act(() => {
                result.current.handleSongTime(sliderDetails([7]));
            });
        }).not.toThrow();

        expect(result.current.currentTime).toBe(7);
    });

    it("follows audio.currentTime while playing through animation frames", () => {
        const { audio, setCurrentTime } = createAudioMock();
        const { result } = renderAudioData(audio, true);

        expect(raf.pendingCount()).toBe(1);

        setCurrentTime(5.25);
        raf.runFrame();

        expect(result.current.currentTime).toBe(5.25);
        expect(raf.pendingCount()).toBe(1);

        setCurrentTime(9);
        raf.runFrame();

        expect(result.current.currentTime).toBe(9);
    });

    it("does not start the animation loop while paused", () => {
        const { audio, setCurrentTime } = createAudioMock();
        const { result } = renderAudioData(audio, false);

        expect(raf.requestAnimationFrameMock).not.toHaveBeenCalled();

        setCurrentTime(15);
        raf.runFrame();

        expect(result.current.currentTime).toBe(0);
    });

    it("cancels the pending frame and stops updating when playback pauses", () => {
        const { audio, setCurrentTime } = createAudioMock();
        const { result, rerender } = renderAudioData(audio, true);

        expect(raf.pendingCount()).toBe(1);
        const pendingId = raf.requestAnimationFrameMock.mock.results[0].value;

        rerender({ isPlaying: false });

        expect(raf.cancelAnimationFrameMock).toHaveBeenCalledWith(pendingId);
        expect(raf.pendingCount()).toBe(0);

        setCurrentTime(20);
        raf.runFrame();

        expect(result.current.currentTime).toBe(0);
    });

    it("resumes the animation loop when playback restarts", () => {
        const { audio, setCurrentTime } = createAudioMock();
        const { result, rerender } = renderAudioData(audio, false);

        rerender({ isPlaying: true });
        expect(raf.pendingCount()).toBe(1);

        setCurrentTime(3);
        raf.runFrame();

        expect(result.current.currentTime).toBe(3);
    });

    it("cancels the animation loop on unmount", () => {
        const { audio } = createAudioMock();
        const { unmount } = renderAudioData(audio, true);

        expect(raf.pendingCount()).toBe(1);

        unmount();

        expect(raf.pendingCount()).toBe(0);
    });
});

describe("useAudioData hardening", () => {
    beforeEach(() => {
        createRafHarness();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("ignores a non-finite slider value instead of corrupting currentTime", () => {
        const { audio } = createAudioMock();
        const { result } = renderAudioData(audio);

        act(() => {
            result.current.handleSongTime(sliderDetails([Number.NaN]));
        });

        expect(result.current.currentTime).toBe(0);
        expect(Number.isFinite(audio.currentTime)).toBe(true);
    });

    it("ignores an empty slider value array", () => {
        const { audio } = createAudioMock();
        const { result } = renderAudioData(audio);

        act(() => {
            result.current.handleSongTime(sliderDetails([]));
        });

        expect(result.current.currentTime).toBe(0);
        expect(audio.currentTime).toBe(0);
    });

    it("clamps a negative slider value to zero", () => {
        const { audio } = createAudioMock();
        const { result } = renderAudioData(audio);

        act(() => {
            result.current.handleSongTime(sliderDetails([-5]));
        });

        expect(result.current.currentTime).toBe(0);
        expect(audio.currentTime).toBe(0);
    });

    it("clamps a slider value above the known duration", () => {
        const { audio } = createAudioMock();
        const { result } = renderAudioData(audio);

        act(() => {
            result.current.handleSongTime(sliderDetails([DEFAULT_DURATION + 10]));
        });

        expect(result.current.currentTime).toBe(DEFAULT_DURATION);
        expect(audio.currentTime).toBe(DEFAULT_DURATION);
    });

    it("clamps against the duration reported by the media metadata", () => {
        const { audio, setDuration } = createAudioMock();
        const { result } = renderAudioData(audio);

        setDuration(29.5);
        act(() => {
            audio.dispatchEvent(new Event("loadedmetadata"));
        });

        act(() => {
            result.current.handleSongTime(sliderDetails([40]));
        });

        expect(result.current.currentTime).toBe(29.5);
    });

    it("keeps a usable duration when metadata reports NaN", () => {
        const { audio, setDuration } = createAudioMock();
        const { result } = renderAudioData(audio);

        setDuration(Number.NaN);
        act(() => {
            audio.dispatchEvent(new Event("loadedmetadata"));
        });

        expect(result.current.duration).toBe(DEFAULT_DURATION);
    });

    it("keeps a usable duration when metadata reports Infinity", () => {
        const { audio, setDuration } = createAudioMock();
        const { result } = renderAudioData(audio);

        setDuration(Number.POSITIVE_INFINITY);
        act(() => {
            audio.dispatchEvent(new Event("loadedmetadata"));
        });

        expect(result.current.duration).toBe(DEFAULT_DURATION);
    });
});
