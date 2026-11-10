/**
 * Gemini Web Canvas / Flow Interactive Workspace Engine
 * 100% Pure Bun v1.4.4 - Zero External Dependencies
 * Powers real-time GenUI component assembly and Nano Banana asset slots.
 */

export interface CanvasComponent {
  id: string;
  name: string;
  category: "layout" | "navigation" | "inputs" | "surfaces" | "media";
  props: Record<string, any>;
  children?: CanvasComponent[];
}

export interface NanoBananaSlot {
  id: string;
  prompt: string;
  model: "gemini-2.5-flash-image" | "gemini-omni";
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
  resolution: "512x512" | "1024x1024" | "1920x1080";
  targetToken: string;
}

export interface CanvasWorkspace {
  id: string;
  title: string;
  components: CanvasComponent[];
  assetSlots: NanoBananaSlot[];
  timestamp: number;
}

/**
 * Create a default Gemini Web Canvas workspace
 */
export function createDefaultCanvasWorkspace(
  title = "Gemini GenUI Workspace",
): CanvasWorkspace {
  return {
    id: `canvas-${Date.now()}`,
    title,
    timestamp: Date.now(),
    assetSlots: [
      {
        id: "slot-hero",
        prompt:
          "Futuristic Google Design studio with volumetric neon lighting and clean geometric architecture",
        model: "gemini-2.5-flash-image",
        aspectRatio: "16:9",
        resolution: "1920x1080",
        targetToken: "--md-sys-color-primary-container",
      },
    ],
    components: [
      {
        id: "comp-appbar",
        name: "TopAppBar",
        category: "navigation",
        props: {
          title: "Gemini Canvas Live",
          headlineScale: "title-large",
          elevation: "level0",
        },
      },
      {
        id: "comp-card-grid",
        name: "FlowGrid",
        category: "layout",
        props: { columns: 3, gutter: 16 },
        children: [
          {
            id: "card-1",
            name: "ElevatedCard",
            category: "surfaces",
            props: {
              title: "Design System Intelligence",
              description:
                "Real-time HCT color analysis and multi-surface token synchronization.",
            },
          },
          {
            id: "card-2",
            name: "FilledCard",
            category: "surfaces",
            props: {
              title: "Material 3 Expressive",
              description:
                "Fluid motion curves and adaptive compact-to-expanded breakpoints.",
            },
          },
          {
            id: "card-3",
            name: "OutlinedCard",
            category: "surfaces",
            props: {
              title: "Sovereign Upstream",
              description:
                "Zero external npm dependencies, 100% pure Bun v1.4.4 full Rust.",
            },
          },
        ],
      },
    ],
  };
}
