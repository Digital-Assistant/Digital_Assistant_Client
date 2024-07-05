import { vote, getVoteRecord } from "../services/userVote";
import { getUserId } from "../services/userService";
import { REST } from "../services/index";
import { ENDPOINT } from "../config/endpoints";

jest.mock("../services/userService");
jest.mock("../services/index");
jest.mock("../config/endpoints", () => ({
  ENDPOINT: {
    VoteRecord: "mock-vote-endpoint",
    fetchVoteRecord: "mock-fetch-vote-endpoint/",
  },
}));

describe("userVote - Extended Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("vote - Additional Tests", () => {
    it("should handle empty request object", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await vote({}, "up");
      expect(REST.apiCal).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            sequenceid: undefined,
          }),
        })
      );
    });

    it("should handle invalid vote type", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await vote({ id: "sequence-123" }, "invalid" as any);
      expect(REST.apiCal).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            upvote: 0,
            downvote: 0,
          }),
        })
      );
    });

    it("should handle null user ID", async () => {
      (getUserId as jest.Mock).mockResolvedValue(null);
      await expect(vote({ id: "sequence-123" }, "up")).rejects.toThrow();
    });

    it("should handle very long sequence IDs", async () => {
      const longId = "a".repeat(1000);
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await vote({ id: longId }, "up");
      expect(REST.apiCal).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            sequenceid: longId,
          }),
        })
      );
    });
  });

  describe("getVoteRecord - Additional Tests", () => {
    it("should handle empty request object", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await expect(getVoteRecord({})).rejects.toThrow();
    });

    it("should handle null sequence ID", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await expect(getVoteRecord({ id: null })).rejects.toThrow();
    });

    it("should handle very long sequence IDs", async () => {
      const longId = "a".repeat(1000);
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await getVoteRecord({ id: longId });
      expect(REST.apiCal).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(longId),
        })
      );
    });
  });

  describe("Error Handling - Additional Tests", () => {
    it("should handle network timeouts", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      (REST.apiCal as jest.Mock).mockRejectedValue(
        new Error("Network timeout")
      );
      await expect(vote({ id: "sequence-123" }, "up")).rejects.toThrow(
        "Network timeout"
      );
      await expect(getVoteRecord({ id: "sequence-123" })).rejects.toThrow(
        "Network timeout"
      );
    });

    it("should handle rate limiting errors", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      (REST.apiCal as jest.Mock).mockRejectedValue(
        new Error("Rate limit exceeded")
      );
      await expect(vote({ id: "sequence-123" }, "up")).rejects.toThrow(
        "Rate limit exceeded"
      );
      await expect(getVoteRecord({ id: "sequence-123" })).rejects.toThrow(
        "Rate limit exceeded"
      );
    });
  });

  describe("Performance - Additional Tests", () => {
    it("should handle multiple rapid votes", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      (REST.apiCal as jest.Mock).mockResolvedValue({ success: true });

      const votePromises = Array(10)
        .fill(null)
        .map(() => vote({ id: "sequence-123" }, "up"));
      await Promise.all(votePromises);

      expect(REST.apiCal).toHaveBeenCalledTimes(10);
    });
  });

  describe("Security - Additional Tests", () => {
    it("should not expose sensitive data in error messages", async () => {
      (getUserId as jest.Mock).mockResolvedValue("sensitive-user-id");
      (REST.apiCal as jest.Mock).mockRejectedValue(
        new Error("Error with sensitive data: sensitive-user-id")
      );

      await expect(vote({ id: "sequence-123" }, "up")).rejects.toThrow(/Error/);
      await expect(vote({ id: "sequence-123" }, "up")).rejects.not.toThrow(
        /sensitive-user-id/
      );
    });
  });

  describe("Edge Cases - Additional Tests", () => {
    it("should handle vote type as undefined", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await vote({ id: "sequence-123" }, undefined as any);
      expect(REST.apiCal).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            upvote: 0,
            downvote: 0,
          }),
        })
      );
    });

    it("should handle non-string sequence IDs", async () => {
      (getUserId as jest.Mock).mockResolvedValue("test-user-id");
      await vote({ id: 12345 as any }, "up");
      expect(REST.apiCal).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            sequenceid: 12345,
          }),
        })
      );
    });
  });
});
