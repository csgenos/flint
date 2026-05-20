import { GitBranch } from 'lucide-react';

export function Scenarios() {
  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <div className="bg-surface border border-border rounded-lg shadow-card p-12 text-center">
        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
          <GitBranch size={20} className="text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h2 className="text-base font-semibold text-foreground mb-2">Scenario Sandbox</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Create and compare financial futures — new job offer, relocation, home purchase, early
          retirement, and more.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-xs font-medium text-muted-foreground">
          Coming in Phase 2
        </div>
      </div>
    </div>
  );
}
