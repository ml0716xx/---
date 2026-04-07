import React, { useState } from 'react';
import { ChevronLeft, Send, CheckCircle2, AlertCircle, TrendingUp, Package, Plus, Minus, FileText, Bell } from 'lucide-react';
import { Assessment, AssessmentStatus } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

const RADAR_DATA = [
  { subject: '进食', A: 10, B: 8, fullMark: 10 },
  { subject: '洗澡', A: 5, B: 2, fullMark: 10 },
  { subject: '行走', A: 15, B: 10, fullMark: 15 },
  { subject: '穿衣', A: 10, B: 5, fullMark: 10 },
  { subject: '如厕', A: 10, B: 8, fullMark: 10 },
  { subject: '上下床', A: 15, B: 12, fullMark: 15 },
];

const CARE_PACKAGES = [
  { 
    id: 'PKG-001', 
    name: '轻度失能照护包', 
    items: [
      { name: '助浴服务', freq: '1次/周', price: 120 },
      { name: '日常保洁', freq: '2次/周', price: 80 },
      { name: '健康监测', freq: '每日', price: 30 }
    ]
  },
  { 
    id: 'PKG-002', 
    name: '中度失能照护包', 
    items: [
      { name: '助浴服务', freq: '2次/周', price: 120 },
      { name: '助餐服务', freq: '每日', price: 45 },
      { name: '康复训练', freq: '3次/周', price: 150 }
    ]
  }
];

export default function AssessmentResult({ assessment, onBack, onSubmit }: { assessment: Assessment, onBack: () => void, onSubmit: (a: Assessment) => void }) {
  const [selectedPackage, setSelectedPackage] = useState(CARE_PACKAGES[0]);
  const [customItems, setCustomItems] = useState(selectedPackage.items);

  const handleAdjustFreq = (index: number, delta: number) => {
    const newItems = [...customItems];
    const item = newItems[index];
    const currentFreq = parseInt(item.freq) || 1;
    const newFreq = Math.max(1, currentFreq + delta);
    newItems[index] = { ...item, freq: `${newFreq}次/周` };
    setCustomItems(newItems);
  };

  const getLevelInfo = (level?: string) => {
    switch (level) {
      case 'SELF_CARE': return { label: '自理', color: 'text-green-600', bg: 'bg-green-50', desc: '各项机能良好，侧重于预防性维护与文娱。' };
      case 'MILD_MODERATE': return { label: '轻/中度失能', color: 'text-orange-600', bg: 'bg-orange-50', desc: '存在部分功能障碍，需要特定生活协助。' };
      case 'SEVERE': return { label: '重度失能', color: 'text-red-600', bg: 'bg-red-50', desc: '完全依赖他人照料，触发高强度护理预案。' };
      default: return { label: '未知', color: 'text-gray-600', bg: 'bg-gray-50', desc: '' };
    }
  };

  const levelInfo = getLevelInfo(assessment.level);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b border-gray-200 sticky top-0 z-30">
        <button onClick={onBack} className="p-1 -ml-1 mr-2 text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">评估报告与建议</h2>
          <p className="text-[10px] text-gray-500">流水号: {assessment.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
        {/* Score & Level Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-400 mb-1">评估总分</div>
          <div className="text-5xl font-black text-blue-600 mb-4">{assessment.totalScore}</div>
          
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full font-bold text-sm ${levelInfo.bg} ${levelInfo.color} mb-3`}>
            等级: {levelInfo.label}
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed px-4">
            {levelInfo.desc}
          </p>
        </div>

        {/* Trend Radar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp size={18} className="mr-2 text-blue-500" />
            能力维度趋势对比
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid stroke="#f3f4f6" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <PolarRadiusAxis angle={30} domain={[0, 15]} tick={false} axisLine={false} />
                <Radar
                  name="当前评估"
                  dataKey="B"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="历史平均"
                  dataKey="A"
                  stroke="#9ca3af"
                  fill="#9ca3af"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] text-gray-500">当前评估</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span className="text-[10px] text-gray-500">历史平均</span>
            </div>
          </div>
        </div>

        {/* Care Package Recommendation */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Package size={18} className="mr-2 text-orange-500" />
            智能照护建议
          </h3>
          
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4">
            <div className="text-xs font-bold text-orange-800 mb-1">推荐套餐: {selectedPackage.name}</div>
            <p className="text-[10px] text-orange-600">基于失能等级算法，自动匹配最优照护方案。</p>
          </div>

          <div className="space-y-3">
            {customItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <div className="text-sm font-bold text-gray-800">{item.name}</div>
                  <div className="text-[10px] text-gray-500">指导价: ¥{item.price}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => handleAdjustFreq(i, -1)} className="p-1 bg-white border border-gray-200 rounded-md text-gray-400">
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold text-blue-600 w-12 text-center">{item.freq}</span>
                  <button onClick={() => handleAdjustFreq(i, 1)} className="p-1 bg-white border border-gray-200 rounded-md text-gray-400">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Archive Linkage Info */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 space-y-3">
          <div className="flex items-start space-x-3">
            <FileText size={18} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-blue-800">全息画像同步</h4>
              <p className="text-[10px] text-blue-600">评估结果将自动写入老人的“全息电子档案”，作为后续派单基准。</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Bell size={18} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-blue-800">复评提醒设定</h4>
              <p className="text-[10px] text-blue-600">系统已自动设定下一次复评时间：2024-01-03 (3个月后)。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-4 z-40">
        <button 
          onClick={() => onSubmit(assessment)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-100 active:scale-95 transition-transform"
        >
          <Send size={18} />
          <span>一键提交审批 (家属/管理端)</span>
        </button>
      </div>
    </div>
  );
}
