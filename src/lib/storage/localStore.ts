import type { StateStorage } from 'zustand/middleware';

// Abstraction over localStorage/Zustand so SQLite can be swapped in later.
// All persistence calls go through these functions so UI components never touch storage directly.

export interface StorageAdapter<T> {
  getAll: () => T[];
  getById: (id: string) => T | undefined;
  save: (item: T) => void;
  update: (id: string, updates: Partial<T>) => void;
  remove: (id: string) => void;
}

// For now this is a thin pass-through; the actual state lives in Zustand.
// When SQLite is added, swap the implementation here without touching any UI.
export function createLocalAdapter<T extends { id: string }>(
  getItems: () => T[],
  setItems: (items: T[]) => void
): StorageAdapter<T> {
  return {
    getAll: getItems,
    getById: (id) => getItems().find(item => item.id === id),
    save: (item) => setItems([...getItems(), item]),
    update: (id, updates) => setItems(getItems().map(i => i.id === id ? { ...i, ...updates } : i)),
    remove: (id) => setItems(getItems().filter(i => i.id !== id)),
  };
}

export function createLegacyStateStorage(legacyKeys: string[] = []): StateStorage {
  const getStorage = () => {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  };

  return {
    getItem: (name) => {
      const storage = getStorage();
      if (!storage) return null;

      const currentValue = storage.getItem(name);
      if (currentValue !== null) return currentValue;

      for (const legacyKey of legacyKeys) {
        const legacyValue = storage.getItem(legacyKey);
        if (legacyValue !== null) return legacyValue;
      }

      return null;
    },
    setItem: (name, value) => {
      const storage = getStorage();
      storage?.setItem(name, value);
    },
    removeItem: (name) => {
      const storage = getStorage();
      if (!storage) return;

      storage.removeItem(name);
      for (const legacyKey of legacyKeys) {
        storage.removeItem(legacyKey);
      }
    },
  };
}

export function clearStateStorageKeys(keys: string[]): void {
  if (typeof window === 'undefined') return;

  for (const key of keys) {
    window.localStorage.removeItem(key);
  }
}

export function generateId(): string {
  return crypto.randomUUID();
}
