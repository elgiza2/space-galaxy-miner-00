
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Plus, Edit, Trash2, Save, X, RefreshCw, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/contexts/TasksContext';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];

const TaskManagementPage = () => {
  const { toast } = useToast();
  const { tasks, isLoading, refreshTasks, addTask, updateTask, deleteTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<{
    title: string;
    arabic_title: string;
    description: string;
    arabic_description: string;
    reward: number;
    link: string;
    time_required: number;
    ton_reward?: number;
  }>({
    title: '',
    arabic_title: '',
    description: '',
    arabic_description: '',
    reward: 0,
    link: '',
    time_required: 5,
    ton_reward: 0
  });

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description || (newTask.reward <= 0 && (!newTask.ton_reward || newTask.ton_reward <= 0))) {
      toast({
        title: "Error",
        description: "Please fill all required fields and set a reward",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTask({
        title: newTask.title,
        arabic_title: newTask.title, // Use English title for Arabic as well
        description: newTask.description,
        arabic_description: newTask.description, // Use English description for Arabic as well
        reward: newTask.reward,
        link: newTask.link || null,
        time_required: newTask.time_required,
        completed: false,
        sort_order: tasks.length + 1
      });

      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      arabic_title: task.arabic_title,
      description: task.description,
      arabic_description: task.arabic_description,
      reward: task.reward,
      link: task.link || '',
      time_required: task.time_required,
      ton_reward: 0
    });
    setShowAddModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !newTask.title || !newTask.description || (newTask.reward <= 0 && (!newTask.ton_reward || newTask.ton_reward <= 0))) {
      toast({
        title: "Error",
        description: "Please fill all required fields and set a reward",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateTask(editingTask.id, {
        title: newTask.title,
        arabic_title: newTask.title, // Use English title for Arabic as well
        description: newTask.description,
        arabic_description: newTask.description, // Use English description for Arabic as well
        reward: newTask.reward,
        link: newTask.link || null,
        time_required: newTask.time_required
      });

      resetForm();
      setEditingTask(null);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      arabic_title: '',
      description: '',
      arabic_description: '',
      reward: 0,
      link: '',
      time_required: 5,
      ton_reward: 0
    });
  };

  const getTaskTypeColor = (link: string | null) => {
    if (!link) return 'bg-gray-500/20 text-gray-300';
    if (link.includes('telegram')) return 'bg-purple-500/20 text-purple-300';
    if (link.includes('twitter')) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-blue-500/20 text-blue-300';
  };

  const totalRewards = tasks.reduce((sum, task) => sum + task.reward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-3">
            إدارة المهام
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">إدارة وتكوين المهام للمستخدمين</p>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-br from-orange-500/15 to-red-500/15 backdrop-blur-xl border-2 border-orange-500/40 rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-orange-400 text-2xl font-bold">{tasks.length}</p>
                <p className="text-orange-300 text-sm">إجمالي المهام</p>
              </div>
              <div>
                <p className="text-red-400 text-2xl font-bold">{totalRewards}</p>
                <p className="text-red-300 text-sm">إجمالي المكافآت</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setShowAddModal(true)}
            className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            إضافة مهمة
          </Button>
          
          <Button
            onClick={refreshTasks}
            variant="outline"
            className="h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl font-semibold"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>جاري تحميل المهام...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>لا توجد مهام</p>
            </div>
          ) : (
            tasks.map(task => (
              <Card key={task.id} className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-gray-500/30 rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-base mb-1">{task.arabic_title}</CardTitle>
                      <div className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${getTaskTypeColor(task.link)}`}>
                        {task.link?.includes('telegram') ? 'تليجرام' : task.link?.includes('twitter') ? 'تويتر' : 'عام'}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-yellow-400 font-bold text-sm">+{task.reward}</p>
                      <p className="text-yellow-400 text-xs">نقطة</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm mb-3">{task.arabic_description}</p>
                  {task.link && (
                    <p className="text-blue-400 text-xs mb-3 break-all">{task.link}</p>
                  )}
                  <p className="text-gray-400 text-xs mb-3">الوقت المطلوب: {task.time_required} دقيقة</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditTask(task)}
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add/Edit Task Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="bg-gradient-to-br from-gray-900/95 to-slate-900/95 backdrop-blur-xl border border-gray-500/30 text-white max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Input
                placeholder="Task Title (English)"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <Input
                placeholder="Task Description (English)"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Points Reward"
                  value={newTask.reward}
                  onChange={(e) => setNewTask(prev => ({ ...prev, reward: parseInt(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                />
                
                <div className="relative">
                  <Button
                    onClick={() => setNewTask(prev => ({ ...prev, reward: 0, ton_reward: 0.05 }))}
                    variant="outline"
                    className="w-full bg-yellow-500/20 border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/30"
                  >
                    <Coins className="w-4 h-4 mr-1" />
                    0.05 TON
                  </Button>
                </div>
              </div>
              
              <Input
                placeholder="Link (Optional)"
                value={newTask.link}
                onChange={(e) => setNewTask(prev => ({ ...prev, link: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <Input
                type="number"
                placeholder="Time Required (minutes)"
                value={newTask.time_required}
                onChange={(e) => setNewTask(prev => ({ ...prev, time_required: parseInt(e.target.value) || 5 }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  disabled={!newTask.title || !newTask.description || (newTask.reward <= 0 && (!newTask.ton_reward || newTask.ton_reward <= 0))}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingTask ? 'Update' : 'Add'} Task
                </Button>
                <Button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskManagementPage;
