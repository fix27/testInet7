import React from 'react';

interface ScriptStepProps {
    title: string;
    command: string;
    description: string;
    onRun: () => void;
    isDisabled: boolean;
}

const ScriptStep: React.FC<ScriptStepProps> = ({ title, command, description, onRun, isDisabled }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-lg font-bold text-cyan-400">{title}</h3>
            <p className="text-gray-400 text-sm my-2">{description}</p>
            <code className="bg-gray-900 text-yellow-300 px-2 py-1 rounded-md text-sm block overflow-x-auto">{command}</code>
            <button
                onClick={onRun}
                disabled={isDisabled}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                {isDisabled ? 'Running...' : 'Run Step'}
            </button>
        </div>
    );
};

export default ScriptStep;
