# API Load Tester - NodeJs Testing Script

A simple Node.js script to perform load testing on RESTful APIs using concurrent HTTP requests. Useful for benchmarking performance, identifying bottlenecks, and generating structured reports in CSV format for analysis.

---

## 📦 Features

- 🧪 Load test any HTTP/REST API endpoint
- ⚙️ Configurable:
  - Concurrency level
  - Duration of the test
  - Request method and body
- 📊 CSV report generation:
  - Response time
  - HTTP status code
  - Timestamp of each request
- 💡 Lightweight and easy to customize

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- `npm install` to install dependencies

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/node-api-load-tester.git
cd node-api-load-tester
npm install
```

## 🛠 Usage
Basic usage from the command line:
```bash
node loadTest.js --url https://api.example.com/test --concurrency 50 --duration 30
```

### Options

| Arguments       | Description                                             | Example                          |
|----------------|---------------------------------------------------------|----------------------------------|
| `--url`        | Target API endpoint                                     | `https://api.example.com/test`   |
| `--concurrency`| Number of concurrent requests                           | `50`                             |
| `--duration`   | Duration of the test in seconds                         | `30`                             |
| `--method`     | HTTP method (`GET`, `POST`, etc.) *(optional)*         | `POST`                           |
| `--bodyFile`   | Path to a JSON file containing the request body *(optional)* | `./payload.json`            |

## 📄 Output Report
A CSV file named results_timestamp.csv will be generated with the following structure:
```bash
timestamp,response_time_ms,status_code
2025-07-12T14:23:01.123Z,132,200
2025-07-12T14:23:01.456Z,201,200
...
```

## 🧑‍💻 Author : [Rakesh](https://github.com/rakesh-rkz)

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---