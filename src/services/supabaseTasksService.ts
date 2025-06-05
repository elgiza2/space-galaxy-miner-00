
import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskInsert, TaskUpdate } from '@/types/database';

export const supabaseTasksService = {
  // Get all tasks from the database
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

  // Get completed tasks for the current user
  async getUserCompletedTasks(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_tasks')
      .select('task_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching completed tasks:', error);
      throw error;
    }
    
    return data?.map(item => item.task_id) || [];
  },

  // Add a new task
  async addTask(taskData: TaskInsert): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding task:', error);
      throw error;
    }
    
    return data;
  },

  // Update a task
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

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    // First delete any user completions for this task
    await supabase
      .from('user_tasks')
      .delete()
      .eq('task_id', id);

    // Then delete the task itself
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Complete a task for a user
  async completeTask(userId: string, taskId: string): Promise<void> {
    const { error } = await supabase
      .from('user_tasks')
      .insert({
        user_id: userId,
        task_id: taskId
      });
    
    if (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  // Uncomplete a task for a user
  async uncompleteTask(userId: string, taskId: string): Promise<void> {
    const { error } = await supabase
      .from('user_tasks')
      .delete()
      .eq('user_id', userId)
      .eq('task_id', taskId);
    
    if (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }
};
