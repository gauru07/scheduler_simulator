// Color palette for processes and UI elements - CPU/Processor theme
export const processColors = [
  '#00d4ff', // Cyan Blue (Primary)
  '#7c3aed', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#10b981', // Green
  '#f97316', // Orange
  '#ec4899', // Pink
  '#06b6d4', // Sky Blue
  '#84cc16', // Lime
  '#f43f5e', // Rose
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
];

export const theme = {
  colors: {
    primary: '#00d4ff',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceHover: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    border: '#333333',
  }
};

export function getProcessColor(index: number): string {
  return processColors[index % processColors.length];
}

export function getProcessColorByID(processId: string): string {
  // Generate consistent color based on process ID
  let hash = 0;
  for (let i = 0; i < processId.length; i++) {
    hash = processId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return processColors[Math.abs(hash) % processColors.length];
}

