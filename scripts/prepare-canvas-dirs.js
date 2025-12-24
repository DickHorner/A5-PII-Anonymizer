// Ensure optional @napi-rs/canvas platform-specific directories exist to avoid electron-builder ENOENT.
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const nm = path.join(root, 'node_modules');
const dirs = [
  '@napi-rs/canvas-android-arm64',
  '@napi-rs/canvas-darwin-arm64',
  '@napi-rs/canvas-darwin-x64',
  '@napi-rs/canvas-linux-arm-gnueabihf',
  '@napi-rs/canvas-linux-arm64-gnu',
  '@napi-rs/canvas-linux-arm64-musl',
  '@napi-rs/canvas-linux-riscv64-gnu',
  '@napi-rs/canvas-linux-x64-gnu',
  '@napi-rs/canvas-linux-x64-musl',
  '@napi-rs/canvas-win32-x64-msvc',
];

for (const d of dirs) {
  const full = path.join(nm, d);
  try {
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      fs.writeFileSync(path.join(full, '.placeholder'), '');
      console.log(`Created: ${full}`);
    } else {
      // ensure directory, not a file
      if (!fs.statSync(full).isDirectory()) {
        fs.rmSync(full, { force: true });
        fs.mkdirSync(full, { recursive: true });
        fs.writeFileSync(path.join(full, '.placeholder'), '');
        console.log(`Recreated as dir: ${full}`);
      }
    }
  } catch (e) {
    console.warn(`Warning: could not ensure ${full}: ${e.message}`);
  }
}

console.log('Canvas platform directories prepared.');
