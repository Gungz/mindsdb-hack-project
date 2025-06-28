import React from 'react';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search hackathons by title, description, or tags..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none bg-white pl-9 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 min-w-[120px]"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="appearance-none bg-white pl-9 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 min-w-[120px]"
            >
              <option value="">All Types</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;