
import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskInsert, TaskUpdate } from '@/types/database';

export const supabaseTasksService = {
  // Get all tasks from the database
  async getAllTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Service error fetching tasks:', error);
      return [];
    }
  },

  // Get completed tasks for the current user
  async getUserCompletedTasks(userId: string): Promise<string[]> {
    try {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_tasks')
        .select('task_id')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching completed tasks:', error);
        // Don't throw here, just return empty array
        return [];
      }
      
      return data?.map(item => item.task_id) || [];
    } catch (error) {
      console.error('Service error fetching completed tasks:', error);
      return [];
    }
  },

  // Add a new task
  async addTask(taskData: TaskInsert): Promise<Task> {
    try {
      console.log('Inserting task data:', taskData);
      
      // Ensure all required fields are present
      const cleanTaskData = {
        title: taskData.title,
        arabic_title: taskData.arabic_title,
        description: taskData.description,
        arabic_description: taskData.arabic_description,
        reward: taskData.reward,
        link: taskData.link || null,
        time_required: taskData.time_required,
        completed: false, // Always false for new tasks
        sort_order: taskData.sort_order || null
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(cleanTaskData)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding task:', error);
        throw new Error(`Failed to add task: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from task creation');
      }
      
      return data;
    } catch (error) {
      console.error('Service error adding task:', error);
      throw error;
    }
  },

  // Update a task
  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    try {
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
      
      if (!data) {
        throw new Error('No data returned from task update');
      }
      
      return data;
    } catch (error) {
      console.error('Service error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    try {
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
    } catch (error) {
      console.error('Service error deleting task:', error);
      throw error;
    }
  },

  // Complete a task for a user
  async completeTask(userId: string, taskId: string): Promise<void> {
    try {
      if (!userId) {
        throw new Error('User ID is required to complete task');
      }

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
    } catch (error) {
      console.error('Service error completing task:', error);
      throw error;
    }
  },

  // Uncomplete a task for a user
  async uncompleteTask(userId: string, taskId: string): Promise<void> {
    try {
      if (!userId) {
        throw new Error('User ID is required to uncomplete task');
      }

      const { error } = await supabase
        .from('user_tasks')
        .delete()
        .eq('user_id', userId)
        .eq('task_id', taskId);
      
      if (error) {
        console.error('Error uncompleting task:', error);
        throw error;
      }
    } catch (error) {
      console.error('Service error uncompleting task:', error);
      throw error;
    }
  }
};
