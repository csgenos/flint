import { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, FileText, Database, RotateCcw } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import {
  parseCsv,
  autoDetectColumns,
  previewImport,
  buildTransactions,
  CsvColumnMap,
} from '../lib/finance/csvImport';
import { ImportResult } from '../types/planning';
import { formatCurrency } from '../lib/utils/format';
import { toast } from '../lib/utils/toast';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { cn } from '../lib/utils/cn';

function downloadFile(content: string, filename: string, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ImportExport() {
  const store = useFinanceStore();
  const { transactions, accounts, categories, addTransaction, importFullBackup } = store;
  const fileRef = useRef<HTMLInputElement>(null);
  const backupRef = useRef<HTMLInputElement>(null);

  const [csvRows, setCsvRows] = useState<Record<string, string>[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<CsvColumnMap>({ date: '', description: '', amount: '' });
  const [result, setResult] = useState<ImportResult | null>(null);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id ?? '');
  const [selectedCategory, setSelectedCategory] = useState(
    categories.find(c => c.type === 'expense')?.id ?? ''
  );
  const [importing, setImporting] = useState(false);
  const [restoreData, setRestoreData] = useState<unknown>(null);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);

  const accountOptions = accounts.map(a => ({ value: a.id, label: a.name }));
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const rows = parseCsv(text);
      if (rows.length === 0) { toast('CSV appears to be empty or malformed', 'error'); return; }
      const hdrs = Object.keys(rows[0]);
      setHeaders(hdrs);
      setCsvRows(rows);
      setResult(null);
      const detected = autoDetectColumns(hdrs);
      setColumnMap({ date: detected.date ?? '', description: detected.description ?? '', amount: detected.amount ?? '' });
    };
    reader.readAsText(file);
  };

  const handlePreview = () => {
    if (!csvRows) return;
    setResult(previewImport(csvRows, columnMap, selectedCategory, selectedAccount));
  };

  const handleImport = () => {
    if (!result) return;
    setImporting(true);
    buildTransactions(result.preview, selectedCategory, selectedAccount).forEach(t => addTransaction(t));
    toast(`Imported ${result.success} transactions`);
    setCsvRows(null); setResult(null); setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const exportTransactions = () => {
    const rows = [
      ['Date', 'Description', 'Amount', 'Type', 'Category', 'Account', 'Notes', 'Tags'],
      ...transactions.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount.toString(),
        t.type,
        categories.find(c => c.id === t.categoryId)?.name ?? '',
        accounts.find(a => a.id === t.accountId)?.name ?? '',
        `"${(t.notes ?? '').replace(/"/g, '""')}"`,
        `"${(t.tags ?? []).join(', ')}"`,
      ]),
    ];
    downloadFile(rows.map(r => r.join(',')).join('\n'), `flint-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    toast('Transactions exported');
  };

  const exportFullBackup = () => {
    const state = {
      accounts: store.accounts,
      transactions: store.transactions,
      budgets: store.budgets,
      categories: store.categories,
      scenarios: store.scenarios,
      assumptions: store.assumptions,
      paychecks: store.paychecks,
      allocations: store.allocations,
      recurringExpenses: store.recurringExpenses,
      goals: store.goals,
      netWorthSnapshots: store.netWorthSnapshots,
    };
    downloadFile(JSON.stringify(state, null, 2), `flint-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    toast('Full backup exported');
  };

  const handleBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        setRestoreData(JSON.parse(ev.target?.result as string));
        setRestoreConfirmOpen(true);
      } catch {
        toast('Invalid backup file — could not parse JSON', 'error');
      }
    };
    reader.readAsText(file);
    if (backupRef.current) backupRef.current.value = '';
  };

  const headerOptions = headers.map(h => ({ value: h, label: h }));

  return (
    <div className="p-6 space-y-5 max-w-screen-md mx-auto">
      {/* Full Backup & Restore */}
      <div className="bg-surface border border-border rounded-lg shadow-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Full Backup</h2>
        <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
          <div className="flex items-center gap-3">
            <Database size={15} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Complete Data Backup</p>
              <p className="text-xs text-muted-foreground">All accounts, transactions, budgets, goals &amp; settings</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={exportFullBackup}>
            <Download size={13} />Export
          </Button>
        </div>
        <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
          <div className="flex items-center gap-3">
            <RotateCcw size={15} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Restore from Backup</p>
              <p className="text-xs text-muted-foreground">Overwrites all current data with the backup file</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => backupRef.current?.click()}>
            <Upload size={13} />Restore
          </Button>
          <input ref={backupRef} type="file" accept=".json,application/json" className="hidden" onChange={handleBackupFile} />
        </div>
      </div>

      {/* CSV Export */}
      <div className="bg-surface border border-border rounded-lg shadow-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Export Data</h2>
        <div className="flex items-center justify-between py-3 border border-border rounded-lg px-4">
          <div className="flex items-center gap-3">
            <FileText size={15} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Transactions CSV</p>
              <p className="text-xs text-muted-foreground">{transactions.length} transactions</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={exportTransactions}>
            <Download size={13} />Export
          </Button>
        </div>
      </div>

      {/* CSV Import */}
      <div className="bg-surface border border-border rounded-lg shadow-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Import Transactions</h2>
        <label
          className={cn(
            'flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 px-4 cursor-pointer transition-colors',
            csvRows ? 'border-brand bg-indigo-50/30' : 'border-border hover:border-muted-foreground hover:bg-muted/30'
          )}
        >
          <Upload size={20} className={csvRows ? 'text-brand' : 'text-muted-foreground'} />
          <p className="text-sm font-medium text-foreground mt-2">
            {csvRows ? `${csvRows.length} rows loaded` : 'Drop a CSV file here'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{csvRows ? 'Click to replace file' : 'or click to browse'}</p>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
        </label>

        {csvRows && headers.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Map Columns</p>
            <div className="grid grid-cols-3 gap-3">
              <Select label="Date column" value={columnMap.date} onValueChange={v => setColumnMap(m => ({ ...m, date: v }))} options={headerOptions} />
              <Select label="Description column" value={columnMap.description} onValueChange={v => setColumnMap(m => ({ ...m, description: v }))} options={headerOptions} />
              <Select label="Amount column" value={columnMap.amount} onValueChange={v => setColumnMap(m => ({ ...m, amount: v }))} options={headerOptions} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Default Account" value={selectedAccount} onValueChange={setSelectedAccount} options={accountOptions} />
              <Select label="Default Category" value={selectedCategory} onValueChange={setSelectedCategory} options={categoryOptions} />
            </div>
            <Button size="sm" variant="secondary" onClick={handlePreview}>Preview Import</Button>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-positive"><CheckCircle size={12} />{result.success} ready</span>
              {result.skipped > 0 && <span className="text-muted-foreground">{result.skipped} skipped</span>}
              {result.errors.length > 0 && <span className="flex items-center gap-1 text-negative"><AlertCircle size={12} />{result.errors.length} errors</span>}
            </div>
            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                {result.errors.slice(0, 3).map((err, i) => (
                  <p key={i} className="text-xs text-red-700">Row {err.row}: {err.message}</p>
                ))}
                {result.errors.length > 3 && <p className="text-xs text-red-600">+{result.errors.length - 3} more errors</p>}
              </div>
            )}
            {result.preview.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Date</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Description</th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.preview.slice(0, 8).map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{row.date}</td>
                        <td className="px-3 py-2 text-xs text-foreground truncate max-w-[200px]">{row.description}</td>
                        <td className={cn('px-3 py-2 text-xs font-medium text-right tabular-nums', row.type === 'income' ? 'text-positive' : 'text-foreground')}>
                          {row.type === 'income' ? '+' : '−'}{formatCurrency(row.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.preview.length > 8 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border">+{result.preview.length - 8} more rows</div>
                )}
              </div>
            )}
            <Button onClick={handleImport} loading={importing} disabled={result.success === 0}>
              Import {result.success} Transactions
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={restoreConfirmOpen}
        onOpenChange={open => { if (!open) { setRestoreConfirmOpen(false); setRestoreData(null); } }}
        title="Restore from Backup"
        description="This will overwrite ALL current data with the backup file. This action cannot be undone."
        confirmLabel="Restore"
        destructive
        onConfirm={() => {
          importFullBackup(restoreData);
          setRestoreConfirmOpen(false);
          setRestoreData(null);
          toast('Data restored from backup');
        }}
      />
    </div>
  );
}
