import { describe, expect, it } from "vitest";

describe("Egypt launch defaults", () => {
  it("formats the Egyptian pound locale", () => {
    const formatted = new Intl.NumberFormat("ar-EG", {
      currency: "EGP",
      currencyDisplay: "code",
      style: "currency",
    }).format(100);

    expect(formatted).toContain("EGP");
  });
});
