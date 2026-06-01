import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Send, History } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { icon: Plus, label: 'Credit', color: 'bg-green-500', path: '/credit' },
    { icon: Minus, label: 'Debit', color: 'bg-red-500', path: '/debit' },
    { icon: Send, label: 'Transfer', color: 'bg-blue-500', path: '/transfer' },
    { icon: History, label: 'History', color: 'bg-purple-500', path: '/transactions' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.path)}
          className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 card-hover"
        >
          <div className={`absolute top-0 right-0 w-20 h-20 ${action.color} opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300`}></div>
          <div className="relative z-10">
            <action.icon className={`h-8 w-8 ${action.color.replace('bg-', 'text-')} mb-3`} />
            <h3 className="font-semibold text-gray-800">{action.label}</h3>
            <p className="text-sm text-gray-500 mt-1">Quick {action.label.toLowerCase()}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;