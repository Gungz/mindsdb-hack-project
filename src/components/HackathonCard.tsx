import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, ExternalLink, Clock } from 'lucide-react';
import { Hackathon } from '../types/hackathon';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon }) => {
  const getStatusColor = (status: Hackathon['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Hackathon['type']) => {
    switch (type) {
      case 'online': return '🌐';
      case 'hybrid': return '🔄';
      case 'in-person': return '📍';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = () => {
    const start = new Date(hackathon.startDate);
    const now = new Date();
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `${diffDays} days to go`;
    if (diffDays === 0) return 'Starting today';
    return 'Started';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden">
        <img 
          src={hackathon.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
          alt={hackathon.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(hackathon.status)}`}>
            <Clock className="h-3 w-3 mr-1" />
            {hackathon.status}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {getTypeIcon(hackathon.type)} {hackathon.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Link 
            to={`/hackathon/${hackathon.id}`}
            className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors duration-200 line-clamp-2 group-hover:text-purple-600"
          >
            {hackathon.title}
          </Link>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="font-semibold text-gray-700">{hackathon.totalPrize}</span>
            <span className="mx-2">•</span>
            <span>{hackathon.organizer}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
            {hackathon.status === 'upcoming' && (
              <>
                <span className="mx-2">•</span>
                <span className="text-blue-600 font-medium">{getDaysUntil()}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{hackathon.location}</span>
            {hackathon.participants && (
              <>
                <span className="mx-2">•</span>
                <Users className="h-4 w-4 mr-1" />
                <span>{hackathon.participants.toLocaleString()} participants</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {hackathon.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
          {hackathon.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{hackathon.tags.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Link
            to={`/hackathon/${hackathon.id}`}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-center"
          >
            View Details
          </Link>
          <a
            href={hackathon.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;