import http from "http";

const TOTAL_REQUESTS = 20000;
const CONCURRENCY = 50;

let inFlight = 0;
let sent = 0;
let completed = 0;
const latencies = [];

function sendRequest() {
  if (sent >= TOTAL_REQUESTS) return;
  sent++;
  inFlight++;

  const start = Date.now();

  const req = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/produce",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        latencies.push(Date.now() - start);
        completed++;
        inFlight--;
        schedule();
      });
    }
  );

  req.on("error", () => {
    inFlight--;
    schedule();
  });

  req.write(JSON.stringify({ key: "user1", value: "hello" }));
  req.end();
}

function schedule() {
  while (inFlight < CONCURRENCY && sent < TOTAL_REQUESTS) {
    sendRequest();
  }
}

schedule();

process.on("exit", () => {
  latencies.sort((a, b) => a - b);
  console.log({
    completed,
    p50: latencies[Math.floor(latencies.length * 0.5)],
    p95: latencies[Math.floor(latencies.length * 0.95)],
    p99: latencies[Math.floor(latencies.length * 0.99)],
  });
});
