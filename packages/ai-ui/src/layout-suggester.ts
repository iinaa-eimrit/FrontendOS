// ============================================================================
// Layout Suggester — Suggests optimal layouts based on content
// ============================================================================

import type { LayoutSuggestion } from "./types";

const LAYOUT_TEMPLATES: LayoutSuggestion[] = [
  {
    id: "dashboard-grid",
    name: "Dashboard Grid",
    description: "4-column responsive grid with sidebar",
    gridTemplate: '"sidebar header header header" "sidebar main main aside"',
    areas: ["sidebar", "header", "main", "aside"],
    score: 0,
  },
  {
    id: "content-center",
    name: "Content Center",
    description: "Centered content with max-width container",
    gridTemplate: '"header" "main" "footer"',
    areas: ["header", "main", "footer"],
    score: 0,
  },
  {
    id: "split-view",
    name: "Split View",
    description: "Two-panel split layout",
    gridTemplate: '"left right"',
    areas: ["left", "right"],
    score: 0,
  },
  {
    id: "hero-cards",
    name: "Hero + Cards",
    description: "Hero section followed by card grid",
    gridTemplate: '"hero hero hero" "card1 card2 card3"',
    areas: ["hero", "card1", "card2", "card3"],
    score: 0,
  },
];

export class LayoutSuggester {
  /** Suggest a layout based on content description */
  suggest(description: string, componentCount: number): LayoutSuggestion {
    const scored = LAYOUT_TEMPLATES.map((layout) => ({
      ...layout,
      score: this.scoreLayout(layout, description, componentCount),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0]!;
  }

  /** Get all available layout templates */
  getTemplates(): LayoutSuggestion[] {
    return [...LAYOUT_TEMPLATES];
  }

  private scoreLayout(
    layout: LayoutSuggestion,
    description: string,
    componentCount: number,
  ): number {
    let score = 0;
    const desc = description.toLowerCase();

    if (desc.includes("dashboard") && layout.id === "dashboard-grid") score += 10;
    if (desc.includes("content") && layout.id === "content-center") score += 10;
    if (desc.includes("split") && layout.id === "split-view") score += 10;
    if (desc.includes("hero") && layout.id === "hero-cards") score += 10;

    // Prefer layouts with area count close to component count
    const areaDiff = Math.abs(layout.areas.length - componentCount);
    score -= areaDiff * 2;

    return score;
  }
}
