import crypto from "crypto";
import LogWriter from "./writer.js";

class PartitionManager {
  constructor(partitionCount = 3) {
    this.partitionCount = partitionCount;
    this.writers = new Map();
  }

  getPartition(key) {
    const hash = crypto.createHash("md5").update(String(key)).digest("hex");
    const hashInt = parseInt(hash.substring(0, 8), 16);
    return hashInt % this.partitionCount;
  }

  getWriter(key) {
    const partitionId = this.getPartition(key);
    if (!this.writers.has(partitionId)) {
      this.writers.set(partitionId, new LogWriter(partitionId));
    }
    return this.writers.get(partitionId);
  }

  async append(key, event) {
    const writer = this.getWriter(key);
    await writer.append(event);
  }
}

export default PartitionManager;
