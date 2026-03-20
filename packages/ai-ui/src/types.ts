// ============================================================================
// AI UI Types
// ============================================================================

export interface AIUIConfig {
  /** AI provider endpoint */
  endpoint: string;
  /** API key for the AI service */
  apiKey: string;
  /** Model to use */
  model?: string;
  /** Design system tokens to inform generation */
  designTokens?: Record<string, string>;
  /** Target framework for generated code */
  targetFramework?: "react" | "vue" | "svelte" | "html";
}

export interface UIPrompt {
  /** Natural language description of the UI to generate */
  description: string;
  /** Component type hint */
  componentType?: "page" | "section" | "component" | "widget";
  /** Style preferences */
  style?: "minimal" | "modern" | "playful" | "corporate";
  /** Additional context */
  context?: string;
}

export interface GeneratedComponent {
  id: string;
  name: string;
  code: string;
  framework: string;
  preview?: string;
  tokens: string[];
  createdAt: number;
}

export interface LayoutSuggestion {
  id: string;
  name: string;
  description: string;
  gridTemplate: string;
  areas: string[];
  score: number;
}

export interface GenerationResult {
  components: GeneratedComponent[];
  layout?: LayoutSuggestion;
  tokenUsage: number;
  generationTime: number;
}
