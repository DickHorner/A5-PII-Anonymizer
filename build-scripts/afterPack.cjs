const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  try {
    const appOutDir = context.appOutDir;
    const resourcesPath = path.join(appOutDir, 'resources');
    const appPath = path.join(resourcesPath, 'app');
    
    console.log('\n========== AFTERPACK SCRIPT RUNNING ==========');
    console.log('Output dir:', appOutDir);
    console.log('Resources path:', resourcesPath);
    console.log('App path:', appPath);
    
    // Create directories
    fs.mkdirSync(appPath, { recursive: true });
    console.log('Created app directory');
    
    const projectRoot = context.packager.projectDir;
    console.log('Project root:', projectRoot);
    
    // Copy package.json first
    fs.copyFileSync(
      path.join(projectRoot, 'package.json'),
      path.join(appPath, 'package.json')
    );
    console.log('Copied package.json');
    
    // Copy all JS/HTML/CSS files
    const files = ['main.js', 'renderer.js', 'fileProcessor.js', 'index.html', 'styles.css', 'all.min.css'];
    for (const file of files) {
      const src = path.join(projectRoot, file);
      const dest = path.join(appPath, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${file}`);
      }
    }
    
    // Copy directories using a simpler method
    const cpSync = fs.cpSync || fs.copyFileSync; // Node 16+ has cpSync
    
    const dirs = ['assets', 'models', 'webfonts', 'node_modules'];
    for (const dir of dirs) {
      const src = path.join(projectRoot, dir);
      const dest = path.join(appPath, dir);
      if (fs.existsSync(src)) {
        console.log(`Copying ${dir}...`);
        if (fs.cpSync) {
          fs.cpSync(src, dest, { recursive: true });
        } else {
          // Fallback for older Node
          require('child_process').execSync(`xcopy "${src}" "${dest}" /E /I /Y /Q`, { stdio: 'inherit' });
        }
        console.log(`✓ Copied ${dir}`);
      }
    }
    
    console.log('========== AFTERPACK COMPLETE ==========\n');
  } catch (error) {
    console.error('========== AFTERPACK ERROR ==========');
    console.error(error);
    throw error;
  }
};
