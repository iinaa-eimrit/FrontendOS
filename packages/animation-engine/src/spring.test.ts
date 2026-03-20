import { describe, it, expect } from "vitest";
import { SpringEngine } from "@frontendos/animation-engine";

describe("SpringEngine", () => {
  it("should have default presets", () => {
    expect(SpringEngine.presets.gentle).toBeInstanceOf(SpringEngine);
    expect(SpringEngine.presets.wobbly).toBeInstanceOf(SpringEngine);
    expect(SpringEngine.presets.stiff).toBeInstanceOf(SpringEngine);
    expect(SpringEngine.presets.slow).toBeInstanceOf(SpringEngine);
    expect(SpringEngine.presets.molasses).toBeInstanceOf(SpringEngine);
  });

  it("should create instance with custom config", () => {
    const spring = new SpringEngine({
      mass: 2,
      stiffness: 200,
      damping: 15,
    });
    expect(spring).toBeInstanceOf(SpringEngine);
  });

  it("should return a cancel function from animate", () => {
    const spring = new SpringEngine();
    const cancel = spring.animate(() => {});
    expect(typeof cancel).toBe("function");
    cancel();
  });
});
