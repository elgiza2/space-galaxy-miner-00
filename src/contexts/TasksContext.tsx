
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
      console.log('بدء تحديث المهام...');
      
      const [tasksData, completedIds] = await Promise.all([
        tasksService.getAllTasks(),
        tasksService.getUserCompletedTasks()
      ]);
      
      console.log('تم جلب المهام:', tasksData.length);
      console.log('المهام المكتملة:', completedIds.length);
      
      setTasks(tasksData);
      setCompletedTaskIds(completedIds);
    } catch (error) {
      console.error('خطأ في تحديث المهام:', error);
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
      console.log('محاولة إضافة مهمة جديدة:', taskData);
      
      const newTask = await tasksService.addTask(taskData);
      console.log('تم إنشاء المهمة:', newTask);
      
      setTasks(prev => {
        const updated = [...prev, newTask];
        console.log('قائمة المهام بعد الإضافة:', updated.length);
        return updated;
      });
      
      toast({
        title: "✅ تم بنجاح",
        description: `تم إضافة المهمة "${newTask.arabic_title}" بنجاح`,
        className: "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/50 text-white backdrop-blur-xl",
      });
    } catch (error) {
      console.error('خطأ في إضافة المهمة:', error);
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
      console.log('محاولة تحديث المهمة:', id, updates);
      
      const updatedTask = await tasksService.updateTask(id, updates);
      console.log('تم تحديث المهمة:', updatedTask);
      
      setTasks(prev => {
        const updated = prev.map(task => task.id === id ? updatedTask : task);
        console.log('قائمة المهام بعد التحديث:', updated.length);
        return updated;
      });
      
      toast({
        title: "✅ تم بنجاح",
        description: `تم تحديث المهمة "${updatedTask.arabic_title}" بنجاح`,
        className: "bg-gradient-to-r from-blue-500/90 to-indigo-500/90 border-blue-400/50 text-white backdrop-blur-xl",
      });
    } catch (error) {
      console.error('خطأ في تحديث المهمة:', error);
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
      console.log('محاولة حذف المهمة:', id);
      
      const taskToDelete = tasks.find(task => task.id === id);
      
      await tasksService.deleteTask(id);
      console.log('تم حذف المهمة من التخزين');
      
      setTasks(prev => {
        const updated = prev.filter(task => task.id !== id);
        console.log('قائمة المهام بعد الحذف:', updated.length);
        return updated;
      });
      
      // إزالة المهمة من قائمة المهام المكتملة أيضاً
      setCompletedTaskIds(prev => prev.filter(taskId => taskId !== id));
      
      toast({
        title: "🗑️ تم بنجاح",
        description: `تم حذف المهمة "${taskToDelete?.arabic_title || 'غير معروف'}" بنجاح`,
        className: "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50 text-white backdrop-blur-xl",
      });
    } catch (error) {
      console.error('خطأ في حذف المهمة:', error);
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
      console.log('محاولة تغيير حالة المهمة:', id);
      
      if (completedTaskIds.includes(id)) {
        await tasksService.uncompleteTask(id);
        setCompletedTaskIds(prev => prev.filter(taskId => taskId !== id));
        console.log('تم إلغاء إكمال المهمة');
      } else {
        await tasksService.completeTask(id);
        setCompletedTaskIds(prev => [...prev, id]);
        console.log('تم إكمال المهمة');
      }
    } catch (error) {
      console.error('خطأ في تغيير حالة المهمة:', error);
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
