import LogReader from "./log/reader.js";

(async () => {
  const reader = new LogReader(0);
  const result = await reader.readFromOffset(3, 5);
  console.log(result);
})();
