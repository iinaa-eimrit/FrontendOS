// ============================================================================
// Component Generator — AI-powered component code generation
// ============================================================================

import type { AIUIConfig, UIPrompt, GeneratedComponent } from "./types";

export class ComponentGenerator {
  private readonly config: AIUIConfig;

  constructor(config: AIUIConfig) {
    this.config = config;
  }

  /** Generate components from a UI prompt */
  async generate(prompt: UIPrompt): Promise<GeneratedComponent[]> {
    const framework = this.config.targetFramework ?? "react";
    const systemPrompt = this.buildSystemPrompt(framework);
    const userPrompt = this.buildUserPrompt(prompt);

    // In production, this would call the AI API
    // For now, return a template component
    const component: GeneratedComponent = {
      id: `gen-${Date.now()}`,
      name: this.inferComponentName(prompt.description),
      code: this.generatePlaceholder(framework, prompt),
      framework,
      tokens: this.extractTokenRefs(prompt.description),
      createdAt: Date.now(),
    };

    return [component];
  }

  private buildSystemPrompt(framework: string): string {
    const tokens = this.config.designTokens
      ? `\nDesign tokens available: ${JSON.stringify(this.config.designTokens)}`
      : "";

    return `You are an expert ${framework} UI developer. Generate clean, accessible, production-ready component code using the FrontendOS design system.${tokens}`;
  }

  private buildUserPrompt(prompt: UIPrompt): string {
    let text = prompt.description;
    if (prompt.componentType) text += `\nComponent type: ${prompt.componentType}`;
    if (prompt.style) text += `\nStyle: ${prompt.style}`;
    if (prompt.context) text += `\nContext: ${prompt.context}`;
    return text;
  }

  private inferComponentName(description: string): string {
    const words = description.split(" ").slice(0, 3);
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
  }

  private generatePlaceholder(framework: string, prompt: UIPrompt): string {
    if (framework === "react") {
      return `export function GeneratedComponent() {\n  return (\n    <div className="p-4">\n      {/* AI Generated: ${prompt.description} */}\n      <h2>Generated Component</h2>\n    </div>\n  );\n}`;
    }
    return `<!-- AI Generated: ${prompt.description} -->`;
  }

  private extractTokenRefs(description: string): string[] {
    const tokenKeywords = ["color", "spacing", "font", "radius", "shadow", "border"];
    return tokenKeywords.filter((kw) => description.toLowerCase().includes(kw));
  }
}
