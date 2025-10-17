import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { useActivities } from "./useActivities";
import { GET_ACTIVITIES } from "./useActivities";

// Mock the GraphQL query
const mockActivitiesData = {
  getActivities: [
    {
      id: "1",
      title: "Test Activity",
      message: "Test message",
      category: "Update",
      createdAt: "2024-01-15T10:00:00.000Z",
      expiresAt: "2024-12-31T23:59:59.000Z",
      isActive: true,
    },
  ],
};

const mocks = [
  {
    request: {
      query: GET_ACTIVITIES,
    },
    result: {
      data: mockActivitiesData,
    },
  },
];

describe("useActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return activities data", async () => {
    const { result } = renderHook(() => useActivities(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    // Initial loading state
    expect(result.current.loading).toBe(true);
    expect(result.current.activities).toEqual([]);

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check if data is loaded
    expect(result.current.activities).toEqual(mockActivitiesData.getActivities);
    expect(result.current.error).toBeUndefined();
  });

  it("should handle error state", async () => {
    const errorMock = [
      {
        request: {
          query: GET_ACTIVITIES,
        },
        error: new Error("Failed to fetch"),
      },
    ];

    const { result } = renderHook(() => useActivities(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={errorMock}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activities).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe("Failed to fetch");
  });
});
