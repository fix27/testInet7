import React, { useRef, useEffect } from 'react';

interface ConsoleProps {
    lines: string[];
    onDownloadLog: () => void;
    onClearConsole: () => void;
}

const Console: React.FC<ConsoleProps> = ({ lines, onDownloadLog, onClearConsole }) => {
    const consoleEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    return (
        <div className="bg-black rounded-lg shadow-lg font-mono text-sm h-full flex flex-col border border-gray-700">
            <div className="flex-shrink-0 bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700 rounded-t-lg">
                <h3 className="text-gray-300 font-bold px-2">Live Output</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={onDownloadLog}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors duration-200"
                        aria-label="Download console log"
                    >
                        Download Log
                    </button>
                    <button
                        onClick={onClearConsole}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors duration-200"
                        aria-label="Clear console"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                {lines.map((line, index) => {
                    let style = "text-gray-300";
                    if (line.startsWith('>')) {
                        style = "text-green-400";
                    } else if (line.startsWith('[START]') || line.startsWith('[END]')) {
                        style = "text-yellow-400";
                    } else if (line.startsWith('-'.repeat(50))) {
                        style = "text-gray-600";
                    }

                    return (
                        <div key={index} className="whitespace-pre-wrap break-words">
                            <span className={style}>{line}</span>
                        </div>
                    );
                })}
                <div ref={consoleEndRef} />
            </div>
        </div>
    );
};

export default Console;
