import * as fs from "fs";
import * as path from "path";

function scanDir(dir: string, depth = 0) {
  if (depth > 6) return;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (file === "node_modules" || file === ".git" || file === "dist" || file === ".next") {
        continue;
      }
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath, depth + 1);
        } else {
          const ext = path.extname(file).toLowerCase();
          if ([".mp4", ".mov", ".webm", ".avi", ".mkv", ".png", ".jpg", ".jpeg"].includes(ext) || stat.size > 100 * 1024) {
            console.log(`FOUND FILE: ${fullPath} (${stat.size} bytes, modified: ${stat.mtime})`);
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

console.log("Scanning workspace root...");
scanDir(".");
console.log("Scanning /tmp...");
scanDir("/tmp");
