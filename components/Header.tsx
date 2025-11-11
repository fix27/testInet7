import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 border border-gray-700">
            <h1 className="text-2xl font-bold text-green-400 font-mono">Bash Script Runner GUI</h1>
            <div className="text-sm text-gray-400 mt-2 space-y-1 font-mono">
                <p><span className="text-cyan-400">Author:</span> fix@inbox.ru</p>
                <p><span className="text-cyan-400">Start date:</span> 07.04.2020</p>
                <p><span className="text-cyan-400">Update date:</span> 27.12.2024</p>
                 <p><span className="text-cyan-400">Original script concept:</span> A bash script for network performance testing.</p>
            </div>
        </div>
    );
};

export default Header;
