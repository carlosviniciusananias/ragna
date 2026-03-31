import fs from "node:fs";
import path from "node:path";
import { ALLOWED_EXTENSIONS, IGNORED_FOLDERS } from "../../config/constants.js";
import type { SourceDocument } from "../../domain/chunking.js";

const allowedExt = ALLOWED_EXTENSIONS as readonly string[];
const ignoredFolders = IGNORED_FOLDERS as readonly string[];

export function walkDir(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!ignoredFolders.includes(file)) {
        walkDir(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (allowedExt.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

export function readFiles(filePaths: string[]): SourceDocument[] {
  return filePaths.map((filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");
    return {
      path: filePath,
      content,
      fileName: path.basename(filePath),
      extension: path.extname(filePath),
    };
  });
}
