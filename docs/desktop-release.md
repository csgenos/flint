# Flint Desktop Release

This repo is configured to build Flint as a Windows desktop app with a normal installer and Tauri auto-updates.

## What Users Install

- The release workflow builds NSIS and MSI installers.
- The NSIS installer is configured for a machine-wide install, so Flint appears under `C:\Program Files` and in the Start menu after the user approves the Windows admin prompt.
- Installed copies check GitHub Releases for `latest.json` and can install signed updates from inside the app.

## One-Time GitHub Setup

1. Open the repository on GitHub.
2. Go to `Settings` -> `Secrets and variables` -> `Actions`.
3. Add a repository secret named `TAURI_SIGNING_PRIVATE_KEY`.
4. Paste the full contents of your local private updater key file:
   `src-tauri/.updater/flint-updater.key`
5. If your updater key has a password, add another repository secret named `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.
6. Go to `Settings` -> `Actions` -> `General`.
7. Under `Workflow permissions`, select `Read and write permissions`.
8. Save.

The private updater key is intentionally ignored by git. Do not commit it, post it, or send it to anyone.

## Ship a New Version

1. Update these three version values to the same SemVer number:
   - `package.json`
   - `src-tauri/tauri.conf.json`
   - `src-tauri/Cargo.toml`
2. Commit and push the change to `main`.
3. Create and push a matching tag:

```powershell
git tag v0.2.1
git push origin v0.2.1
```

4. GitHub Actions runs `Release desktop app`.
5. When it passes, GitHub Releases contains the Windows installer, update signatures, and `latest.json`.
6. New users download the installer from Releases.
7. Existing installed users receive the update through Flint's updater.

## Local Build

Local desktop builds require Rust, Cargo, and Microsoft C++ Build Tools. After those are installed:

```powershell
pnpm install
pnpm tauri:build
```

Build output appears under `src-tauri/target/release/bundle/`.

## Important Production Note

Tauri updater signatures prove the update came from Flint's release key. Windows code signing is separate. Without a paid Windows code-signing certificate, Windows SmartScreen may still warn users the installer is from an unknown publisher.
