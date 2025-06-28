import React, { useState } from 'react';
import { 
  Plus, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  XCircle,
  Calendar,
  Settings,
  Database,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useSources } from '../hooks/useSources';
import { HackathonSource } from '../types/hackathon';

const Admin: React.FC = () => {
  const { 
    sources, 
    loading, 
    error, 
    createSource, 
    updateSource, 
    deleteSource, 
    fetchFromSource,
    refetch
  } = useSources();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSource, setEditingSource] = useState<HackathonSource | null>(null);
  const [isFetching, setIsFetching] = useState<string | null>(null);
  const [fetchResults, setFetchResults] = useState<{ [key: string]: { success: boolean; message: string } }>({});

  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    provider: 'other' as HackathonSource['provider'],
    isActive: true
  });

  const handleAddSource = async () => {
    if (newSource.name && newSource.url) {
      try {
        await createSource(newSource);
        setNewSource({ name: '', url: '', provider: 'other', isActive: true });
        setShowAddForm(false);
      } catch (err) {
        console.error('Error creating source:', err);
      }
    }
  };

  const handleToggleActive = async (provider: string, currentActive: boolean) => {
    try {
      await updateSource(provider, { isActive: !currentActive });
    } catch (err) {
      console.error('Error toggling source:', err);
    }
  };

  const handleDeleteSource = async (provider: string) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      try {
        await deleteSource(provider);
        await refetch();
      } catch (err) {
        console.error('Error deleting source:', err);
      }
    }
  };

  const handleFetchData = async (provider: string) => {
    setIsFetching(provider);
    try {
      const result = await fetchFromSource(provider);
      console.log(result);
      setFetchResults(prev => ({ ...prev, [provider]: result }));
    } catch (err) {
      setFetchResults(prev => ({ 
        ...prev, 
        [provider]: { 
          success: false, 
          message: err instanceof Error ? err.message : 'Failed to fetch data' 
        } 
      }));
    } finally {
      setIsFetching(null);
    }
  };

  const getProviderIcon = (provider: HackathonSource['provider']) => {
    const icons = {
      devpost: '🚀',
      topcoder: '🏆',
      devfolio: '📱',
      'hackathon.io': '💻',
      quira: '🌐',
      other: '🌐'
    };
    return icons[provider];
  };

  const formatLastFetched = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Admin Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Overlay loader when fetching */}
      {isFetching && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage hackathon data sources and configure fetching settings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{sources.length}</div>
              <div className="text-sm text-gray-600">Total Sources</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {sources.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Sources</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {sources.reduce((sum, s) => sum + s.hackathonsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Hackathons Found</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {sources.filter(s => s.lastFetched).length}
              </div>
              <div className="text-sm text-gray-600">Recently Synced</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Data Sources</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingSource) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSource ? 'Edit Source' : 'Add New Source'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="e.g., Devpost Major Hackathons"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
              <input
                type="url"
                value={newSource.url}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                placeholder="https://api.example.com/hackathons"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <select
                value={newSource.provider}
                onChange={(e) => setNewSource({ ...newSource, provider: e.target.value as HackathonSource['provider'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="devpost">Devpost</option>
                <option value="topcoder">TopCoder</option>
                <option value="quira">Quira</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddSource}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              {editingSource ? 'Update' : 'Add'} Source
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingSource(null);
                setNewSource({ name: '', url: '', provider: 'other', isActive: true });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sources List */}
      <div className="space-y-4">
        {sources.map((source) => (
          <div key={source.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getProviderIcon(source.provider)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      source.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {source.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      Source
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <span className="text-sm text-gray-500">
                      {source.hackathonsCount} hackathons
                    </span>
                    <span className="text-sm text-gray-500">
                      Last fetched: {formatLastFetched(source.lastFetched)}
                    </span>
                  </div>
                  {fetchResults[source.provider] && (
                    <div className={`mt-2 text-sm ${
                      fetchResults[source.provider].success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {fetchResults[source.provider].message}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFetchData(source.provider)}
                  disabled={isFetching === source.provider}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isFetching === source.id ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => handleToggleActive(source.provider, source.isActive)}
                  className="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSource(source.provider)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data sources configured</h3>
          <p className="text-gray-600 mb-4">Add your first hackathon data source to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Source
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;