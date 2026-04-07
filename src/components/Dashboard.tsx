import React from 'react';
import { 
  Bell, Calendar, CheckCircle2, ChevronRight, Clock, 
  DollarSign, HeartPulse, LayoutGrid, MapPin, 
  ShieldAlert, Star, TrendingUp, User, Wrench, ClipboardCheck,
  PlusCircle, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task, Alarm, AlarmStatus, AssessmentType } from '../types';
import { TaskState } from '../lib/stateMachine';

interface DashboardProps {
  activeTask: Task | null;
  activeAlarms: Alarm[];
  onNavigate: (tab: any) => void;
  onSelectAlarm: (alarm: Alarm) => void;
  onStartAssessment: (type: AssessmentType) => void;
}

export default function Dashboard({ activeTask, activeAlarms, onNavigate, onSelectAlarm, onStartAssessment }: DashboardProps) {
  const criticalAlarms = activeAlarms.filter(a => a.level === 'CRITICAL' && a.status !== AlarmStatus.RESOLVED);

  return (
    <div className="pb-6 space-y-6">
      {/* Top Profile & Stats */}
      <div className="bg-blue-600 pt-4 pb-12 px-4 rounded-b-[40px] text-white shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-blue-300 overflow-hidden bg-white">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
            <div>
              <div className="text-xs opacity-80">早安，李师傅</div>
              <div className="font-bold text-lg flex items-center">
                在线接单中
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <button className="p-2 bg-blue-500/50 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl py-3">
            <div className="text-xl font-black">12</div>
            <div className="text-[10px] opacity-70 uppercase tracking-wider">今日工单</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl py-3">
            <div className="text-xl font-black">¥480</div>
            <div className="text-[10px] opacity-70 uppercase tracking-wider">今日收入</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl py-3">
            <div className="text-xl font-black">4.9</div>
            <div className="text-[10px] opacity-70 uppercase tracking-wider">综合评分</div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="px-4 -mt-8 space-y-5">
        
        {/* Critical Alarms (Conditional) */}
        {criticalAlarms.length > 0 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-500 rounded-3xl p-4 text-white shadow-xl shadow-red-200 flex items-center justify-between"
            onClick={() => onSelectAlarm(criticalAlarms[0])}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full animate-bounce">
                <ShieldAlert size={24} />
              </div>
              <div>
                <div className="font-bold text-sm">特级紧急警报！</div>
                <div className="text-xs opacity-90">{criticalAlarms[0].patientName} - {criticalAlarms[0].type === 'FALL' ? '疑似跌倒' : 'SOS呼救'}</div>
              </div>
            </div>
            <button className="bg-white text-red-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
              立即接警
            </button>
          </motion.div>
        )}

        {/* Quick Assessment Entry Points */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartAssessment('ADL')}
            className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3"
          >
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <HeartPulse size={24} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-400 font-medium">发起</div>
              <div className="font-bold text-gray-800 text-sm">能力评估</div>
            </div>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartAssessment('ENVIRONMENT')}
            className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3"
          >
            <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-400 font-medium">发起</div>
              <div className="font-bold text-gray-800 text-sm">环境评估</div>
            </div>
          </motion.button>
        </div>

        {/* Current Active Task */}
        {activeTask && activeTask.state !== TaskState.COMPLETED ? (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase">正在执行中</div>
                  <div className="font-bold text-gray-800">{activeTask.title}</div>
                </div>
              </div>
              <span className="text-blue-600 font-bold text-sm">¥{activeTask.reward}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{activeTask.address}</span>
            </div>
            <button 
              onClick={() => onNavigate('active')}
              className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center"
            >
              继续执行流程 <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center border-dashed border-2">
            <div className="text-gray-400 text-sm mb-2">当前暂无执行中的工单</div>
            <button 
              onClick={() => onNavigate('hall')}
              className="text-blue-600 font-bold text-sm flex items-center justify-center mx-auto"
            >
              前往任务大厅抢单 <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Quick Menu Grid */}
        <div className="grid grid-cols-4 gap-4">
          <MenuIcon icon={<LayoutGrid size={24} />} label="任务大厅" color="bg-blue-50 text-blue-600" onClick={() => onNavigate('hall')} />
          <MenuIcon icon={<ShieldAlert size={24} />} label="警报中心" color="bg-red-50 text-red-600" onClick={() => onNavigate('alarm')} />
          <MenuIcon icon={<ClipboardCheck size={24} />} label="评估记录" color="bg-purple-50 text-purple-600" onClick={() => onNavigate('assessment')} />
          <MenuIcon icon={<TrendingUp size={24} />} label="绩效统计" color="bg-orange-50 text-orange-600" onClick={() => onNavigate('performance')} />
        </div>

        {/* Recommended Tasks */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-gray-800">推荐工单</h3>
            <button onClick={() => onNavigate('hall')} className="text-xs text-blue-600 font-bold">查看全部</button>
          </div>
          
          <div className="space-y-3">
            <TaskPreviewCard 
              title="压疮护理与助浴" 
              patient="张爷爷" 
              distance="2.1km" 
              reward={120} 
              type="CARE" 
            />
            <TaskPreviewCard 
              title="毫米波雷达离线检修" 
              patient="卧室雷达" 
              distance="4.5km" 
              reward={80} 
              type="MAINTENANCE" 
            />
          </div>
        </div>

        {/* Performance Snapshot */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-5 text-white shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp size={18} className="text-green-400" />
              <span className="text-sm font-bold">本月服务趋势</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">更新于 10:00</span>
          </div>
          <div className="flex items-end space-x-2 mb-2">
            <div className="text-2xl font-black">¥ 8,450</div>
            <div className="text-xs text-green-400 mb-1 flex items-center">
              <TrendingUp size={12} className="mr-0.5" /> +12.5%
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] opacity-50">
            <span>本月目标: ¥ 10,000</span>
            <span>75%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuIcon({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center space-y-2 group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold text-gray-600">{label}</span>
    </button>
  );
}

function TaskPreviewCard({ title, patient, distance, reward, type }: { title: string, patient: string, distance: string, reward: number, type: 'CARE' | 'MAINTENANCE' }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl ${type === 'CARE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
          {type === 'CARE' ? <HeartPulse size={20} /> : <Wrench size={20} />}
        </div>
        <div>
          <div className="font-bold text-gray-800 text-sm">{title}</div>
          <div className="text-[10px] text-gray-400 flex items-center mt-0.5">
            <User size={10} className="mr-1" /> {patient} 
            <span className="mx-1.5">•</span>
            <MapPin size={10} className="mr-1" /> {distance}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-black text-red-500">¥{reward}</div>
        <div className="text-[10px] text-blue-600 font-bold mt-0.5">抢单</div>
      </div>
    </div>
  );
}
