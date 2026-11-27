import { act } from "@testing-library/react";
import { vi } from "vitest";
import { setActiveAudio, togglePlayAudio } from "@/reducers/songReducer";
import {
    activeSongFixture,
    createAudioMock,
    createSongStore,
    dispatchCanPlay,
    nextSongFixture,
    renderSongState,
} from "@/test/songStateSetups";

describe("useSongState", () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns the active song and the playback flag from the store", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio } = createAudioMock();

        const { result } = renderSongState(store, audio);

        expect(result.current.activeSong).toEqual(activeSongFixture);
        expect(result.current.isPlaying).toBe(true);
    });

    it("returns no active song when the store is empty", () => {
        const store = createSongStore();
        const { audio } = createAudioMock();

        const { result } = renderSongState(store, audio);

        expect(result.current.activeSong).toBeNull();
        expect(result.current.isPlaying).toBe(false);
    });

    it("does not set a source or play when there is no active song", () => {
        const store = createSongStore();
        const { audio, playMock } = createAudioMock();

        renderSongState(store, audio);

        expect(audio.src).toBe("");
        expect(playMock).not.toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("pauses the audio element when playback is not active", () => {
        const store = createSongStore();
        const { audio, pauseMock } = createAudioMock();

        renderSongState(store, audio);

        expect(pauseMock).toHaveBeenCalledTimes(1);
    });

    it("sets the audio source from the active song preview", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio, playMock } = createAudioMock();

        renderSongState(store, audio);

        expect(audio.src).toBe(activeSongFixture.url_preview);
        expect(playMock).not.toHaveBeenCalled();
    });

    it("plays the song once the audio can start playing", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio, playMock } = createAudioMock();

        renderSongState(store, audio);

        act(() => dispatchCanPlay(audio));

        expect(playMock).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("plays immediately when the media is already able to play", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio, playMock } = createAudioMock();
        const addSpy = vi.spyOn(audio, "addEventListener");
        Object.defineProperty(audio, "readyState", {
            configurable: true,
            get: () => HTMLMediaElement.HAVE_FUTURE_DATA,
        });

        renderSongState(store, audio);

        expect(playMock).toHaveBeenCalledTimes(1);
        expect(addSpy.mock.calls.some(([event]) => event === "canplay")).toBe(false);
    });

    it("does not play when the song is paused even if the media becomes playable", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: false });
        const { audio, playMock, pauseMock } = createAudioMock();

        renderSongState(store, audio);

        act(() => dispatchCanPlay(audio));

        expect(audio.src).toBe(activeSongFixture.url_preview);
        expect(playMock).not.toHaveBeenCalled();
        expect(pauseMock).toHaveBeenCalled();
    });

    it("registers a one-shot canplay listener and removes it on unmount", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio } = createAudioMock();
        const addSpy = vi.spyOn(audio, "addEventListener");
        const removeSpy = vi.spyOn(audio, "removeEventListener");

        const { unmount } = renderSongState(store, audio);

        const canPlayCall = addSpy.mock.calls.find(([event]) => event === "canplay");
        expect(canPlayCall).toBeDefined();
        expect(canPlayCall?.[2]).toEqual({ once: true });

        const handler = canPlayCall?.[1];
        unmount();

        expect(removeSpy).toHaveBeenCalledWith("canplay", handler);
    });

    it("pauses playback when the store toggles isPlaying to false", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio, playMock, pauseMock } = createAudioMock();

        renderSongState(store, audio);
        pauseMock.mockClear();

        act(() => {
            store.dispatch(togglePlayAudio());
        });

        expect(pauseMock).toHaveBeenCalledTimes(1);
        expect(playMock).not.toHaveBeenCalled();
    });

    it("does not play a paused song when a stale canplay event arrives", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio, playMock, pauseMock } = createAudioMock();

        renderSongState(store, audio);

        act(() => {
            store.dispatch(togglePlayAudio());
        });
        act(() => dispatchCanPlay(audio));

        expect(playMock).not.toHaveBeenCalled();
        expect(pauseMock).toHaveBeenCalled();
    });

    it("switches the source and plays the new song when the active song changes", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio, playMock } = createAudioMock();

        renderSongState(store, audio);
        act(() => dispatchCanPlay(audio));

        expect(playMock).toHaveBeenCalledTimes(1);

        act(() => {
            store.dispatch(setActiveAudio(nextSongFixture));
        });

        expect(audio.src).toBe(nextSongFixture.url_preview);
        expect(playMock).toHaveBeenCalledTimes(1);

        act(() => dispatchCanPlay(audio));

        expect(playMock).toHaveBeenCalledTimes(2);
    });

    it("logs a warning and keeps running when the browser rejects play", async () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio, playMock } = createAudioMock();
        playMock.mockRejectedValue(new Error("NotAllowedError"));

        renderSongState(store, audio);
        act(() => dispatchCanPlay(audio));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(playMock).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).toHaveBeenCalledWith("Play failed", "NotAllowedError");
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("trims the preview URL before assigning it", () => {
        const store = createSongStore({
            activeSong: { ...activeSongFixture, url_preview: `  ${activeSongFixture.url_preview}  ` },
            isPlaying: true,
        });
        const { audio } = createAudioMock();

        renderSongState(store, audio);

        expect(audio.src).toBe(activeSongFixture.url_preview);
    });

    it("does not reassign the source when playback is paused and resumed", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio } = createAudioMock();
        const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "src");
        const assignments: string[] = [];
        Object.defineProperty(audio, "src", {
            configurable: true,
            get: () => descriptor?.get?.call(audio),
            set: (value: string) => {
                assignments.push(value);
                descriptor?.set?.call(audio, value);
            },
        });

        renderSongState(store, audio);
        expect(assignments).toHaveLength(1);

        act(() => {
            store.dispatch(togglePlayAudio());
        });
        act(() => {
            store.dispatch(togglePlayAudio());
        });

        expect(assignments).toHaveLength(1);
    });

    it("clears a stale source when the new active song preview is invalid", () => {
        const store = createSongStore({ activeSong: activeSongFixture, isPlaying: true });
        const { audio } = createAudioMock();

        renderSongState(store, audio);
        expect(audio.src).toBe(activeSongFixture.url_preview);

        act(() => {
            store.dispatch(
                setActiveAudio({ ...nextSongFixture, url_preview: "javascript:alert(1)" }),
            );
        });

        expect(audio.hasAttribute("src")).toBe(false);
        expect(audio.src).toBe("");
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });

    it.each([
        { label: "an empty string", value: "" },
        { label: "a whitespace-only string", value: "   " },
        { label: "a non-string value", value: 42 },
        { label: "a javascript URL", value: "javascript:alert(1)" },
        { label: "a data URL", value: "data:audio/mpeg;base64,AAAA" },
        { label: "a relative URL", value: "/previews/nude.mp3" },
        { label: "an oversized string", value: `https://example.com/${"a".repeat(2049)}` },
    ])("ignores $label in url_preview", ({ value }) => {
        const store = createSongStore({
            activeSong: {
                ...activeSongFixture,
                url_preview: value as unknown as string,
            },
            isPlaying: true,
        });
        const { audio, playMock } = createAudioMock();

        renderSongState(store, audio);

        expect(audio.src).toBe("");
        expect(playMock).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Validation failed for schema:",
            expect.anything(),
        );
    });
});
