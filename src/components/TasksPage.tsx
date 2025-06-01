import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Star, Calendar, Users, TrendingUp, RefreshCw, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title_key: string;
  description_key: string;
  task_type: string;
  reward_amount: number;
  action_url?: string;
  completed: boolean;
}

const TasksPage = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title_key: 'Join Telegram Channel',
      description_key: 'Join our official Telegram channel to get the latest updates',
      task_type: 'telegram',
      reward_amount: 0.01,
      action_url: 'https://t.me/spacecoin',
      completed: false
    },
    {
      id: '2',
      title_key: 'Follow on Twitter',
      description_key: 'Follow our official Twitter account and get rewarded',
      task_type: 'twitter',
      reward_amount: 0.005,
      action_url: 'https://twitter.com/spacecoin',
      completed: false
    },
    {
      id: '3',
      title_key: 'Invite 5 Friends',
      description_key: 'Invite 5 friends to join the application',
      task_type: 'referral',
      reward_amount: 0.025,
      completed: false
    },
    {
      id: '4',
      title_key: 'Daily Login',
      description_key: 'Login daily to receive your reward',
      task_type: 'daily',
      reward_amount: 0.002,
      completed: false
    },
    {
      id: '5',
      title_key: 'Invite 20 Friends',
      description_key: 'Invite 20 friends to earn a massive 0.5 TON reward',
      task_type: 'referral',
      reward_amount: 0.5,
      completed: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'telegram',
    reward: 0,
    url: ''
  });

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        // Don't complete the "Invite 20 Friends" task
        if (task.id === '5') {
          toast({
            title: "Task in Progress",
            description: "Keep inviting more friends to complete this task!",
            variant: "destructive",
          });
          return;
        }

        setTasks(prevTasks => 
          prevTasks.map(t => 
            t.id === taskId ? { ...t, completed: true } : t
          )
        );

        toast({
          title: "Task Completed!",
          description: `You earned ${task.reward_amount} TON`,
        });
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error completing task",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadTasks = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleTitleClick = () => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    
    if (newCount === 5) {
      setShowAdminPanel(true);
      setTitleClickCount(0);
      toast({
        title: "Admin Panel Unlocked",
        description: "Welcome to the admin panel",
      });
    }
    
    setTimeout(() => {
      if (titleClickCount < 5) {
        setTitleClickCount(0);
      }
    }, 3000);
  };

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title_key: newTask.title,
      description_key: newTask.description,
      task_type: newTask.type,
      reward_amount: newTask.reward,
      action_url: newTask.url || undefined,
      completed: false
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', type: 'telegram', reward: 0, url: '' });
    setShowAddTaskModal(false);
    
    toast({
      title: "Task Added",
      description: "New task has been added successfully",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Task has been removed",
    });
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'telegram':
        return <Users className="w-4 h-4" />;
      case 'twitter':
        return <Star className="w-4 h-4" />;
      case 'referral':
        return <Users className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'daily':
        return 'border-blue-500 bg-blue-500/10';
      case 'telegram':
        return 'border-purple-500 bg-purple-500/10';
      case 'twitter':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'referral':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalRewards = tasks
    .filter(t => t.completed)
    .reduce((sum, t) => sum + t.reward_amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-3 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-3 cursor-pointer"
            onClick={handleTitleClick}
          >
            Tasks
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">Complete tasks and earn TON rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-green-400 text-2xl font-bold">{completedTasksCount}</p>
              <p className="text-green-300 text-sm">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 backdrop-blur-xl border-2 border-yellow-500/40 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-yellow-400 text-2xl font-bold">{totalRewards.toFixed(4)}</p>
              <p className="text-yellow-300 text-sm">TON Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={loadTasks}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Tasks
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No tasks available</p>
            </div>
          ) : (
            tasks.map(task => (
              <Card 
                key={task.id} 
                className={`backdrop-blur-xl border-2 ${getTaskTypeColor(task.task_type)} ${
                  task.completed ? 'opacity-60' : ''
                } rounded-2xl overflow-hidden`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-1">
                        {getTaskIcon(task.task_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-base leading-tight">
                          {task.title_key}
                        </CardTitle>
                      </div>
                      {showAdminPanel && (
                        <Button
                          onClick={() => handleDeleteTask(task.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-yellow-400 font-bold text-sm">+{task.reward_amount}</p>
                      <p className="text-yellow-400 text-xs">TON</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {task.description_key}
                  </p>
                  {task.action_url && (
                    <Button
                      onClick={() => window.open(task.action_url!, '_blank')}
                      variant="outline"
                      size="sm"
                      className="w-full mb-3 bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
                    >
                      Open Link
                    </Button>
                  )}
                  <Button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={task.completed}
                    className={`w-full h-12 text-sm font-medium ${
                      task.completed 
                        ? 'bg-green-600 hover:bg-green-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                    }`}
                  >
                    {task.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Complete Task'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Admin Panel */}
        {showAdminPanel && (
          <Card className="bg-gradient-to-br from-red-500/15 to-orange-500/15 backdrop-blur-xl border-2 border-red-500/40 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-center">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setShowAddTaskModal(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
              
              <div className="text-center text-white text-sm">
                <p>Total Tasks: {tasks.length}</p>
                <p>Completed: {completedTasksCount}</p>
                <p>Pending: {tasks.length - completedTasksCount}</p>
              </div>
              
              <Button
                onClick={() => setShowAdminPanel(false)}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Close Admin Panel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="glass-card border-white/20 text-white max-w-md bg-indigo-700">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <select
              value={newTask.type}
              onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 bg-white/10 border border-white/30 text-white rounded"
            >
              <option value="telegram">Telegram</option>
              <option value="twitter">Twitter</option>
              <option value="daily">Daily</option>
              <option value="referral">Referral</option>
            </select>
            
            <Input
              type="number"
              step="0.001"
              placeholder="Reward (TON)"
              value={newTask.reward}
              onChange={(e) => setNewTask(prev => ({ ...prev, reward: parseFloat(e.target.value) || 0 }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              placeholder="Action URL (optional)"
              value={newTask.url}
              onChange={(e) => setNewTask(prev => ({ ...prev, url: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Button
              onClick={handleAddTask}
              disabled={!newTask.title || !newTask.description || newTask.reward <= 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
