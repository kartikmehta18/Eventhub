import React from 'react';
import { EventType } from '../../types';

interface BadgeProps {
  type: EventType;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ type, className }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'hackathon':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tech-talk':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'workshop':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'conference':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'hackathon':
        return 'Hackathon';
      case 'tech-talk':
        return 'Tech Talk';
      case 'workshop':
        return 'Workshop';
      case 'conference':
        return 'Conference';
      default:
        return 'Other';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeStyles()} ${className}`}
    >
      {getTypeLabel()}
    </span>
  );
};

export default Badge;