
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Star, Calendar, Users, TrendingUp, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/contexts/TasksContext';

const TasksPage = () => {
  const { toast } = useToast();
  const { tasks, completedTaskIds, isLoading, refreshTasks, completeTask, addTask, deleteTask } = useTasks();
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    arabic_title: '',
    description: '',
    arabic_description: '',
    reward: 0,
    link: '',
    time_required: 5
  });

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (task && !completedTaskIds.includes(taskId)) {
        toast({
          title: "Task Completed!",
          description: `You earned ${task.reward} points`,
        });
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTitleClick = () => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    
    if (newCount === 5) {
      setShowAdminPanel(true);
      setTitleClickCount(0);
      toast({
        title: "Admin Panel Opened",
        description: "Welcome to the admin panel",
      });
    }
    
    setTimeout(() => {
      if (titleClickCount < 5) {
        setTitleClickCount(0);
      }
    }, 3000);
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.arabic_title || !newTask.description || !newTask.arabic_description) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTask({
        title: newTask.title,
        arabic_title: newTask.arabic_title,
        description: newTask.description,
        arabic_description: newTask.arabic_description,
        reward: newTask.reward,
        link: newTask.link || null,
        time_required: newTask.time_required,
        completed: false,
        sort_order: tasks.length + 1
      });
      
      setNewTask({
        title: '',
        arabic_title: '',
        description: '',
        arabic_description: '',
        reward: 0,
        link: '',
        time_required: 5
      });
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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

  const getTaskTypeColor = (link: string | null) => {
    if (!link) return 'border-gray-500 bg-gray-500/10';
    if (link.includes('telegram')) return 'border-purple-500 bg-purple-500/10';
    if (link.includes('twitter')) return 'border-yellow-500 bg-yellow-500/10';
    return 'border-blue-500 bg-blue-500/10';
  };

  // Filter out completed tasks for regular users
  const visibleTasks = showAdminPanel ? tasks : tasks.filter(task => !completedTaskIds.includes(task.id));
  const completedTasksCount = completedTaskIds.length;
  const totalRewards = tasks
    .filter(t => completedTaskIds.includes(t.id))
    .reduce((sum, t) => sum + t.reward, 0);

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
              <p className="text-yellow-400 text-2xl font-bold">{totalRewards}</p>
              <p className="text-yellow-300 text-sm">Points Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={refreshTasks}
          variant="outline"
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Tasks
        </Button>

        {/* Tasks List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading tasks...</p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No tasks available</p>
            </div>
          ) : (
            visibleTasks.map(task => {
              const isCompleted = completedTaskIds.includes(task.id);
              return (
                <Card 
                  key={task.id} 
                  className={`backdrop-blur-xl border-2 ${getTaskTypeColor(task.link)} ${
                    isCompleted ? 'opacity-60' : ''
                  } rounded-2xl overflow-hidden`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1">
                          {getTaskIcon(task.link?.includes('telegram') ? 'telegram' : task.link?.includes('twitter') ? 'twitter' : 'default')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-white text-base leading-tight">
                            {task.title}
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
                        <p className="text-yellow-400 font-bold text-sm">+{task.reward}</p>
                        <p className="text-yellow-400 text-xs">Points</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                      {task.description}
                    </p>
                    {task.link && (
                      <Button
                        onClick={() => window.open(task.link!, '_blank')}
                        variant="outline"
                        size="sm"
                        className="w-full mb-3 bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
                      >
                        Open Link
                      </Button>
                    )}
                    <Button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={isCompleted}
                      className={`w-full h-12 text-sm font-medium ${
                        isCompleted 
                          ? 'bg-green-600 hover:bg-green-600' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                      }`}
                    >
                      {isCompleted ? (
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
              );
            })
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
              placeholder="English Title"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              placeholder="Arabic Title"
              value={newTask.arabic_title}
              onChange={(e) => setNewTask(prev => ({ ...prev, arabic_title: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              placeholder="English Description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              placeholder="Arabic Description"
              value={newTask.arabic_description}
              onChange={(e) => setNewTask(prev => ({ ...prev, arabic_description: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              type="number"
              placeholder="Reward (points)"
              value={newTask.reward}
              onChange={(e) => setNewTask(prev => ({ ...prev, reward: parseInt(e.target.value) || 0 }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              placeholder="Link (optional)"
              value={newTask.link}
              onChange={(e) => setNewTask(prev => ({ ...prev, link: e.target.value }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Input
              type="number"
              placeholder="Time required (minutes)"
              value={newTask.time_required}
              onChange={(e) => setNewTask(prev => ({ ...prev, time_required: parseInt(e.target.value) || 5 }))}
              className="bg-white/10 border-white/30 text-white"
            />
            
            <Button
              onClick={handleAddTask}
              disabled={!newTask.title || !newTask.arabic_title || !newTask.description || !newTask.arabic_description}
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
