import { fetchSpecialNodes } from "../services/searchService";
import {CONFIG} from "../config/index";
import {initSpecialNodes} from "../util/initSpecialNodes";
import {getAllChildren} from "../util/index";

// Mock the fetchSpecialNodes function
jest.mock("../services/searchService", () => ({
    fetchSpecialNodes: jest.fn().mockResolvedValue({}),
}));

describe("initSpecialNodes", () => {
    beforeEach(() => {
        // Clear the mock implementation and calls before each test
        fetchSpecialNodes.mockClear();
    });

    it("should fetch special nodes and set ignorable classes", async () => {
        // Arrange
        const mockContainer = document.createElement("div");
        mockContainer.classList.add(CONFIG.UDA_CONTAINER_CLASS);
        document.body.appendChild(mockContainer);

        // Act
        await initSpecialNodes();

        // Assert
        expect(fetchSpecialNodes).toHaveBeenCalled();
        expect(global.udaSpecialNodes).toEqual({});

        const children = getAllChildren(mockContainer);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            // Check if the child is not excluded and not already ignored
            if (
                child &&
                !global.udaSpecialNodes?.exclude?.tags?.includes(
                    child?.tagName?.trim()?.toLocaleLowerCase()
                ) &&
                child.className.indexOf(CONFIG.UDA_CLICK_IGNORE_CLASS) === -1
            ) {
                expect(child.className).toContain(CONFIG.UDA_CLICK_IGNORE_CLASS);
            }
        }
    });
});
