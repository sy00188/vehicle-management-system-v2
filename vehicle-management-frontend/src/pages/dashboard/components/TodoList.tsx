import React from 'react';
import type { TodoItem } from '../../../types';

interface TodoListProps {
  todos: TodoItem[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      urgent: '紧急',
      high: '高',
      medium: '中',
      low: '低'
    };
    return priorityMap[priority] || '普通';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: '已完成',
      'in-progress': '进行中',
      pending: '待处理'
    };
    return statusMap[status] || '未知';
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return `逾期 ${Math.abs(diffInDays)} 天`;
    } else if (diffInDays === 0) {
      return '今天到期';
    } else if (diffInDays === 1) {
      return '明天到期';
    } else if (diffInDays <= 7) {
      return `${diffInDays} 天后到期`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  const getDueDateColor = (dueDate?: string) => {
    if (!dueDate) return 'text-gray-500';
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return 'text-red-600';
    } else if (diffInDays <= 1) {
      return 'text-orange-600';
    } else if (diffInDays <= 3) {
      return 'text-yellow-600';
    } else {
      return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">待办事项</h3>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {todos.filter(todo => todo.status !== 'completed').length} 项待处理
        </span>
      </div>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-check-circle text-3xl mb-3"></i>
            <p>暂无待办事项</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {todo.title}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                      {getPriorityText(todo.priority)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getStatusColor(todo.status)}`}>
                      {getStatusText(todo.status)}
                    </span>
                    
                    {todo.dueDate && (
                      <span className={`flex items-center ${getDueDateColor(todo.dueDate)}`}>
                        <i className="fas fa-clock mr-1"></i>
                        {formatDueDate(todo.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {todo.status !== 'completed' && (
                    <button className="text-gray-400 hover:text-primary-600 transition-colors">
                      <i className="fas fa-check text-sm"></i>
                    </button>
                  )}
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <i className="fas fa-ellipsis-v text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 rounded-lg hover:bg-primary-50 transition-colors">
            查看所有待办事项
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;