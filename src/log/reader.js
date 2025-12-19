import fs from "fs";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LogReader {
  constructor(partitionID) {
    this.filePath = path.join(
      __dirname,
      `../../data/partition-${partitionID}.log`
    );
  }

  async readFromOffset(offset, maxLength = 10) {
    const stream = fs.createReadStream(this.filePath);
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let currentOffset = 0;
    let event = [];

    for await (const line of rl) {
      if (currentOffset >= offset) {
        event.push(JSON.parse(line));
      }
      currentOffset++;
      if (event.length >= maxLength) {
        break;
      }
    }
    rl.close();
    stream.close();

    return {
      event,
      nextOffset: currentOffset,
    };
  }
}

export default LogReader;
