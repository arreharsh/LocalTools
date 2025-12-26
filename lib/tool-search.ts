import { toolCategories, Tool } from "./tools-data";

export const ALL_TOOLS: Tool[] = toolCategories.flatMap(
  (category) => category.tools
);
