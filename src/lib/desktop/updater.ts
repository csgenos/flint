import { ask, message } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';

interface UpdateCheckOptions {
  silent?: boolean;
}

export function isDesktopRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function checkForAppUpdates({ silent = false }: UpdateCheckOptions = {}) {
  if (!isDesktopRuntime()) {
    if (!silent) {
      throw new Error('Desktop updates are only available in the installed Flint app.');
    }
    return false;
  }

  try {
    const update = await check();
    if (!update) {
      if (!silent) {
        await message('Flint is already up to date.', { title: 'Flint updates', kind: 'info' });
      }
      return false;
    }

    const confirmed = await ask(
      `Flint ${update.version} is available. Install it now and restart the app?`,
      { title: 'Flint update available', kind: 'info' },
    );

    if (!confirmed) return true;

    await update.downloadAndInstall();
    await message('The update was installed. Flint will restart now.', {
      title: 'Flint updates',
      kind: 'info',
    });
    await relaunch();
    return true;
  } catch (error) {
    if (!silent) {
      const reason = error instanceof Error ? error.message : 'The update check failed.';
      await message(reason, { title: 'Flint updates', kind: 'error' });
    }
    return false;
  }
}
