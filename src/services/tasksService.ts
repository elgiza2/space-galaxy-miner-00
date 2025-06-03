
import type { Task, TaskInsert, TaskUpdate } from '@/types/database';

// محاكاة قاعدة البيانات باستخدام localStorage
const TASKS_STORAGE_KEY = 'app_tasks';
const COMPLETED_TASKS_KEY = 'completed_tasks';

// دالة لتوليد معرف فريد
const generateId = () => {
  return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// دالة للحصول على المهام من localStorage
const getStoredTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error);
    return [];
  }
};

// دالة لحفظ المهام في localStorage
const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// تهيئة المهام الافتراضية إذا لم تكن موجودة
const initializeDefaultTasks = () => {
  const existingTasks = getStoredTasks();
  if (existingTasks.length === 0) {
    const defaultTasks: Task[] = [
      {
        id: generateId(),
        title: 'Join Telegram Channel',
        arabic_title: 'انضم إلى قناة التليجرام',
        description: 'Join our official Telegram channel for updates',
        arabic_description: 'انضم إلى قناتنا الرسمية على التليجرام للحصول على التحديثات',
        reward: 100,
        link: 'https://t.me/toncoin',
        time_required: 2,
        completed: false,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        title: 'Follow on Twitter',
        arabic_title: 'تابعنا على تويتر',
        description: 'Follow our Twitter account for latest news',
        arabic_description: 'تابع حسابنا على تويتر للحصول على آخر الأخبار',
        reward: 50,
        link: 'https://twitter.com/ton_blockchain',
        time_required: 1,
        completed: false,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        title: 'Daily Check-in',
        arabic_title: 'تسجيل الدخول اليومي',
        description: 'Complete your daily check-in',
        arabic_description: 'أكمل تسجيل الدخول اليومي',
        reward: 25,
        link: null,
        time_required: 1,
        completed: false,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    saveTasksToStorage(defaultTasks);
  }
};

export const tasksService = {
  // جلب جميع المهام
  async getAllTasks(): Promise<Task[]> {
    initializeDefaultTasks();
    return getStoredTasks();
  },

  // جلب المهام المكتملة من localStorage
  async getUserCompletedTasks(): Promise<string[]> {
    try {
      const completedTasks = localStorage.getItem(COMPLETED_TASKS_KEY);
      return completedTasks ? JSON.parse(completedTasks) : [];
    } catch (error) {
      console.error('Error fetching completed tasks from localStorage:', error);
      return [];
    }
  },

  // إضافة مهمة جديدة
  async addTask(taskData: TaskInsert): Promise<Task> {
    const tasks = getStoredTasks();
    const newTask: Task = {
      id: generateId(),
      title: taskData.title,
      arabic_title: taskData.arabic_title,
      description: taskData.description,
      arabic_description: taskData.arabic_description,
      reward: taskData.reward,
      link: taskData.link || null,
      time_required: taskData.time_required,
      completed: taskData.completed || false,
      sort_order: taskData.sort_order || (tasks.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    return newTask;
  },

  // تحديث مهمة
  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    saveTasksToStorage(tasks);
    return updatedTask;
  },

  // حذف مهمة
  async deleteTask(id: string): Promise<void> {
    const tasks = getStoredTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage(filteredTasks);
    
    // أيضاً إزالة المهمة من قائمة المهام المكتملة إذا كانت موجودة
    const completedTasks = await this.getUserCompletedTasks();
    const updatedCompletedTasks = completedTasks.filter(taskId => taskId !== id);
    localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompletedTasks));
  },

  // إكمال مهمة - حفظ في localStorage
  async completeTask(taskId: string): Promise<void> {
    try {
      const completedTasks = await this.getUserCompletedTasks();
      if (!completedTasks.includes(taskId)) {
        const updatedTasks = [...completedTasks, taskId];
        localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedTasks));
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
      localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }
};
