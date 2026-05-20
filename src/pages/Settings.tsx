import { useSettingsStore } from '../store/useSettingsStore';

export function Settings() {
  const { currency, setCurrency } = useSettingsStore();

  return (
    <div className="p-6 space-y-4 max-w-screen-md mx-auto">
      <div className="bg-surface border border-border rounded-lg shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">General</h2>
        </div>
        <div className="px-5 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-foreground">Currency</p>
            <p className="text-xs text-muted-foreground">Display currency for all amounts</p>
          </div>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-md bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="CAD">CAD — Canadian Dollar</option>
            <option value="AUD">AUD — Australian Dollar</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Data</h2>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground">
            All financial data is stored locally on your device. No data is sent to any server.
          </p>
          <button className="mt-3 px-3 py-1.5 text-xs font-medium border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Export Data (JSON)
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-card">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">About</h2>
        </div>
        <div className="px-5 py-4 space-y-1">
          <p className="text-sm font-medium text-foreground">Finch — Personal Finance</p>
          <p className="text-xs text-muted-foreground">Version 0.1.0</p>
          <p className="text-xs text-muted-foreground mt-2">
            Built with Tauri, React 18, TypeScript, Tailwind CSS, and Recharts.
          </p>
        </div>
      </div>
    </div>
  );
}
