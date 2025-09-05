import { describe, it, expect, vi } from "vitest";
import { Logger } from "../src/utils/logger.js";

describe("Logger", () => {
  it("respects log levels", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    Logger.setLevel("error");
    Logger.info("should not appear");
    expect(spy).not.toHaveBeenCalled();
    Logger.setLevel("info");
    Logger.info("should appear");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
