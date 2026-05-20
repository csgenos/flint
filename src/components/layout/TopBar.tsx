import { Bell, Search } from 'lucide-react';
import { formatFullDate } from '../../lib/utils/dates';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const today = formatFullDate(new Date());

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-surface border-b border-border">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground hidden sm:block">{today}</span>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Search size={15} />
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Bell size={15} />
        </button>
      </div>
    </header>
  );
}
