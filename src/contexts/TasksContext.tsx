
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: string;
  title_key: string;
  description_key: string;
  task_type: string;
  reward_amount: number;
  action_url?: string;
  completed: boolean;
}

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title_key: 'Join Telegram Channel',
      description_key: 'Join our official Telegram channel to get the latest updates',
      task_type: 'telegram',
      reward_amount: 0.01,
      action_url: 'https://t.me/spacecoin',
      completed: false
    },
    {
      id: '2',
      title_key: 'Follow on Twitter',
      description_key: 'Follow our official Twitter account and get rewarded',
      task_type: 'twitter',
      reward_amount: 0.005,
      action_url: 'https://twitter.com/spacecoin',
      completed: false
    },
    {
      id: '3',
      title_key: 'Invite 5 Friends',
      description_key: 'Invite 5 friends to join the application',
      task_type: 'referral',
      reward_amount: 0.025,
      completed: false
    },
    {
      id: '4',
      title_key: 'Daily Login',
      description_key: 'Login daily to receive your reward',
      task_type: 'daily',
      reward_amount: 0.002,
      completed: false
    },
    {
      id: '5',
      title_key: 'Invite 20 Friends',
      description_key: 'Invite 20 friends to earn a massive 0.5 TON reward',
      task_type: 'referral',
      reward_amount: 0.5,
      completed: false
    }
  ]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ));
  };

  const value: TasksContextType = {
    tasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};
