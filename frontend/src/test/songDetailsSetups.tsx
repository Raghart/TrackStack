import { renderHook } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { vi } from "vitest";
import songReducer from "@/reducers/songReducer";
import useSongDetails from "@/hooks/useSongDetails";

const hoisted = vi.hoisted(() => ({
    mockUseQuery: vi.fn(),
}));

export const { mockUseQuery } = hoisted;

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useQuery: hoisted.mockUseQuery,
    };
});

export type QueryOptions = {
    skip?: boolean;
    variables?: { SongID?: unknown };
};

export type QueryResult = {
    loading: boolean;
    data?: { getSongData?: unknown };
};

export { validFullSong } from "@/test/songFixtures";

export const mockQueryResult = (result: QueryResult) => {
    hoisted.mockUseQuery.mockReturnValue(result);
};

export const resetQueryMock = () => {
    hoisted.mockUseQuery.mockReset();
    hoisted.mockUseQuery.mockReturnValue({ loading: false, data: undefined });
};

export const getQueryOptions = (): QueryOptions => {
    const options = hoisted.mockUseQuery.mock.calls.at(-1)?.[1];
    if (!options) throw new Error("useQuery was not called with options");
    return options;
};

export const getLastQuery = () => {
    const query = hoisted.mockUseQuery.mock.calls.at(-1)?.[0];
    if (!query) throw new Error("useQuery was not called with a document");
    return query;
};

export const createTestStore = () =>
    configureStore({
        reducer: { songs: songReducer },
    });

export type TestStore = ReturnType<typeof createTestStore>;

export const renderSongDetails = (store: TestStore, songId: number) =>
    renderHook(({ id }: { id: number }) => useSongDetails(id), {
        initialProps: { id: songId },
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
