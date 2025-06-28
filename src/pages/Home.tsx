import React, { useState, useMemo } from 'react';
import { Trophy, Users, Calendar, TrendingUp, Search, Loader2 } from 'lucide-react';
import HackathonCard from '../components/HackathonCard';
import SearchAndFilter from '../components/SearchAndFilter';
import { useHackathons, useHackathonStats } from '../hooks/useHackathons';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filters = useMemo(() => ({
    search: searchTerm || undefined,
    status: selectedStatus || undefined,
    type: selectedType || undefined,
  }), [searchTerm, selectedStatus, selectedType]);

  const { hackathons, total, loading: hackathonsLoading, error: hackathonsError } = useHackathons(filters);
  const { stats, loading: statsLoading, error: statsError } = useHackathonStats();

  const defaultStats = {
    total: 0,
    upcoming: 0,
    ongoing: 0,
    ended: 0,
    totalPrize: '$0'
  };

  const displayStats = stats || defaultStats;

  if (hackathonsError || statsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">
            {hackathonsError || statsError}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-4">
          Discover Amazing
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
            Hackathons
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find and participate in hackathons from top platforms worldwide. Build innovative solutions, 
          win prizes, and connect with fellow developers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              displayStats.total
            )}
          </div>
          <div className="text-sm text-gray-600">Total Hackathons</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              displayStats.upcoming
            )}
          </div>
          <div className="text-sm text-gray-600">Upcoming Events</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              displayStats.ongoing
            )}
          </div>
          <div className="text-sm text-gray-600">Live Now</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              displayStats.totalPrize
            )}
          </div>
          <div className="text-sm text-gray-600">Total Prizes</div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Results */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {hackathonsLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading Hackathons...
            </div>
          ) : (
            total === hackathons.length 
              ? 'All Hackathons' 
              : `Found ${hackathons.length} hackathon${hackathons.length !== 1 ? 's' : ''}`
          )}
        </h2>
        <p className="text-gray-600">
          {hackathonsLoading ? 'Fetching the latest hackathons...' : 'Showing the latest hackathons from various platforms'}
        </p>
      </div>

      {/* Hackathon Grid */}
      {hackathonsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hackathons found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default Home;