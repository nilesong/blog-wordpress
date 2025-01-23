"use client";

import React from "react";

// Type definition: props
interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default SearchBar;
