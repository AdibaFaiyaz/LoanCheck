import React from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface EnhancedAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EnhancedAlert: React.FC<EnhancedAlertProps> = ({
  type,
  title,
  message,
  onClose,
  action
}) => {
  const configs = {
    success: {
      icon: FiCheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    error: {
      icon: FiXCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: FiAlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: FiInfo,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg p-4 mb-4 animate-fade-in-down`}>
      <div className="flex items-start space-x-3">
        <Icon className={`${config.iconColor} w-6 h-6 flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="mt-1">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-3 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiXCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};