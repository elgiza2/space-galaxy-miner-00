
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

  // جلب المهام المكتملة للمستخدم الحالي
  async getUserCompletedTasks(): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching completed tasks:', error);
      return [];
    }
    
    return data?.map(item => item.task_id) || [];
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

  // إكمال مهمة
  async completeTask(taskId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_tasks')
      .insert({
        task_id: taskId,
        user_id: user.id
      });
    
    if (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // إلغاء إكمال مهمة
  async uncompleteTask(taskId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_tasks')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }
};
