import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuickAction } from '../../../types';

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const navigate = useNavigate();

  const handleActionClick = (action: QuickAction) => {
    if (action.action.startsWith('/')) {
      // 路由导航
      navigate(action.action);
    } else {
      // 其他操作（如打开模态框等）
      console.log('执行操作:', action.action);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">快捷操作</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2 hover:shadow-md`}
          >
            <i className={`${action.icon} text-xl`}></i>
            <span className="text-sm font-medium">{action.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
            <i className="fas fa-cog mr-2"></i>
            自定义快捷操作
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;