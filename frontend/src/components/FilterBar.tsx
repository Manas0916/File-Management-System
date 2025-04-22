import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { FilterBarProps, Filters } from '../types/file';

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
    const [fileName, setFileName] = useState<string>(filters.fileName || '');

    const debouncedFilterChange = useMemo(
        () => debounce((newFilters: Filters) => onFilterChange(newFilters), 900),
        [onFilterChange]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedFilters = { ...filters, [name]: value };

        if (name === 'fileName') {
            setFileName(value);
            debouncedFilterChange(updatedFilters);
        } else {
            onFilterChange(updatedFilters);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFilters = {
            ...filters,
            dateRange: {
                ...filters.dateRange,
                [name]: value,
            },
        };
        onFilterChange(updatedFilters);
    };

    useEffect(() => {
        return () => {
            debouncedFilterChange.cancel();
        };
    }, [debouncedFilterChange]);
    return (
        <div className="filter-bar flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow mb-6">
            <div className="flex flex-col"></div>
            <div className="flex flex-col">
                <label htmlFor="fileType" className="mb-1 text-sm font-medium text-gray-700">File Type:</label>
                <select
                    name="fileType"
                    value={filters.fileType}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All</option>
                    <option value="file">File</option>
                    <option value="img">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="startDate" className="mb-1 text-sm font-medium text-gray-700">Start Date:</label>
                <input
                    type="date"
                    name="startDate"
                    value={filters.dateRange?.startDate}
                    onChange={handleDateChange}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="endDate" className="mb-1 text-sm font-medium text-gray-700">End Date:</label>
                <input
                    type="date"
                    name="endDate"
                    value={filters.dateRange?.endDate}
                    onChange={handleDateChange}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="fileSize" className="mb-1 text-sm font-medium text-gray-700">File Size:</label>
                <select
                    name="fileSize"
                    value={filters.fileSize}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All</option>
                    <option value="small">Small (&lt; 1MB)</option>
                    <option value="medium">Medium (1MB - 10MB)</option>
                    <option value="large">Large (&gt; 10MB)</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="fileName" className="mb-1 text-sm font-medium text-gray-700">File Name:</label>
                <input
                    type="text"
                    name="fileName"
                    value={fileName}
                    onChange={handleInputChange}
                    placeholder="Enter file name"
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default FilterBar;