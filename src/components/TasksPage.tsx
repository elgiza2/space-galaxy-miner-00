
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Calendar, Users, TrendingUp, RefreshCw, Gift, Trophy, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseTasks } from '@/contexts/SupabaseTasksContext';
import { useMining } from '@/contexts/MiningContext';

const TasksPage = () => {
  const { toast } = useToast();
  const { tasks, completedTaskIds, isLoading, refreshTasks, completeTask, userId } = useSupabaseTasks();
  const { addTaskReward } = useMining();
  const [titleClickCount, setTitleClickCount] = useState(0);

  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const wasCompleted = completedTaskIds.includes(taskId);
      await completeTask(taskId);
      
      if (!wasCompleted) {
        const tonReward = task.reward / 2000;
        await addTaskReward(tonReward);
        
        toast({
          title: "🎉 Congratulations!",
          description: `You earned ${tonReward.toFixed(2)} TON`,
          className: "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/50 text-white backdrop-blur-xl",
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
      setTitleClickCount(0);
    }
    
    setTimeout(() => {
      if (titleClickCount < 5) {
        setTitleClickCount(0);
      }
    }, 3000);
  };

  const getTaskIcon = (link: string | null) => {
    if (!link) return <Gift className="w-5 h-5 text-orange-400" />;
    if (link.includes('telegram')) return <Users className="w-5 h-5 text-blue-400" />;
    if (link.includes('twitter')) return <Star className="w-5 h-5 text-sky-400" />;
    return <Calendar className="w-5 h-5 text-purple-400" />;
  };

  const getTaskTypeColor = (link: string | null) => {
    if (!link) return 'border-orange-500/40 bg-gradient-to-br from-orange-500/10 to-amber-500/10';
    if (link.includes('telegram')) return 'border-blue-500/40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10';
    if (link.includes('twitter')) return 'border-sky-500/40 bg-gradient-to-br from-sky-500/10 to-cyan-500/10';
    return 'border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-pink-500/10';
  };

  const visibleTasks = tasks.filter(task => !completedTaskIds.includes(task.id));
  const completedTasksCount = completedTaskIds.length;
  const totalEarned = (completedTasksCount * 0.05).toFixed(2);

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg mx-auto">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Connect Your Wallet
          </h1>
          <p className="text-gray-400 text-lg">
            Please connect your TON wallet to access daily tasks and start earning rewards
          </p>
          <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-xl border border-gray-500/30 rounded-xl p-6">
            <p className="text-gray-300 text-sm">
              Once connected, you'll be able to:
            </p>
            <ul className="text-gray-300 text-sm mt-2 space-y-1">
              <li>• Complete daily tasks</li>
              <li>• Earn TON rewards</li>
              <li>• Track your progress</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 space-y-4 relative bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-md mx-auto space-y-4 relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent cursor-pointer"
            onClick={handleTitleClick}
          >
            Daily Tasks
          </h1>
          <p className="text-gray-400 text-sm mt-2">Complete tasks and earn TON rewards</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-400/5 rounded-xl"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-400 mr-2" />
                <p className="text-emerald-400 text-2xl font-bold">{completedTasksCount}</p>
              </div>
              <p className="text-emerald-300 text-sm">Completed Tasks</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 rounded-xl"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <Gift className="w-6 h-6 text-yellow-400 mr-2" />
                <p className="text-yellow-400 text-2xl font-bold">{totalEarned}</p>
              </div>
              <p className="text-yellow-300 text-sm">TON Earned</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-400" />
              <p className="text-lg">Loading tasks...</p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <p className="text-lg">No tasks available</p>
              <p className="text-sm mt-2">Check back later for more tasks</p>
            </div>
          ) : (
            visibleTasks.map((task, index) => {
              const isCompleted = completedTaskIds.includes(task.id);
              const tonReward = (task.reward / 2000).toFixed(2);
              return (
                <Card 
                  key={task.id} 
                  className={`relative overflow-hidden backdrop-blur-xl border ${getTaskTypeColor(task.link)} rounded-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50"></div>
                  <CardContent className="relative p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">
                          {getTaskIcon(task.link)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-base font-semibold mb-1 truncate">{task.title}</h3>
                          {task.description && (
                            <p className="text-gray-300 text-sm opacity-80 line-clamp-2">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold px-3 py-1 rounded-full">
                          {tonReward} TON
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {task.link && (
                        <Button
                          onClick={() => window.open(task.link!, '_blank')}
                          variant="outline"
                          size="sm"
                          className="w-full bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 h-9 text-sm transition-all duration-200"
                        >
                          Open Link
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={isCompleted}
                        className={`w-full h-10 text-sm font-semibold transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-600 cursor-default' 
                            : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 hover:scale-105 shadow-lg'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed ✨
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4 mr-2" />
                            Complete Task
                          </>
                        )}
                      </Button>
                    </div>
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
