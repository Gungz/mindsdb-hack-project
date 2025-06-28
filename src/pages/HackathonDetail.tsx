import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  ExternalLink, 
  ArrowLeft, 
  Clock,
  Building,
  Tag,
  Loader2
} from 'lucide-react';
import { useHackathon } from '../hooks/useHackathons';

const HackathonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hackathon, loading, error } = useHackathon(id!);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading hackathon details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {error ? 'Error Loading Hackathon' : 'Hackathon not found'}
          </h1>
          <p className="text-gray-600 mt-2">
            {error || "The hackathon you're looking for doesn't exist."}
          </p>
          <Link to="/" className="inline-flex items-center mt-4 text-purple-600 hover:text-purple-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to hackathons
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
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

  // Custom components for ReactMarkdown
  const markdownComponents = {
    h1: ({ children }: any) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-bold text-gray-900 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-bold text-gray-900 mb-2">{children}</h3>,
    p: ({ children }: any) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>,
    li: ({ children }: any) => <li className="text-gray-700">{children}</li>,
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-gray-700">{children}</em>,
    code: ({ children }: any) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
    pre: ({ children }: any) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
    a: ({ href, children }: any) => (
      <a href={href} className="text-purple-600 hover:text-purple-700 underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to hackathons
      </Link>

      {/* Hero Image */}
      {hackathon.imageUrl && (
        <div className="h-64 md:h-80 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl mb-8 relative overflow-hidden">
          <img 
            src={hackathon.imageUrl} 
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(hackathon.status)}`}>
                <Clock className="h-4 w-4 mr-1" />
                {hackathon.status}
              </span>
              {hackathon.status === 'upcoming' && (
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {getDaysUntil()}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {hackathon.title}
            </h1>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Hackathon</h2>
            <div className="markdown-content">
              {hackathon.description ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {hackathon.description}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500 italic">No description available for this hackathon.</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Technologies & Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {hackathon.tags && hackathon.tags.length > 0 ? (
                hackathon.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No tags available for this hackathon.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">{hackathon.totalPrize}</div>
                  <div className="text-sm text-gray-600">Total Prizes</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {formatDate(hackathon.startDate)}
                  </div>
                  <div className="text-sm text-gray-600">
                    to {formatDate(hackathon.endDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">{hackathon.location}</div>
                  <div className="text-sm text-gray-600 capitalize">{hackathon.type}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Building className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">{hackathon.organizer}</div>
                  <div className="text-sm text-gray-600">Organizer</div>
                </div>
              </div>
              
              {hackathon.participants && (
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {hackathon.participants.toLocaleString()}
                      {hackathon.maxParticipants && ` / ${hackathon.maxParticipants.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-600">Participants</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registration */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Ready to participate?</h3>
            <p className="text-purple-100 text-sm mb-4">
              Join thousands of developers building innovative solutions
            </p>
            <a
              href={hackathon.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              Register Now
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>

          {/* Progress Bar for Participants */}
          {hackathon.participants && hackathon.maxParticipants && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Registration Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {hackathon.participants.toLocaleString()} of {hackathon.maxParticipants.toLocaleString()} spots filled
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonDetail;