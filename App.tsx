import React, { useState, useCallback } from 'react';
import { IPERF_SERVERS, WGET_URLS } from './constants';
import type { ScriptStep, LogFunction } from './types';
import Header from './components/Header';
import Console from './components/Console';
import ScriptStepComponent from './components/ScriptStep';

// Helper functions for simulation
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const SCRIPT_STEPS: ScriptStep[] = [
    {
        id: 'install',
        title: 'Install Prerequisites',
        description: 'Updates package lists and installs necessary tools like speedtest-cli, iperf3, and wget.',
        command: 'sudo apt update && sudo apt install -y speedtest-cli iperf3 wget',
        simulation: async (log: LogFunction) => {
            await log('Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease');
            await sleep(150);
            await log('Get:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]');
            await sleep(150);
            await log('Reading package lists... Done');
            await sleep(300);
            await log('Building dependency tree... Done');
            await sleep(300);
            await log('Reading state information... Done');
            await sleep(200);
            await log('speedtest-cli is already the newest version (2.1.3-1.1).');
            await log('iperf3 is already the newest version (3.9-1).');
            await log('wget is already the newest version (1.21.2-2ubuntu1).');
            await sleep(200);
            await log('0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.');
        }
    },
    {
        id: 'speedtest',
        title: 'Run Speedtest-CLI',
        description: 'Performs a basic internet speed test to measure download and upload bandwidth.',
        command: 'speedtest-cli',
        simulation: async (log: LogFunction) => {
            await log('Retrieving speedtest.net configuration...');
            await sleep(1000);
            await log('Testing from Example ISP (192.0.2.1)...');
            await sleep(1000);
            await log('Retrieving speedtest.net server list...');
            await sleep(1500);
            await log('Selecting best server based on ping...');
            await sleep(1000);
            const ping = rand(9, 40);
            await log(`Hosted by Some Server Co (City, ST) [12.34 km]: ${ping}.${rand(100,999)} ms`);
            await sleep(500);
            await log('Testing download speed................................................................................');
            await sleep(2500);
            const download = rand(80, 500);
            await log(`Download: ${download}.${rand(10,99)} Mbit/s`);
            await sleep(500);
            await log('Testing upload speed..................................................................................');
            await sleep(2500);
            const upload = rand(20, 150);
            await log(`Upload: ${upload}.${rand(10,99)} Mbit/s`);
        }
    },
    {
        id: 'iperf3',
        title: 'Run iperf3 Tests',
        description: 'Connects to a list of public iperf3 servers to test network performance against various endpoints.',
        command: 'for server in "${iperf_servers[@]}"; do iperf3 -c $server; done',
        simulation: async (log: LogFunction) => {
            for (const server of IPERF_SERVERS.slice(0, 4)) { // Test first 4 for brevity
                await log(`\n> iperf3 -c ${server}`);
                await log(`Connecting to host ${server}, port ${server.split(':')[1] || 5201}`);
                await sleep(1000);
                const streamId = rand(1, 5);
                await log(`[  ${streamId} ] local 192.168.1.10 port ${rand(50000, 60000)} connected to ${server} port ${server.split(':')[1] || 5201}`);
                await sleep(500);
                await log('[ ID] Interval           Transfer     Bitrate         Retr  Cwnd');
                await log(`[  ${streamId} ]   0.00-1.00   sec  ${rand(5, 20)} MBytes  ${rand(40, 160)} Mbits/sec    0    128 KBytes`);
                await sleep(1000);
                await log(`[  ${streamId} ]   1.00-2.00   sec  ${rand(5, 20)} MBytes  ${rand(40, 160)} Mbits/sec    0    128 KBytes`);
                await sleep(1000);
                await log(`- - - - - - - - - - - - - - - - - - - - - - - - -`);
                await log(`[ ID] Interval           Transfer     Bitrate         Retr`);
                await log(`[  ${streamId} ]   0.00-2.00   sec  ${rand(10, 40)} MBytes  ${rand(40, 160)} Mbits/sec    0             sender`);
            }
            await log('\nFinished iperf3 tests.');
        }
    },
    {
        id: 'wget',
        title: 'Run Wget Download Tests',
        description: 'Downloads test files from various servers using wget to check download speeds from different sources.',
        command: 'for url in "${wget_urls[@]}"; do wget -O /dev/null --show-progress $url; done',
        simulation: async (log: LogFunction) => {
             for (const url of WGET_URLS.slice(0, 3)) { // Test first 3 for brevity
                const shortUrl = url.length > 60 ? url.substring(0, 57) + '...' : url;
                await log(`\n> wget -O /dev/null --show-progress ${shortUrl}`);
                await log(`--${new Date().toISOString()}--  ${url}`);
                await log('Resolving host... resolved. Connecting...');
                await sleep(500);
                await log('HTTP request sent, awaiting response... 200 OK');
                await log('Length: 104857600 (100M) [application/zip]');
                await log('Saving to: ‘/dev/null’');
                await sleep(200);
                let progress = '';
                for (let i = 0; i <= 20; i++) {
                    progress += '❚';
                    const percent = i * 5;
                    const speed = rand(8, 25);
                    const eta = Math.ceil((100 - percent) / speed);
                    await log(`/dev/null          [${progress.padEnd(20, ' ')}]  ${percent}%  ${speed}.${rand(10,99)}MB/s    eta ${eta}s`);
                    await sleep(100);
                }
                 await log(`‘/dev/null’ saved [104857600/104857600]`);
             }
             await log('\nFinished wget tests.');
        }
    },
    {
        id: 'ping',
        title: 'Ping IPv6 Google',
        description: 'Sends ICMP packets to Google\'s IPv6 address to check for IPv6 connectivity and latency.',
        command: 'ping -c 4 ipv6.google.com',
        simulation: async (log: LogFunction) => {
            await log('PING ipv6.google.com(prg03s06-in-x0e.1e100.net (2a00:1450:4001:82b::200e)) 56 data bytes');
            for (let i = 0; i < 4; i++) {
                await sleep(1000);
                await log(`64 bytes from prg03s06-in-x0e.1e100.net (2a00:1450:4001:82b::200e): icmp_seq=${i+1} ttl=117 time=${rand(10,30)}.${rand(1,9)} ms`);
            }
            await log('\n--- ipv6.google.com ping statistics ---');
            await log(`4 packets transmitted, 4 received, 0% packet loss, time 3005ms`);
            await log(`rtt min/avg/max/mdev = 12.345/15.678/18.901/2.345 ms`);
        }
    },
    {
        id: 'fast',
        title: 'Run fast-cli Test',
        description: 'Uses fast-cli (powered by fast.com) to perform a quick internet speed test, focusing on upload.',
        command: 'fast -u',
        simulation: async (log: LogFunction) => {
            await log('Simulating fast-cli install and run...');
            await log('added 1 package, and audited 2 packages in 2s');
            await log('found 0 vulnerabilities');
            await sleep(500);
            await log('Running upload test...');
            await sleep(1000);
            await log(`\n \u{21E7} ${rand(80, 150)} Mbps`);
        }
    }
];

const App: React.FC = () => {
    const [consoleLines, setConsoleLines] = useState<string[]>(['Welcome to the Bash Script Runner GUI! Click "Run Step" to begin.']);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const log = useCallback(async (line: string) => {
        setConsoleLines(prev => [...prev, line]);
        await sleep(50); // small delay to make output feel more natural
    }, []);

    const runStep = useCallback(async (step: ScriptStep) => {
        if (isRunning) return;
        setIsRunning(true);
        const startTime = new Date();
        const separator = '-'.repeat(50);
        setConsoleLines(prev => [
            ...prev,
            `\n${separator}`,
            `[START] ${startTime.toLocaleString()}: Running "${step.title}"`,
            `> ${step.command}`,
        ]);
        await sleep(500);
        await step.simulation(log);

        const endTime = new Date();
        const duration = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2);
        setConsoleLines(prev => [
            ...prev,
            `\n[END] ${endTime.toLocaleString()}: Finished "${step.title}" in ${duration}s`,
            `${separator}\n`,
        ]);
        setIsRunning(false);
    }, [log, isRunning]);

    const downloadLog = useCallback(() => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `network-test-log_${timestamp}.log`;
        const logContent = consoleLines.join('\n');
        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [consoleLines]);

    const clearConsole = useCallback(() => {
        setConsoleLines(['Welcome to the Bash Script Runner GUI! Click "Run Step" to begin.']);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                        {SCRIPT_STEPS.map(step => (
                            <ScriptStepComponent
                                key={step.id}
                                title={step.title}
                                description={step.description}
                                command={step.command}
                                onRun={() => runStep(step)}
                                isDisabled={isRunning}
                            />
                        ))}
                    </div>
                    <div className="lg:h-[80vh]">
                        <Console
                            lines={consoleLines}
                            onDownloadLog={downloadLog}
                            onClearConsole={clearConsole}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
