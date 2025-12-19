import PartitionManager from "./log/partition.js";

(async () => {
  const pm = new PartitionManager(3);

  const events = [
    { key: "user1", value: "A" },
    { key: "user2", value: "B" },
    { key: "user1", value: "C" },
    { key: "user3", value: "D" },
  ];

  for (const e of events) {
    await pm.append(e.key, e);
  }

  console.log("Done");
})();
