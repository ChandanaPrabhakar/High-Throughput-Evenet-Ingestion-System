import LogWriter from "./log/writer.js";

(async () => {
  const writer = new LogWriter(0);
  for (let i = 0; i < 10; i++) {
    await writer.append({ id: i, value: `event-${i}` });
  }
})();
