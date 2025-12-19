import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LogWriter {
  constructor(partitionId) {
    this.filePath = path.join(
      __dirname,
      `../../data/partition-${partitionId}.log`
    );
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    this.stream = fs.createWriteStream(this.filePath, { flags: "a" });
  }

  append(event) {
    const record = JSON.stringify(event) + "\n";
    return new Promise((resolve, reject) => {
      this.stream.write(record, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export default LogWriter;
