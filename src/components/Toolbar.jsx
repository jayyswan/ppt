import React from 'react';
import { Search } from 'lucide-react';

export default function Toolbar({ searchQuery, setSearchQuery }) {
    return (
        <div className="absolute top-4 left-4 z-10 flex gap-4 bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200">
            {/* Search Input */}
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                />
            </div>
        </div>
    );
}
