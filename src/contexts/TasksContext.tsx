
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tasksService } from '@/services/tasksService';
import { useToast } from '@/hooks/use-toast';
import type { Task, TaskInsert, TaskUpdate } from '@/types/database';

interface TasksContextType {
  tasks: Task[];
  completedTaskIds: string[];
  isLoading: boolean;
  refreshTasks: () => Promise<void>;
  addTask: (task: TaskInsert) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      const [tasksData, completedIds] = await Promise.all([
        tasksService.getAllTasks(),
        tasksService.getUserCompletedTasks()
      ]);
      setTasks(tasksData);
      setCompletedTaskIds(completedIds);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب المهام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: TaskInsert) => {
    try {
      const newTask = await tasksService.addTask(taskData);
      setTasks(prev => [...prev, newTask]);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المهمة بنجاح",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المهمة",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    try {
      const updatedTask = await tasksService.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast({
        title: "تم بنجاح",
        description: "تم تحديث المهمة بنجاح",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث المهمة",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "تم بنجاح",
        description: "تم حذف المهمة بنجاح",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المهمة",
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeTask = async (id: string) => {
    try {
      if (completedTaskIds.includes(id)) {
        await tasksService.uncompleteTask(id);
        setCompletedTaskIds(prev => prev.filter(taskId => taskId !== id));
      } else {
        await tasksService.completeTask(id);
        setCompletedTaskIds(prev => [...prev, id]);
      }
    } catch (error) {
      console.error('Error completing/uncompleting task:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة المهمة",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const value: TasksContextType = {
    tasks,
    completedTaskIds,
    isLoading,
    refreshTasks,
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
