import React, { useState } from 'react';
import { 
  Star, TrendingUp, DollarSign, Award, 
  ChevronRight, Calendar, PieChart, Trophy, 
  Target, AlertCircle, Lightbulb, ArrowUpRight,
  Clock, CheckCircle2, Zap, ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const incomeData = [
  { name: '周一', income: 360 },
  { name: '周二', income: 480 },
  { name: '周三', income: 240 },
  { name: '周四', income: 600 },
  { name: '周五', income: 480 },
  { name: '周六', income: 720 },
  { name: '周日', income: 600 },
];

const rankingData = [
  { name: '本人', value: 85, color: '#3b82f6' },
  { name: '张三', value: 98, color: '#e5e7eb' },
  { name: '李四', value: 92, color: '#e5e7eb' },
  { name: '王五', value: 88, color: '#e5e7eb' },
];

export default function Performance() {
  const [activeTab, setActiveTab] = useState<'income' | 'ranking' | 'kpi'>('income');

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      {/* Header Stats */}
      <div className="bg-blue-600 p-6 text-white rounded-b-[32px] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">运营效益分析</h2>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs flex items-center">
            <Calendar size={14} className="mr-1" /> 2026年4月
          </div>
        </div>
        
        <div className="flex items-end space-x-2 mb-1">
          <span className="text-3xl font-black">¥ 8,450.00</span>
          <span className="text-xs opacity-80 mb-1">本月预估总收益</span>
        </div>
        <div className="flex items-center text-xs opacity-80">
          <TrendingUp size={14} className="mr-1" /> 较上月同期增长 12.5%
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="bg-white p-1 rounded-2xl shadow-sm flex border border-gray-100">
          <TabButton 
            active={activeTab === 'income'} 
            onClick={() => setActiveTab('income')} 
            label="收益明细" 
            icon={<DollarSign size={16} />} 
          />
          <TabButton 
            active={activeTab === 'ranking'} 
            onClick={() => setActiveTab('ranking')} 
            label="荣誉排行" 
            icon={<Trophy size={16} />} 
          />
          <TabButton 
            active={activeTab === 'kpi'} 
            onClick={() => setActiveTab('kpi')} 
            label="绩效目标" 
            icon={<Target size={16} />} 
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'income' && (
            <motion.div
              key="income"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Income Breakdown */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <PieChart size={18} className="mr-2 text-blue-600" /> 提成结构拆解
                </h3>
                <div className="space-y-3">
                  <BreakdownItem label="基础服务费" amount="6,200.00" percentage={73} color="bg-blue-500" />
                  <BreakdownItem label="业务转化奖金" amount="1,850.00" percentage={22} color="bg-purple-500" subtitle="适老化改造线索转化" />
                  <BreakdownItem label="特殊时段补助" amount="400.00" percentage={5} color="bg-orange-500" subtitle="夜间/节假日津贴" />
                </div>
              </div>

              {/* Income Chart */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">本周收益趋势</h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={incomeData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Bills */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">实时账单流水</h3>
                  <button className="text-blue-600 text-xs font-bold flex items-center">
                    查看全部 <ChevronRight size={14} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  <BillItem title="助浴服务 (张爷爷)" time="今天 14:30" amount={45} type="SERVICE" />
                  <BillItem title="适老化改造线索成交奖金" time="昨天 11:20" amount={500} type="BONUS" />
                  <BillItem title="夜间陪诊补助" time="10-02 22:00" amount={120} type="SUBSIDY" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ranking' && (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Level Progress */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs opacity-70 uppercase tracking-widest mb-1">当前段位</div>
                    <div className="text-2xl font-black flex items-center">
                      金牌护理员 <Award className="ml-2 text-yellow-400" size={24} />
                    </div>
                  </div>
                  <div className="bg-white/20 p-2 rounded-2xl">
                    <Star size={24} className="text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>晋升进度 (专家级)</span>
                    <span>850 / 1000 积分</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                    />
                  </div>
                  <p className="text-[10px] opacity-60 italic text-center pt-1">
                    再获得 150 积分即可晋升为“专家级护理员”，解锁 1.2 倍收益加成
                  </p>
                </div>
              </div>

              {/* Ranking List */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800">服务单量榜 (区域)</h3>
                  <div className="flex space-x-2">
                    <button className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">周榜</button>
                    <button className="text-[10px] font-bold px-2 py-1 text-gray-400">月榜</button>
                  </div>
                </div>
                
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rankingData} layout="vertical" margin={{ left: -20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                        {rankingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Medals */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">荣誉勋章</h3>
                <div className="grid grid-cols-4 gap-4">
                  <Medal icon={<Zap size={20} />} label="服务王" active />
                  <Medal icon={<ShieldCheck size={20} />} label="零差评" active />
                  <Medal icon={<Clock size={20} />} label="准时达" active />
                  <Medal icon={<Star size={20} />} label="全能手" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'kpi' && (
            <motion.div
              key="kpi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* KPI Progress */}
              <div className="grid grid-cols-2 gap-4">
                <KPICard 
                  label="服务满意度" 
                  value="98.5%" 
                  target="90%" 
                  status="EXCELLENT" 
                  icon={<Star className="text-yellow-500" size={20} />} 
                />
                <KPICard 
                  label="任务完成率" 
                  value="96%" 
                  target="95%" 
                  status="GOOD" 
                  icon={<CheckCircle2 className="text-green-500" size={20} />} 
                />
              </div>

              {/* Bonus Prediction */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center">
                    <TrendingUp size={18} className="mr-2 text-green-600" /> 奖金预测模型
                  </h3>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">预估奖金: ¥800</span>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 p-2 rounded-xl text-white">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-blue-900 text-sm">阶梯奖金预告</div>
                      <p className="text-xs text-blue-700 mt-1">
                        本月已完成 45 单，再完成 <span className="font-bold text-blue-900">5 单</span> 即可触发“勤奋奖”阶梯奖励（额外 ¥200）。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">月度质量奖 (满意度&gt;95%)</span>
                    <span className="font-bold text-green-600">¥500</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">全勤奖励</span>
                    <span className="font-bold text-green-600">¥100</span>
                  </div>
                  <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> 潜在扣分项
                    </span>
                    <span className="text-xs font-bold text-gray-400">暂无违规</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis & Suggestions */}
              <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
                <h3 className="font-bold text-orange-900 mb-3 flex items-center">
                  <Lightbulb size={18} className="mr-2" /> 收益诊断建议
                </h3>
                <p className="text-sm text-orange-800 leading-relaxed">
                  您的好评率（98.5%）远超平均水平，但本周服务时长较短。建议开启 <span className="font-bold underline">“智能抢单”</span> 模式或在周末增加 4 小时排班，预计可提升本月收益约 <span className="font-bold">¥1,200</span>。
                </p>
                <button className="mt-4 w-full bg-orange-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 flex items-center justify-center">
                  立即优化排班 <ArrowUpRight size={18} className="ml-1" />
                </button>
              </div>

              {/* Lead Conversion Tracking */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">线索转化跟踪</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-black text-gray-800">12</div>
                    <div className="text-[10px] text-gray-400">发起报告</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-blue-600">5</div>
                    <div className="text-[10px] text-gray-400">实地勘测</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-green-600">3</div>
                    <div className="text-[10px] text-gray-400">成功成交</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-[10px] text-gray-500 text-center">
                  成交转化率 25%，高于全站平均水平 (15%)
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all duration-300 ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function BreakdownItem({ label, amount, percentage, color, subtitle }: { label: string, amount: string, percentage: number, color: string, subtitle?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-sm font-bold text-gray-800">{label}</div>
          {subtitle && <div className="text-[10px] text-gray-400">{subtitle}</div>}
        </div>
        <div className="text-sm font-black text-gray-800">¥{amount}</div>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function BillItem({ title, time, amount, type }: { title: string, time: string, amount: number, type: 'SERVICE' | 'BONUS' | 'SUBSIDY' }) {
  const colors = {
    SERVICE: 'text-blue-600 bg-blue-50',
    BONUS: 'text-purple-600 bg-purple-50',
    SUBSIDY: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl ${colors[type]}`}>
          {type === 'SERVICE' && <Clock size={16} />}
          {type === 'BONUS' && <TrendingUp size={16} />}
          {type === 'SUBSIDY' && <Calendar size={16} />}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">{title}</div>
          <div className="text-[10px] text-gray-400">{time}</div>
        </div>
      </div>
      <div className="text-sm font-black text-green-600">+¥{amount}</div>
    </div>
  );
}

function KPICard({ label, value, target, status, icon }: { label: string, value: string, target: string, status: 'EXCELLENT' | 'GOOD' | 'WARNING', icon: React.ReactNode }) {
  const statusColors = {
    EXCELLENT: 'text-green-600 bg-green-50 border-green-100',
    GOOD: 'text-blue-600 bg-blue-50 border-blue-100',
    WARNING: 'text-red-600 bg-red-50 border-red-100'
  };

  return (
    <div className={`bg-white p-4 rounded-3xl border shadow-sm ${statusColors[status]}`}>
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold uppercase opacity-70">{label}</span>
      </div>
      <div className="text-2xl font-black mb-1">{value}</div>
      <div className="text-[10px] opacity-60">目标: {target}</div>
    </div>
  );
}

function Medal({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className={`p-3 rounded-2xl transition-all ${
        active ? 'bg-yellow-100 text-yellow-600 shadow-sm border border-yellow-200' : 'bg-gray-50 text-gray-300 border border-gray-100 grayscale'
      }`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-gray-700' : 'text-gray-300'}`}>{label}</span>
    </div>
  );
}
