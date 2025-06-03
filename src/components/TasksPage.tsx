
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Calendar, Users, TrendingUp, RefreshCw, Gift, Trophy } from 'lucide-react';
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
      
      if (!wasCompleted) {
        const tonReward = task.reward / 2000;
        await addTaskReward(tonReward);
        
        toast({
          title: "🎉 تهانينا!",
          description: `حصلت على ${tonReward.toFixed(2)} TON`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header with improved design */}
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
            المهام اليومية
          </h1>
          <p className="text-gray-400 text-sm mt-2">أكمل المهام واحصل على مكافآت TON</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-400/5 rounded-xl"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-400 mr-2" />
                <p className="text-emerald-400 text-2xl font-bold">{completedTasksCount}</p>
              </div>
              <p className="text-emerald-300 text-sm">مهام مكتملة</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 rounded-xl"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <Gift className="w-6 h-6 text-yellow-400 mr-2" />
                <p className="text-yellow-400 text-2xl font-bold">{totalEarned}</p>
              </div>
              <p className="text-yellow-300 text-sm">TON مكتسب</p>
            </div>
          </div>
        </div>

        {/* Enhanced Tasks List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-400" />
              <p className="text-lg">جارٍ تحميل المهام...</p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <p className="text-lg">لا توجد مهام متاحة</p>
              <p className="text-sm mt-2">تحقق لاحقاً للمزيد من المهام</p>
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
                          فتح الرابط
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
                            مكتملة ✨
                          </>
                        ) : (
                          <>
                            <Gift className="w-4 h-4 mr-2" />
                            إكمال المهمة
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
