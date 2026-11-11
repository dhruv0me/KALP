import { IconArrowUpRight, IconPlant2 } from "@tabler/icons-react";

interface EmptyStateProps {
  message: string;
  description?: string | undefined;
  actionLabel?: string | undefined;
  onAction?: (() => void) | undefined;
}

export function EmptyState({
  message,
  description = "Verified campaigns appear here as soon as real records are published.",
  actionLabel = "Explore all campaigns",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-icon" aria-hidden="true">
        <IconPlant2 size={32} />
      </div>
      <h2>{message}</h2>
      <p>{description}</p>
      {onAction && (
        <button type="button" onClick={onAction} className="text-link">
          {actionLabel} <IconArrowUpRight size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

