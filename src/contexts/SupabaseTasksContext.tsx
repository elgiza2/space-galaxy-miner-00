import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseTasksService } from '@/services/supabaseTasksService';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import type { Task, TaskInsert, TaskUpdate } from '@/types/database';

interface SupabaseTasksContextType {
  tasks: Task[];
  completedTaskIds: string[];
  isLoading: boolean;
  userId: string | null;
  refreshTasks: () => Promise<void>;
  addTask: (task: TaskInsert) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

const SupabaseTasksContext = createContext<SupabaseTasksContextType | undefined>(undefined);

export const useSupabaseTasks = () => {
  const context = useContext(SupabaseTasksContext);
  if (!context) {
    throw new Error('useSupabaseTasks must be used within a SupabaseTasksProvider');
  }
  return context;
};

interface SupabaseTasksProviderProps {
  children: ReactNode;
}

export const SupabaseTasksProvider: React.FC<SupabaseTasksProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();

  // Get user ID from wallet address
  useEffect(() => {
    const getWalletUserId = () => {
      const wallet = tonConnectUI.wallet;
      if (wallet?.account?.address) {
        setUserId(wallet.account.address);
        console.log('User ID set from wallet:', wallet.account.address);
      } else {
        setUserId(null);
        console.log('No wallet connected');
      }
    };

    getWalletUserId();
    
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      if (wallet?.account?.address) {
        setUserId(wallet.account.address);
        console.log('User ID updated from wallet:', wallet.account.address);
      } else {
        setUserId(null);
        console.log('Wallet disconnected');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      console.log('Refreshing tasks from database...');
      
      const [tasksData, completedIds] = await Promise.all([
        supabaseTasksService.getAllTasks(),
        userId ? supabaseTasksService.getUserCompletedTasks(userId) : Promise.resolve([])
      ]);
      
      console.log('Fetched tasks:', tasksData.length);
      console.log('Completed tasks:', completedIds.length);
      
      setTasks(tasksData);
      setCompletedTaskIds(completedIds);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المهام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: TaskInsert) => {
    try {
      console.log('Adding new task:', taskData);
      
      // Validate required fields
      if (!taskData.title?.trim()) {
        throw new Error('العنوان مطلوب');
      }
      
      if (!taskData.arabic_title?.trim()) {
        throw new Error('العنوان بالعربية مطلوب');
      }
      
      if (!taskData.description?.trim()) {
        throw new Error('الوصف مطلوب');
      }

      if (!taskData.reward || taskData.reward <= 0) {
        throw new Error('المكافأة يجب أن تكون أكبر من صفر');
      }

      const newTask = await supabaseTasksService.addTask(taskData);
      console.log('Task created successfully:', newTask);
      
      setTasks(prev => {
        const updated = [...prev, newTask];
        console.log('Tasks list after addition:', updated.length);
        return updated;
      });
      
      toast({
        title: "✅ نجح",
        description: `تم إضافة المهمة "${newTask.title}" بنجاح`,
        className: "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/50 text-white backdrop-blur-xl",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      const errorMessage = error instanceof Error ? error.message : 'فشل في إضافة المهمة';
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    try {
      console.log('Updating task:', id, updates);
      
      const updatedTask = await supabaseTasksService.updateTask(id, updates);
      console.log('Task updated:', updatedTask);
      
      setTasks(prev => {
        const updated = prev.map(task => task.id === id ? updatedTask : task);
        console.log('Tasks list after update:', updated.length);
        return updated;
      });
      
      toast({
        title: "✅ نجح",
        description: `تم تحديث المهمة "${updatedTask.title}" بنجاح`,
        className: "bg-gradient-to-r from-blue-500/90 to-indigo-500/90 border-blue-400/50 text-white backdrop-blur-xl",
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
      console.log('Deleting task:', id);
      
      const taskToDelete = tasks.find(task => task.id === id);
      
      await supabaseTasksService.deleteTask(id);
      console.log('Task deleted from database');
      
      setTasks(prev => {
        const updated = prev.filter(task => task.id !== id);
        console.log('Tasks list after deletion:', updated.length);
        return updated;
      });
      
      setCompletedTaskIds(prev => prev.filter(taskId => taskId !== id));
      
      toast({
        title: "🗑️ نجح",
        description: `تم حذف المهمة "${taskToDelete?.title || 'غير معروف'}" بنجاح`,
        className: "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50 text-white backdrop-blur-xl",
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
    if (!userId) {
      toast({
        title: "خطأ",
        description: "يرجى ربط محفظتك لإكمال المهام",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Toggling task completion:', id);
      
      if (completedTaskIds.includes(id)) {
        await supabaseTasksService.uncompleteTask(userId, id);
        setCompletedTaskIds(prev => prev.filter(taskId => taskId !== id));
        console.log('Task uncompleted');
      } else {
        await supabaseTasksService.completeTask(userId, id);
        setCompletedTaskIds(prev => [...prev, id]);
        console.log('Task completed');
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
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
  }, [userId]);

  const value: SupabaseTasksContextType = {
    tasks,
    completedTaskIds,
    isLoading,
    userId,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask
  };

  return (
    <SupabaseTasksContext.Provider value={value}>
      {children}
    </SupabaseTasksContext.Provider>
  );
};
