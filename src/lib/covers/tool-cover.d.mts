export type ToolCoverInput = {
  title: string;
  slug: string;
  /** category slug 或中文名,均可;未知值回落默认母题 */
  category: string;
};

export type ToolCoverOutput = {
  coverSvg: string;
  iconSvg: string;
};

export function generateToolCover(input: ToolCoverInput): ToolCoverOutput;
export function getToolInitials(title: string): string;
