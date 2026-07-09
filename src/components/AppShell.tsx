import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="app-shell" aria-labelledby="app-title">
      <header className="app-header">
        <h1 id="app-title" className="app-title">
          Daily Done
        </h1>
        <p className="app-subtitle">Plan the day. Verify what you actually did.</p>
      </header>
      <div className="stack">{children}</div>
    </main>
  );
}
