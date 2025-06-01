
import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskInsert, TaskUpdate, UserTask } from '@/types/database';

export const tasksService = {
  // جلب جميع المهام
  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    return data || [];
  },

  // جلب المهام المكتملة من localStorage
  async getUserCompletedTasks(): Promise<string[]> {
    try {
      const completedTasks = localStorage.getItem('completed_tasks');
      return completedTasks ? JSON.parse(completedTasks) : [];
    } catch (error) {
      console.error('Error fetching completed tasks from localStorage:', error);
      return [];
    }
  },

  // إضافة مهمة جديدة
  async addTask(task: TaskInsert): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding task:', error);
      throw error;
    }
    
    return data;
  },

  // تحديث مهمة
  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    
    return data;
  },

  // حذف مهمة
  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // إكمال مهمة - حفظ في localStorage
  async completeTask(taskId: string): Promise<void> {
    try {
      const completedTasks = await this.getUserCompletedTasks();
      if (!completedTasks.includes(taskId)) {
        const updatedTasks = [...completedTasks, taskId];
        localStorage.setItem('completed_tasks', JSON.stringify(updatedTasks));
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // إلغاء إكمال مهمة - إزالة من localStorage
  async uncompleteTask(taskId: string): Promise<void> {
    try {
      const completedTasks = await this.getUserCompletedTasks();
      const updatedTasks = completedTasks.filter(id => id !== taskId);
      localStorage.setItem('completed_tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }
};
