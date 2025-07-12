const axios = require('axios');
const { performance } = require('perf_hooks');
const cliProgress = require('cli-progress');
const chalk = require('chalk');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const config = require('./config');

const allResults = [];

async function runTest(endpoint) {
    let success = 0,
        failed = 0,
        totalTime = 0,
        minTime = Infinity,
        maxTime = 0;

    console.log(chalk.cyan(`\n🔍 Testing: ${endpoint.name}`));
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(config.totalRequests, 0);

    const sendRequest = async () => {
        const payload = Array.isArray(endpoint.payloads)
            ? endpoint.payloads[Math.floor(Math.random() * endpoint.payloads.length)]
            : endpoint.payloads;

        const start = performance.now();
        try {
            await axios({
                method: endpoint.method,
                url: endpoint.url,
                timeout: config.timeout,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    ...endpoint.headers
                },
                data: ['POST', 'PUT', 'PATCH'].includes(endpoint.method.toUpperCase()) ? payload : undefined,
            });
            const timeTaken = performance.now() - start;
            success++;
            totalTime += timeTaken;
            minTime = Math.min(minTime, timeTaken);
            maxTime = Math.max(maxTime, timeTaken);
        } catch (err) {
            failed++;
        } finally {
            bar.increment();
        }
    };

    let sent = 0;
    const pending = [];

    while (sent < config.totalRequests) {
        while (pending.length < config.concurrentRequests && sent < config.totalRequests) {
            pending.push(sendRequest());
            sent++;
        }
        await Promise.race(pending);
        pending.splice(0, pending.length - config.concurrentRequests);
    }

    await Promise.all(pending);
    bar.stop();

    const avg = success ? (totalTime / success).toFixed(2) : 0;
    const rps = success ? (success / (totalTime / 1000)).toFixed(2) : 0;

    console.log(chalk.green(`✅ Success: ${success}`));
    console.log(chalk.red(`❌ Failed: ${failed}`));
    console.log(`📈 Avg Time: ${avg} ms`);
    console.log(`📉 Min: ${minTime.toFixed(2)} ms | Max: ${maxTime.toFixed(2)} ms`);
    console.log(`⚡ RPS (approx): ${rps}`);

    allResults.push({
        endpoint: endpoint.name,
        method: endpoint.method,
        url: endpoint.url,
        totalRequests: config.totalRequests,
        success,
        failed,
        avgTime: avg,
        minTime: minTime.toFixed(2),
        maxTime: maxTime.toFixed(2),
        rps,
    });
}

function getTimestampFileName(baseName) {
    const now = new Date();
    const formatted = now
        .toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .replace('Z', '');

    return `${baseName}-${formatted}.csv`;
}

async function exportCSV() {
    const fileName = getTimestampFileName('load-test-report');
    const csvWriter = createCsvWriter({
        path: fileName,
        header: [
            { id: 'endpoint', title: 'Endpoint Name' },
            { id: 'method', title: 'HTTP Method' },
            { id: 'url', title: 'URL' },
            { id: 'totalRequests', title: 'Total Requests' },
            { id: 'success', title: 'Success' },
            { id: 'failed', title: 'Failed' },
            { id: 'avgTime', title: 'Avg Time (ms)' },
            { id: 'minTime', title: 'Min Time (ms)' },
            { id: 'maxTime', title: 'Max Time (ms)' },
            { id: 'rps', title: 'Requests/sec' },
        ],
    });

    await csvWriter.writeRecords(allResults);
    console.log(chalk.yellowBright(`\n📄 CSV report exported: ${{fileName}}`));
}

async function run() {
    for (const endpoint of config.endpoints) {
        await runTest(endpoint);
    }
    await exportCSV();
}

run();
