
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/contexts/TasksContext';
import { useMining } from '@/contexts/MiningContext';

const TasksPage = () => {
  const { toast } = useToast();
  const { tasks, completedTaskIds, isLoading, refreshTasks, completeTask } = useTasks();
  const { addTaskReward } = useMining();
  const [titleClickCount, setTitleClickCount] = useState(0);

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const wasCompleted = completedTaskIds.includes(taskId);
      await completeTask(taskId);
      
      // إذا كانت المهمة جديدة (لم تكن مكتملة من قبل)، أضف المكافأة
      if (!wasCompleted) {
        // تحويل المكافأة من النقاط إلى TON (100 نقطة = 0.05 TON)
        const tonReward = task.reward / 2000; // 100 نقطة = 0.05 TON
        await addTaskReward(tonReward);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTitleClick = () => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    
    if (newCount === 5) {
      // Navigate to admin panel through App.tsx logic
      setTitleClickCount(0);
    }
    
    setTimeout(() => {
      if (titleClickCount < 5) {
        setTitleClickCount(0);
      }
    }, 3000);
  };

  const getTaskIcon = (link: string | null) => {
    if (!link) return <TrendingUp className="w-4 h-4" />;
    if (link.includes('telegram')) return <Users className="w-4 h-4" />;
    if (link.includes('twitter')) return <Star className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  const getTaskTypeColor = (link: string | null) => {
    if (!link) return 'border-gray-500 bg-gray-500/10';
    if (link.includes('telegram')) return 'border-purple-500 bg-purple-500/10';
    if (link.includes('twitter')) return 'border-yellow-500 bg-yellow-500/10';
    return 'border-blue-500 bg-blue-500/10';
  };

  const visibleTasks = tasks.filter(task => !completedTaskIds.includes(task.id));
  const completedTasksCount = completedTaskIds.length;
  const totalTonEarned = completedTasksCount * 0.05; // كل مهمة = 0.05 TON

  return (
    <div className="min-h-screen p-3 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <h1 
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2 cursor-pointer"
            onClick={handleTitleClick}
          >
            Tasks
          </h1>
          <p className="text-gray-300 text-sm">Complete tasks and earn rewards</p>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border border-green-500/40 rounded-xl p-3 text-center">
            <p className="text-green-400 text-xl font-bold">{completedTasksCount}</p>
            <p className="text-green-300 text-xs">Completed</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 backdrop-blur-xl border border-yellow-500/40 rounded-xl p-3 text-center">
            <p className="text-yellow-400 text-xl font-bold">
              {totalTonEarned.toFixed(2)} TON
            </p>
            <p className="text-yellow-300 text-xs">Earned</p>
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={refreshTasks}
          variant="outline"
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 h-10"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Tasks
        </Button>

        {/* Simplified Tasks List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-400 py-6">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>Loading...</p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              <p>No tasks available</p>
            </div>
          ) : (
            visibleTasks.map(task => {
              const isCompleted = completedTaskIds.includes(task.id);
              const tonReward = task.reward / 2000; // تحويل النقاط إلى TON
              return (
                <Card 
                  key={task.id} 
                  className={`backdrop-blur-xl border ${getTaskTypeColor(task.link)} rounded-xl`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        {getTaskIcon(task.link)}
                        <h3 className="text-white text-sm font-medium">{task.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold text-sm">{tonReward.toFixed(2)} TON</p>
                      </div>
                    </div>
                    
                    {task.link && (
                      <Button
                        onClick={() => window.open(task.link!, '_blank')}
                        variant="outline"
                        size="sm"
                        className="w-full mb-2 bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30 h-8 text-xs"
                      >
                        Open Link
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={isCompleted}
                      className={`w-full h-10 text-sm ${
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
      </div>
    </div>
  );
};

export default TasksPage;
