# High-Throughput-Event-Ingestion-System

High-throughput event ingestion system inspired by a simplified Kafka. Supports append-only logs, partitioned topics, consumer offsets, and parallel processing. Designed for low-latency ingestion, scalable reads/writes, and durable event storage.

---

## 🚀 Overview

This project implements a backend system designed to accept high volumes of events from producers and serve consumers reliably.  
It targets backend engineers preparing for **Tier-1 / MAANG system design and backend roles**.

Key features:

- Append-only logs per partition
- Deterministic partition routing with hashing
- Consumer offset reads
- HTTP Producer API with backpressure
- At-least-once delivery semantics
- Benchmarks and performance insights

---

## 🧠 Architecture

Producers (HTTP) --> Partition Manager --> Partition Log Files
|
v
Disk (append-only)

Consumers (HTTP) <-- Log Reader (offset retrieval)

Components:

- **PartitionManager** — Routes events to partitions based on key hashing
- **LogWriter** — Writes events sequentially to partition log files
- **LogReader** — Reads events by offset for consumers
- **HTTP API** — Exposes producer and consumer endpoints

---

## 📌 Guarantees

| Guarantee                   | Status             |
| --------------------------- | ------------------ |
| Ordering within a partition | ✅                 |
| At-least-once delivery      | ✅                 |
| Backpressure protection     | ✅                 |
| Low latency ingestion       | ⚙️ Depends on load |

---

## ⚙️ Design Decisions

### Partitioning

Partitioning allows **horizontal scaling** of writes and reads.  
Keys are hashed to ensure consistent routing. Ordering is only guaranteed within the same partition (global ordering is not enforced).

### Append-Only Logs

Sequential disk writes are efficient and reduce I/O overhead.

### Backpressure

Producers are limited using an **in-flight counter** to prevent memory/disk overload via HTTP 429 responses.

### Consumer Offsets

Consumers manage their own offsets. This enables **at-least-once delivery**, a common realistic guarantee for ingest systems.

---

## 🛠️ API Endpoints

### POST /produce

Ingest an event.

**Request**

```http
POST /produce
Content-Type: application/json

{
  "key": "user1",
  "value": "some payload"
}
```

**Responses**

```
200 OK – accepted

429 Too Many Requests – backpressure limit reached

500 Internal Server Error – write failed
```

### GET /consume

Read events from a partition starting at a given offset.

**Query Params**

```
?partition=0&offset=5
```

**Response**

```
{
  "events": [ /* array of event objects */ ],
  "nextOffset": 10
}
```

## Benchmarks

The system includes a benchmark script under the `benchmark/` directory to evaluate ingestion performance under concurrent load.

The benchmark measures:

- **Throughput (requests per second)**
- **Latency percentiles (p50, p95, p99)**
- **Backpressure threshold under sustained load**

### Sample Results (Example)

> Note: Actual results may vary depending on hardware configuration, disk performance, and the number of partitions.

---

## Failure Scenarios

The system is designed to handle common failure conditions gracefully.

| Scenario          | Behavior                                              |
| ----------------- | ----------------------------------------------------- |
| Producer overload | HTTP 429 responses are returned to apply backpressure |
| Consumer crash    | Events may be reprocessed (at-least-once delivery)    |
| Server restart    | Events remain durable due to append-only disk storage |

---

## Limitations

While inspired by production-grade systems, the current implementation intentionally omits:

- Replication or fault-tolerant clustering
- Consumer groups or load balancing across consumers
- Exactly-once delivery guarantees
- Indexed log segments for O(log n) read performance

These tradeoffs were made to focus on core ingestion semantics and system clarity. The architecture can be extended to support these features.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/ChandanaPrabhakar/High-Throughput-Evenet-Ingestion-System.git
```

### Install Dependencies

```
npm install
```

### Run the Server

```
node src/index.js
```

### Produce Events

```
curl -X POST http://localhost:3000/produce \
  -H "Content-Type: application/json" \
  -d '{"key":"k","value":"v"}'

```

### Consume Events

```
curl "http://localhost:3000/consume?partition=0&offset=0"
```

## What This Teaches

**This project demonstrates real backend engineering skills:**
✔ Distributed log design
✔ Backpressure control
✔ Deterministic hashing & partitioning
✔ Sequential disk I/O optimization
✔ System tradeoff reasoning

These are exactly the skills assessed in backend + system design rounds at Tier-1 tech companies.

## License

MIT
