import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { getJurisdictionLabel, taxJurisdictions } from '../../data/taxes/jurisdictions';
import { cn } from '../../lib/utils/cn';

interface TaxResidencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

function groupByLetter(items: typeof taxJurisdictions) {
  return items.reduce<Record<string, typeof taxJurisdictions>>((groups, item) => {
    const letter = item.name.charAt(0).toUpperCase();
    groups[letter] = groups[letter] ?? [];
    groups[letter].push(item);
    return groups;
  }, {});
}

export function TaxResidencySelect({
  value,
  onValueChange,
  label = 'Tax Residence',
  placeholder = 'Search states and European countries...',
}: TaxResidencySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return taxJurisdictions;

    return taxJurisdictions.filter((item) => {
      const haystack = [
        item.name,
        item.code,
        item.countryName,
        item.type === 'us_state' ? 'United States' : 'Europe',
      ].join(' ').toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  const usStates = filtered.filter((item) => item.type === 'us_state');
  const europeanCountries = filtered.filter((item) => item.type === 'europe_country');
  const usGroups = groupByLetter(usStates);
  const europeGroups = groupByLetter(europeanCountries);
  const usLetters = Object.keys(usGroups).sort();
  const europeLetters = Object.keys(europeGroups).sort();

  const renderSection = (
    title: string,
    letters: string[],
    groups: Record<string, typeof taxJurisdictions>,
  ) => {
    if (letters.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="px-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
        </div>
        {letters.map((letter) => (
          <div key={`${title}-${letter}`} className="space-y-1">
            <p className="px-1 text-[11px] font-medium uppercase text-muted-foreground">
              {letter}
            </p>
            <div className="space-y-1">
              {groups[letter].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    onValueChange(item.code);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={cn(
                    'w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                    value === item.code
                      ? 'bg-accent text-foreground'
                      : 'text-foreground hover:bg-accent',
                  )}
                >
                  <div className="text-left">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type === 'us_state' ? 'US State' : 'European Country'}
                    </p>
                  </div>
                  {value === item.code && <Check size={14} className="text-foreground" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-1" ref={containerRef}>
      <label className="block text-xs font-medium text-foreground">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-left text-sm text-foreground transition-shadow focus:outline-none focus:ring-1 focus:ring-brand"
        >
          <span>{value ? getJurisdictionLabel(value) : 'Select a tax residence'}</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-card-hover">
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="max-h-80 space-y-4 overflow-y-auto p-3">
              {renderSection('United States', usLetters, usGroups)}
              {renderSection('Europe', europeLetters, europeGroups)}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No matches found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
