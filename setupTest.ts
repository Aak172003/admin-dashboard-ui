import "@testing-library/jest-dom/vitest";

import { beforeEach, vi } from "vitest";

beforeEach(() => {
    // Mock for window.matchMedia - simulates CSS media query matching
    // This is needed because JSDOM doesn't support matchMedia API
    // Used by libraries like Ant Design for responsive behavior
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
        matches: false,        // Always returns false for media queries
        media: query,          // The media query string that was passed
        onchange: null,        // Event handler for media query changes
        addListener: vi.fn(),  // Legacy method for adding listeners
        removeListener: vi.fn(), // Legacy method for removing listeners
        addEventListener: vi.fn(), // Modern method for adding event listeners
        removeEventListener: vi.fn(), // Modern method for removing event listeners
        dispatchEvent: vi.fn(), // Method to dispatch custom events
    }));

    // Mock for window.getComputedStyle - simulates CSS computed styles
    // This is needed because JSDOM has limited CSS support
    // Used by libraries to read computed CSS properties
    const computedStyleMock = vi.fn().mockImplementation(() => ({
        // Returns an empty object since we don't need specific computed styles in tests
    }));

    // Replace global matchMedia with our mock
    vi.stubGlobal("matchMedia", matchMediaMock);
    // Replace global getComputedStyle with our mock
    vi.stubGlobal("computedStyle", computedStyleMock);

});