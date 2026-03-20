// ============================================================================
// Semantic Analyzer — Audits DOM for accessibility issues
// ============================================================================

import type { A11yIssue, A11yReport, A11ySeverity } from "./types";

interface Rule {
  id: string;
  severity: A11ySeverity;
  wcag: string;
  check: (root: Element) => A11yIssue[];
}

export class SemanticAnalyzer {
  private rules: Rule[] = [
    {
      id: "img-alt",
      severity: "critical",
      wcag: "1.1.1",
      check: (root) =>
        Array.from(root.querySelectorAll("img:not([alt])")).map((el) => ({
          id: "img-alt",
          severity: "critical" as const,
          element: this.getSelector(el),
          rule: "img-alt",
          message: "Image is missing alt attribute",
          wcagCriteria: "1.1.1",
          fix: 'Add an alt attribute describing the image, or alt="" for decorative images',
        })),
    },
    {
      id: "button-name",
      severity: "critical",
      wcag: "4.1.2",
      check: (root) =>
        Array.from(root.querySelectorAll("button"))
          .filter((btn) => !btn.textContent?.trim() && !btn.getAttribute("aria-label"))
          .map((el) => ({
            id: "button-name",
            severity: "critical" as const,
            element: this.getSelector(el),
            rule: "button-name",
            message: "Button has no accessible name",
            wcagCriteria: "4.1.2",
            fix: "Add text content or aria-label to the button",
          })),
    },
    {
      id: "heading-order",
      severity: "moderate",
      wcag: "1.3.1",
      check: (root) => {
        const issues: A11yIssue[] = [];
        const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
        let lastLevel = 0;
        for (const heading of headings) {
          const level = parseInt(heading.tagName[1]!);
          if (lastLevel > 0 && level > lastLevel + 1) {
            issues.push({
              id: "heading-order",
              severity: "moderate",
              element: this.getSelector(heading),
              rule: "heading-order",
              message: `Heading level skipped from h${lastLevel} to h${level}`,
              wcagCriteria: "1.3.1",
              fix: `Use h${lastLevel + 1} instead of h${level}`,
            });
          }
          lastLevel = level;
        }
        return issues;
      },
    },
    {
      id: "link-name",
      severity: "serious",
      wcag: "2.4.4",
      check: (root) =>
        Array.from(root.querySelectorAll("a"))
          .filter((a) => !a.textContent?.trim() && !a.getAttribute("aria-label"))
          .map((el) => ({
            id: "link-name",
            severity: "serious" as const,
            element: this.getSelector(el),
            rule: "link-name",
            message: "Link has no accessible name",
            wcagCriteria: "2.4.4",
            fix: "Add text content or aria-label to the link",
          })),
    },
    {
      id: "form-label",
      severity: "critical",
      wcag: "1.3.1",
      check: (root) =>
        Array.from(root.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button])"))
          .filter(
            (input) =>
              !input.getAttribute("aria-label") &&
              !input.getAttribute("aria-labelledby") &&
              !input.id ||
              (input.id && !root.querySelector(`label[for="${CSS.escape(input.id)}"]`)),
          )
          .map((el) => ({
            id: "form-label",
            severity: "critical" as const,
            element: this.getSelector(el),
            rule: "form-label",
            message: "Form input is missing an associated label",
            wcagCriteria: "1.3.1",
            fix: "Add a <label> with for attribute, or aria-label/aria-labelledby",
          })),
    },
    {
      id: "landmark-main",
      severity: "moderate",
      wcag: "1.3.1",
      check: (root) => {
        const hasMain = root.querySelector("main, [role=main]");
        if (!hasMain) {
          return [
            {
              id: "landmark-main",
              severity: "moderate" as const,
              element: "document",
              rule: "landmark-main",
              message: "Page is missing a main landmark",
              wcagCriteria: "1.3.1",
              fix: "Wrap primary content in a <main> element",
            },
          ];
        }
        return [];
      },
    },
    {
      id: "color-contrast",
      severity: "serious",
      wcag: "1.4.3",
      check: () => {
        // Color contrast requires computed styles; handled by ContrastChecker
        return [];
      },
    },
  ];

  /** Run full accessibility audit on an element tree */
  analyze(root: Element = document.documentElement): A11yReport {
    const issues: A11yIssue[] = [];

    for (const rule of this.rules) {
      issues.push(...rule.check(root));
    }

    const summary = { critical: 0, serious: 0, moderate: 0, minor: 0 };
    for (const issue of issues) {
      summary[issue.severity]++;
    }

    const maxPenalty = issues.length * 10;
    const penalty = issues.reduce((sum, i) => {
      const weights: Record<A11ySeverity, number> = {
        critical: 10,
        serious: 7,
        moderate: 4,
        minor: 1,
      };
      return sum + weights[i.severity];
    }, 0);

    const score = maxPenalty === 0 ? 100 : Math.max(0, 100 - Math.round((penalty / maxPenalty) * 100));

    return {
      timestamp: Date.now(),
      url: typeof window !== "undefined" ? window.location.href : "",
      issues,
      score,
      summary,
    };
  }

  private getSelector(el: Element): string {
    if (el.id) return `#${el.id}`;
    const tag = el.tagName.toLowerCase();
    const cls = el.className
      ? "." + String(el.className).split(/\s+/).filter(Boolean).join(".")
      : "";
    return `${tag}${cls}`;
  }
}
