import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import useGetSongCover from "@/components/Utils/hooks/useGetSongCover";

const hoisted = vi.hoisted(() => ({
    mockUseParams: vi.fn(),
    mockUseLazyQuery: vi.fn(),
    mockGetSongID: vi.fn(),
    mockToasterCreate: vi.fn(),
    lazyState: { data: undefined as { getSongData?: unknown } | undefined },
}));

export const { mockUseParams, mockUseLazyQuery, mockGetSongID, mockToasterCreate } = hoisted;

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router-dom")>();
    return {
        ...actual,
        useParams: hoisted.mockUseParams,
    };
});

vi.mock("@apollo/client", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@apollo/client")>();
    return {
        ...actual,
        useLazyQuery: (...args: unknown[]) => {
            hoisted.mockUseLazyQuery(...args);
            return [hoisted.mockGetSongID, { data: hoisted.lazyState.data }];
        },
    };
});

vi.mock("@/components/ui/toasterInstance", () => ({
    toaster: { create: hoisted.mockToasterCreate },
}));

export const setSongId = (songId: string | undefined) => {
    hoisted.mockUseParams.mockReturnValue({ songId });
};

export const setLazyData = (data: { getSongData?: unknown } | undefined) => {
    hoisted.lazyState.data = data;
};

export const resetSongCoverMocks = () => {
    hoisted.mockUseParams.mockReset();
    hoisted.mockUseLazyQuery.mockReset();
    hoisted.mockGetSongID.mockReset();
    hoisted.mockToasterCreate.mockReset();
    hoisted.lazyState.data = undefined;
    hoisted.mockUseParams.mockReturnValue({ songId: undefined });
};

export const renderSongCover = () => renderHook(() => useGetSongCover());

export const getLazyQueryDocument = () => {
    const document = hoisted.mockUseLazyQuery.mock.calls.at(-1)?.[0];
    if (!document) throw new Error("useLazyQuery was not called with a document");
    return document;
};
