import type { StorageErrorInfo } from '../lib/types';

interface StorageAlertProps {
  error: StorageErrorInfo;
  onRetry(): void;
}

export function StorageAlert({ error, onRetry }: StorageAlertProps) {
  return (
    <section className="alert" role="alert" aria-live="assertive">
      <p>{error.message}</p>
      <div className="button-row">
        <button className="button button-secondary" type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    </section>
  );
}
