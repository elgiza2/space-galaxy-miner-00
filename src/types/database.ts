
export interface Task {
  id: string;
  title: string;
  arabic_title: string;
  description: string;
  arabic_description: string;
  reward: number;
  link: string | null;
  time_required: number;
  completed: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface TaskInsert {
  title: string;
  arabic_title: string;
  description: string;
  arabic_description: string;
  reward: number;
  link?: string | null;
  time_required: number;
  completed?: boolean;
  sort_order?: number | null;
}

export interface TaskUpdate {
  title?: string;
  arabic_title?: string;
  description?: string;
  arabic_description?: string;
  reward?: number;
  link?: string | null;
  time_required?: number;
  completed?: boolean;
  sort_order?: number | null;
}

export interface UserTask {
  id: string;
  user_id: string; // Changed from uuid to string to support wallet addresses
  task_id: string;
  completed_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  ton_balance: number;
  mining_speed: number;
  mining_earnings: number;
  total_mined: number;
  has_deposited: boolean;
  has_free_package: boolean;
  friends_invited: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  name?: string | null;
  email?: string | null;
  ton_balance?: number;
  mining_speed?: number;
  mining_earnings?: number;
  total_mined?: number;
  has_deposited?: boolean;
  has_free_package?: boolean;
  friends_invited?: number;
}

export interface ProfileUpdate {
  name?: string | null;
  email?: string | null;
  ton_balance?: number;
  mining_speed?: number;
  mining_earnings?: number;
  total_mined?: number;
  has_deposited?: boolean;
  has_free_package?: boolean;
  friends_invited?: number;
}
