import type { TaskPriority } from '../types/task';
import { CosmicTokens } from '../theme/cosmicTokens';

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: CosmicTokens.colors.semantic.error,
  important: CosmicTokens.colors.semantic.warning,
  normal: CosmicTokens.colors.semantic.primary,
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: 'URGENT',
  important: 'IMPORTANT',
  normal: 'STABLE',
};
