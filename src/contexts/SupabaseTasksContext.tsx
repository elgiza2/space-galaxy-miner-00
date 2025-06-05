
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseTasksService } from '@/services/supabaseTasksService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData: TaskInsert) => {
    try {
      console.log('Adding new task:', taskData);
      
      const newTask = await supabaseTasksService.addTask(taskData);
      console.log('Task created:', newTask);
      
      setTasks(prev => {
        const updated = [...prev, newTask];
        console.log('Tasks list after addition:', updated.length);
        return updated;
      });
      
      toast({
        title: "✅ Success",
        description: `Task "${newTask.title}" added successfully`,
        className: "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/50 text-white backdrop-blur-xl",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
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
        title: "✅ Success",
        description: `Task "${updatedTask.title}" updated successfully`,
        className: "bg-gradient-to-r from-blue-500/90 to-indigo-500/90 border-blue-400/50 text-white backdrop-blur-xl",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
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
      
      // Remove task from completed list
      setCompletedTaskIds(prev => prev.filter(taskId => taskId !== id));
      
      toast({
        title: "🗑️ Success",
        description: `Task "${taskToDelete?.title || 'Unknown'}" deleted successfully`,
        className: "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50 text-white backdrop-blur-xl",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeTask = async (id: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please log in to complete tasks",
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
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (userId !== null) {
      refreshTasks();
    }
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
