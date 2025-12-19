import LogReader from "../log/reader.js";

class Consumer {
  constructor(partitionId) {
    this.partitionId = partitionId;
    this.reader = new LogReader(partitionId);
  }

  async poll(offset, maxEvents = 10) {
    return this.reader.readFromOffset(offset, maxEvents);
  }
}

export default Consumer;
