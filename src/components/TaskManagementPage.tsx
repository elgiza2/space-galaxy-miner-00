
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTasks, Task } from '@/contexts/TasksContext';

const TaskManagementPage = () => {
  const { toast } = useToast();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    type: 'telegram' | 'twitter' | 'daily' | 'referral';
    reward: number;
    url: string;
  }>({
    title: '',
    description: '',
    type: 'telegram',
    reward: 0,
    url: ''
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.description || newTask.reward <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    addTask({
      title_key: newTask.title,
      description_key: newTask.description,
      task_type: newTask.type,
      reward_amount: newTask.reward,
      action_url: newTask.url || undefined
    });

    setNewTask({ title: '', description: '', type: 'telegram', reward: 0, url: '' });
    setShowAddModal(false);

    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title_key,
      description: task.description_key,
      type: task.task_type as 'telegram' | 'twitter' | 'daily' | 'referral',
      reward: task.reward_amount,
      url: task.action_url || ''
    });
    setShowAddModal(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !newTask.title || !newTask.description || newTask.reward <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    updateTask(editingTask.id, {
      title_key: newTask.title,
      description_key: newTask.description,
      task_type: newTask.type,
      reward_amount: newTask.reward,
      action_url: newTask.url || undefined
    });

    setEditingTask(null);
    setNewTask({ title: '', description: '', type: 'telegram', reward: 0, url: '' });
    setShowAddModal(false);

    toast({
      title: "Success",
      description: "Task updated successfully",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/20 text-blue-300';
      case 'telegram': return 'bg-purple-500/20 text-purple-300';
      case 'twitter': return 'bg-yellow-500/20 text-yellow-300';
      case 'referral': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

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
            Task Management
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">Manage and configure tasks for users</p>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-br from-orange-500/15 to-red-500/15 backdrop-blur-xl border-2 border-orange-500/40 rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-orange-400 text-2xl font-bold">{tasks.length}</p>
                <p className="text-orange-300 text-sm">Total Tasks</p>
              </div>
              <div>
                <p className="text-red-400 text-2xl font-bold">
                  {tasks.reduce((sum, task) => sum + task.reward_amount, 0).toFixed(3)}
                </p>
                <p className="text-red-300 text-sm">Total Rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Button */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Task
        </Button>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map(task => (
            <Card key={task.id} className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 backdrop-blur-xl border border-gray-500/30 rounded-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-base mb-1">{task.title_key}</CardTitle>
                    <div className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${getTaskTypeColor(task.task_type)}`}>
                      {task.task_type.toUpperCase()}
                    </div>
                    {task.completed && (
                      <div className="inline-block ml-2 px-2 py-1 rounded-lg text-xs font-semibold bg-green-500/20 text-green-300">
                        COMPLETED
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-yellow-400 font-bold text-sm">+{task.reward_amount}</p>
                    <p className="text-yellow-400 text-xs">TON</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 text-sm mb-3">{task.description_key}</p>
                {task.action_url && (
                  <p className="text-blue-400 text-xs mb-3 break-all">{task.action_url}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditTask(task)}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Task Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="bg-gradient-to-br from-gray-900/95 to-slate-900/95 backdrop-blur-xl border border-gray-500/30 text-white max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Input
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <Input
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <select
                value={newTask.type}
                onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value as 'telegram' | 'twitter' | 'daily' | 'referral' }))}
                className="w-full p-3 bg-white/10 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="telegram">Telegram</option>
                <option value="twitter">Twitter</option>
                <option value="daily">Daily</option>
                <option value="referral">Referral</option>
              </select>
              
              <Input
                type="number"
                step="0.001"
                placeholder="Reward Amount (TON)"
                value={newTask.reward}
                onChange={(e) => setNewTask(prev => ({ ...prev, reward: parseFloat(e.target.value) || 0 }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <Input
                placeholder="Action URL (optional)"
                value={newTask.url}
                onChange={(e) => setNewTask(prev => ({ ...prev, url: e.target.value }))}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  disabled={!newTask.title || !newTask.description || newTask.reward <= 0}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingTask ? 'Update' : 'Add'} Task
                </Button>
                <Button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTask(null);
                    setNewTask({ title: '', description: '', type: 'telegram', reward: 0, url: '' });
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
