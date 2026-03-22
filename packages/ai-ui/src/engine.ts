// ============================================================================
// AI UI Engine — Core generative UI orchestrator
// ============================================================================

import type { AIUIConfig, UIPrompt, GenerationResult } from "./types";
import { ComponentGenerator } from "./generator";
import { LayoutSuggester } from "./layout-suggester";

export class AIUIEngine {
  private readonly config: AIUIConfig;
  private readonly generator: ComponentGenerator;
  private readonly layoutSuggester: LayoutSuggester;

  constructor(config: AIUIConfig) {
    this.config = config;
    this.generator = new ComponentGenerator(config);
    this.layoutSuggester = new LayoutSuggester();
  }

  /** Generate UI from a natural language prompt */
  async generate(prompt: UIPrompt): Promise<GenerationResult> {
    const startTime = performance.now();

    const components = await this.generator.generate(prompt);
    const layout =
      prompt.componentType === "page"
        ? this.layoutSuggester.suggest(prompt.description, components.length)
        : undefined;

    return {
      components,
      layout,
      tokenUsage: 0, // Would be populated from actual API response
      generationTime: performance.now() - startTime,
    };
  }

  /** Generate a variation of an existing component */
  async generateVariation(componentCode: string, instruction: string): Promise<GenerationResult> {
    const startTime = performance.now();

    const components = await this.generator.generate({
      description: instruction,
      context: `Modify this existing component:\n\n${componentCode}`,
    });

    return {
      components,
      tokenUsage: 0,
      generationTime: performance.now() - startTime,
    };
  }
}
