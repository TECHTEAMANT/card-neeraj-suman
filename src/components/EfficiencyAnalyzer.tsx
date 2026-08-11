import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Calculator, Clock, TrendingUp, Zap, ChevronDown, ChevronUp, BarChart3, FileText, Wallet, ClipboardCheck, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profile } from "@/lib/profile";

interface TaskInput {
  value: string;
  mode: 'hours' | 'transactions';
}

interface AnalysisResult {
  taskName: string;
  manualTimeMinutes: number;
  automationTimeMinutes: number;
  efficiencyGain: number;
  icon: React.ElementType;
}

const EFFICIENCY_BENCHMARKS: Record<string, number> = {
  "Bank Entry": 93,
  "Purchase Processing": 79,
  "Sales Recording": 87,
  "Document Collection": 92,
  "MIS Reporting": 97,
};

const MANUAL_MIN_PER_TX: Record<string, number> = {
  "Bank Entry": 2.5,
  "Purchase Processing": 4.5,
  "Sales Recording": 3.0,
  "Document Collection": 2.0,
  "MIS Reporting": 60,
};

const STANDARD_TASKS = [
  { name: "Bank Entry", icon: Wallet, placeholder: "Monthly entries" },
  { name: "Purchase Processing", icon: FileText, placeholder: "Invoices/month" },
  { name: "Sales Recording", icon: BarChart3, placeholder: "Sales entries" },
  { name: "Document Collection", icon: ClipboardCheck, placeholder: "Documents" },
  { name: "MIS Reporting", icon: PieChart, placeholder: "Reports" },
];

const EfficiencyAnalyzer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [taskData, setTaskData] = useState<Record<string, TaskInput>>(
    STANDARD_TASKS.reduce((acc, task) => ({
      ...acc,
      [task.name]: { value: '', mode: 'transactions' }
    }), {})
  );

  const handleUpdateTask = (name: string, value: string) => {
    setTaskData(prev => ({ ...prev, [name]: { ...prev[name], value } }));
  };

  const handleToggleMode = (name: string) => {
    setTaskData(prev => ({
      ...prev,
      [name]: { 
        ...prev[name], 
        mode: prev[name].mode === 'hours' ? 'transactions' : 'hours', 
        value: '' 
      }
    }));
  };

  const analysisResults: AnalysisResult[] = useMemo(() => {
    return STANDARD_TASKS.map(task => {
      const input = taskData[task.name];
      if (!input.value || parseFloat(input.value) === 0) {
        return null;
      }

      let manualTimeMinutes: number;
      
      if (input.mode === 'hours') {
        // User entered time in hours per month
        manualTimeMinutes = parseFloat(input.value) * 60;
      } else {
        // User entered number of transactions
        const minPerTx = MANUAL_MIN_PER_TX[task.name] || 5;
        manualTimeMinutes = parseFloat(input.value) * minPerTx;
      }

      const efficiencyGain = EFFICIENCY_BENCHMARKS[task.name] || 80;
      const automationTimeMinutes = manualTimeMinutes * (1 - efficiencyGain / 100);

      return {
        taskName: task.name,
        manualTimeMinutes,
        automationTimeMinutes,
        efficiencyGain,
        icon: task.icon,
      };
    }).filter(Boolean) as AnalysisResult[];
  }, [taskData]);

  const stats = useMemo(() => {
    const totalManualMinutes = analysisResults.reduce((acc, r) => acc + r.manualTimeMinutes, 0);
    const totalAutoMinutes = analysisResults.reduce((acc, r) => acc + r.automationTimeMinutes, 0);
    const totalSavedMinutes = totalManualMinutes - totalAutoMinutes;
    const weightedEfficiency = totalManualMinutes > 0 
      ? (totalSavedMinutes / totalManualMinutes) * 100 
      : 0;

    return {
      totalManualHours: totalManualMinutes / 60,
      totalSavedHours: totalSavedMinutes / 60,
      totalSavedDays: totalSavedMinutes / 60 / 8,
      weightedEfficiency: Math.round(weightedEfficiency),
    };
  }, [analysisResults]);

  const canAnalyze = Object.values(taskData).some(t => t.value !== '' && parseFloat(t.value) > 0);

  const handleAnalyze = () => {
    if (canAnalyze) {
      setShowResults(true);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mx-4 mt-6"
    >
      <div className="glass-card overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-navy-light/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-gold/20 to-gold-light/20">
              <Calculator className="w-5 h-5 text-gold" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-foreground">
                Efficiency Analyzer
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Calculate your ROI with {
                  (profile.website_label || profile.company || "").toLowerCase().includes("accounts") ? (
                    <span className="text-[#653374] font-bold">accounts<span className="text-orange-400 font-bold">N</span>tax</span>
                  ) : (
                    profile.website_label || profile.company || "our solutions"
                  )
                }
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gold" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 pt-0 space-y-4">
                {/* Benchmark Info */}
                <div className="bg-navy-light/50 rounded-xl p-4 border border-gold/20">
                  <p className="text-[10px] font-semibold text-gold uppercase tracking-wide mb-3">
                    Industry Benchmarks
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank Entry</span>
                      <span className="text-gold font-bold">-93%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase</span>
                      <span className="text-gold font-bold">-79%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sales</span>
                      <span className="text-gold font-bold">-87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MIS</span>
                      <span className="text-gold font-bold">-97%</span>
                    </div>
                  </div>
                </div>

                {/* Task Inputs */}
                <div className="space-y-3">
                  {STANDARD_TASKS.map((task) => (
                    <div 
                      key={task.name}
                      className="flex items-center gap-3 p-3 rounded-xl bg-navy-light/30 border border-border/30"
                    >
                      <div className="p-2 rounded-lg bg-gold/10">
                        <task.icon className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {task.name}
                        </p>
                        <button
                          onClick={() => handleToggleMode(task.name)}
                          className="text-[9px] text-gold hover:text-gold-light transition-colors"
                        >
                          {taskData[task.name].mode === 'transactions' ? 'Switch to Hours' : 'Switch to Volume'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder={taskData[task.name].mode === 'hours' ? 'Hours' : 'Count'}
                          value={taskData[task.name].value}
                          onChange={(e) => handleUpdateTask(task.name, e.target.value)}
                          className="w-20 h-9 text-center text-sm bg-navy-lighter border-border/50 focus:border-gold"
                        />
                        <span className="text-[9px] text-muted-foreground w-8">
                          {taskData[task.name].mode === 'hours' ? 'hrs/mo' : 'txns'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="w-full gold-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Calculate My ROI
                </Button>

                {/* Results */}
                <AnimatePresence>
                  {showResults && analysisResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 pt-4 border-t border-border/30"
                    >
                      {/* Summary Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-xl bg-navy-light/50 border border-gold/20">
                          <Clock className="w-5 h-5 text-gold mx-auto mb-1" />
                          <p className="text-2xl font-bold gold-gradient-text">
                            {Math.round(stats.totalSavedHours)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">Hours Saved</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-navy-light/50 border border-gold/20">
                          <TrendingUp className="w-5 h-5 text-gold mx-auto mb-1" />
                          <p className="text-2xl font-bold gold-gradient-text">
                            {Math.round(stats.totalSavedDays)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">Days Saved</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-navy-light/50 border border-gold/20">
                          <Zap className="w-5 h-5 text-gold mx-auto mb-1" />
                          <p className="text-2xl font-bold gold-gradient-text">
                            {stats.weightedEfficiency}%
                          </p>
                          <p className="text-[9px] text-muted-foreground">Efficiency</p>
                        </div>
                      </div>

                      {/* Task Breakdown */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-gold uppercase tracking-wide">
                          Breakdown by Task
                        </p>
                        {analysisResults.map((result) => (
                          <div 
                            key={result.taskName}
                            className="flex items-center justify-between p-3 rounded-lg bg-navy-light/30"
                          >
                            <div className="flex items-center gap-2">
                              <result.icon className="w-4 h-4 text-gold" />
                              <span className="text-xs text-foreground">{result.taskName}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {(result.manualTimeMinutes / 60).toFixed(1)}h → {(result.automationTimeMinutes / 60).toFixed(1)}h
                              </p>
                              <p className="text-[10px] text-gold font-semibold">
                                -{result.efficiencyGain}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-center text-muted-foreground">
                        By automating with <span className="text-gold font-semibold">{profile.website_label || profile.company || "our solutions"}</span>, 
                        you save {Math.round(stats.totalSavedDays)} full work days every month.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default EfficiencyAnalyzer;
