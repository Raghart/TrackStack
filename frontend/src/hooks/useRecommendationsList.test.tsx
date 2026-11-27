import { act } from "@testing-library/react";
import { setLaraRecommendations } from "@/reducers/recommendReducer";
import {
    createSongs,
    createTestStore,
    renderRecommendationsList,
    TestStore,
} from "@/test/songRecSetups";

describe("useRecommendationsList", () => {
    let store: TestStore;

    beforeEach(() => {
        store = createTestStore();
    });

    it("starts with only the first 20 recommendations visible", () => {
        const songs = createSongs(45);
        store.dispatch(setLaraRecommendations(songs));

        const { result } = renderRecommendationsList(store);

        expect(result.current.recommendations).toHaveLength(45);
        expect(result.current.visibleSongs).toHaveLength(20);
        expect(result.current.visibleSongs).toEqual(songs.slice(0, 20));
        expect(typeof result.current.loadMoreSongs).toBe("function");
    });

    it("loads 20 more songs per call and stops at the end of the list", () => {
        const songs = createSongs(45);
        store.dispatch(setLaraRecommendations(songs));
        const { result } = renderRecommendationsList(store);

        act(() => result.current.loadMoreSongs());
        expect(result.current.visibleSongs).toHaveLength(40);

        act(() => result.current.loadMoreSongs());
        expect(result.current.visibleSongs).toHaveLength(45);

        act(() => result.current.loadMoreSongs());
        expect(result.current.visibleSongs).toHaveLength(45);
        expect(result.current.visibleSongs).toEqual(songs);
    });

    it("does nothing when every recommendation is already visible", () => {
        const songs = createSongs(20);
        store.dispatch(setLaraRecommendations(songs));
        const { result } = renderRecommendationsList(store);

        act(() => result.current.loadMoreSongs());

        expect(result.current.visibleSongs).toHaveLength(20);
        expect(result.current.visibleSongs).toEqual(songs);
    });

    it("keeps a slice of the current recommendations instead of caching the initial list", () => {
        store.dispatch(setLaraRecommendations(createSongs(3)));
        const { result, rerender } = renderRecommendationsList(store);

        act(() => {
            store.dispatch(setLaraRecommendations(createSongs(5)));
        });
        rerender();

        expect(result.current.recommendations).toHaveLength(5);
        expect(result.current.visibleSongs).toHaveLength(5);
    });

    it("shows every recommendation when there are fewer than a page", () => {
        const songs = createSongs(4);
        store.dispatch(setLaraRecommendations(songs));

        const { result } = renderRecommendationsList(store);

        expect(result.current.visibleSongs).toEqual(songs);
    });
});
