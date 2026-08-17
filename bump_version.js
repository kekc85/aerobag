// Автоматический инкремент сборки и версионирования AeroBag Predictor
const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, 'version.json');
const appJsPath = path.join(__dirname, 'app.js');
const indexHtmlPath = path.join(__dirname, 'index.html');

try {
    let versionData = { version: "12.0.0", build: 74, lastBuildTime: "" };
    if (fs.existsSync(versionFilePath)) {
        versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf-8'));
    }

    versionData.build = (parseInt(versionData.build, 10) || 0) + 1;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateFormatted = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
    const timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    versionData.lastBuildTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${timeFormatted}`;

    fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2), 'utf-8');

    const vStr = `v${versionData.version}`;
    const buildStr = `${versionData.build}`;

    // Обновление app.js
    if (fs.existsSync(appJsPath)) {
        let appJs = fs.readFileSync(appJsPath, 'utf-8');
        appJs = appJs.replace(/const APP_VERSION = '[^']+';/, `const APP_VERSION = '${vStr}';`);
        if (appJs.includes('const APP_BUILD =')) {
            appJs = appJs.replace(/const APP_BUILD = '[^']+';/, `const APP_BUILD = '${buildStr}';`);
            appJs = appJs.replace(/const APP_BUILD_DATE = '[^']+';/, `const APP_BUILD_DATE = '${dateFormatted}';`);
        } else {
            appJs = appJs.replace(`const APP_VERSION = '${vStr}';`, `const APP_VERSION = '${vStr}';\nconst APP_BUILD = '${buildStr}';\nconst APP_BUILD_DATE = '${dateFormatted}';`);
        }
        fs.writeFileSync(appJsPath, appJs, 'utf-8');
    }

    // Обновление index.html
    if (fs.existsSync(indexHtmlPath)) {
        let html = fs.readFileSync(indexHtmlPath, 'utf-8');
        html = html.replace(/<span id="app-version-tag">[^<]*<\/span>/, `<span id="app-version-tag">${vStr}</span>`);
        html = html.replace(/<span id="app-build-tag">[^<]*<\/span>/, `<span id="app-build-tag">${buildStr}</span>`);
        html = html.replace(/<span id="app-build-date">[^<]*<\/span>/, `<span id="app-build-date">${dateFormatted}</span>`);
        html = html.replace(/src="app\.js\?v=[^"]*"/, `src="app.js?v=${vStr}.${buildStr}"`);
        fs.writeFileSync(indexHtmlPath, html, 'utf-8');
    }

    console.log(`[Version Bump] Successfully updated to ${vStr} (Build #${buildStr} • ${dateFormatted})`);
} catch (err) {
    console.error('[Version Bump Error]:', err.message);
}
