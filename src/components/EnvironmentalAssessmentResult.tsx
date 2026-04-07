import React from 'react';
import { ChevronLeft, Send, AlertTriangle, CheckCircle2, TrendingUp, Package, FileText, Bell, MapPin, Wrench } from 'lucide-react';
import { Assessment, AssessmentStatus } from '../types';
import { motion } from 'motion/react';

const MODIFICATION_PACKAGES = [
  { 
    id: 'MOD-001', 
    name: '卫浴防滑安全包', 
    price: 899,
    items: ['L型不锈钢扶手', '专业防滑地垫', '折叠助浴凳']
  },
  { 
    id: 'MOD-002', 
    name: '全屋照明感应包', 
    price: 450,
    items: ['起夜感应地灯 x3', '床头感应开关', '走廊高亮感应灯']
  }
];

export default function EnvironmentalAssessmentResult({ assessment, onBack, onSubmit }: { assessment: Assessment, onBack: () => void, onSubmit: (a: Assessment) => void }) {
  
  const getRiskInfo = (level?: string) => {
    switch (level) {
      case 'SAFE': return { label: '安全', color: 'text-green-600', bg: 'bg-green-50', desc: '环境状况良好，无明显安全隐患。' };
      case 'LOW': return { label: '低风险', color: 'text-blue-600', bg: 'bg-blue-50', desc: '存在轻微隐患，建议日常注意或进行简单调整。' };
      case 'MEDIUM': return { label: '中风险', color: 'text-orange-600', bg: 'bg-orange-50', desc: '存在明显隐患，建议尽快进行适老化局部改造。' };
      case 'HIGH': return { label: '高风险', color: 'text-red-600', bg: 'bg-red-50', desc: '环境极度危险，必须立即进行专业适老化改造！' };
      default: return { label: '未知', color: 'text-gray-600', bg: 'bg-gray-50', desc: '' };
    }
  };

  const riskInfo = getRiskInfo(assessment.level);
  const hazards = assessment.items?.filter(i => (i.selectedScore || 0) > 0) || [];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b border-gray-200 sticky top-0 z-30">
        <button onClick={onBack} className="p-1 -ml-1 mr-2 text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">环境安全报告</h2>
          <p className="text-[10px] text-gray-500">流水号: {assessment.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
        {/* Risk Level Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-400 mb-1">环境风险定级</div>
          <div className={`text-4xl font-black mb-4 ${riskInfo.color}`}>{riskInfo.label}</div>
          
          <div className={`inline-flex items-center px-4 py-1.5 rounded-full font-bold text-sm ${riskInfo.bg} ${riskInfo.color} mb-3`}>
            得分: {assessment.totalScore}
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed px-4">
            {riskInfo.desc}
          </p>
        </div>

        {/* Identified Hazards */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle size={18} className="mr-2 text-red-500" />
            识别出的安全隐患 ({hazards.length})
          </h3>
          
          <div className="space-y-4">
            {hazards.map((h, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <img src={`https://picsum.photos/seed/hazard-${i}/100/100`} alt="Hazard" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 leading-tight mb-1">{h.question}</div>
                  <div className="flex items-center text-[10px] text-red-600 font-medium">
                    <MapPin size={10} className="mr-1" /> 客厅/卧室区域
                  </div>
                </div>
              </div>
            ))}
            {hazards.length === 0 && (
              <div className="text-center py-4 text-gray-400 text-xs">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500 opacity-20" />
                未发现明显环境隐患
              </div>
            )}
          </div>
        </div>

        {/* Modification Recommendations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Wrench size={18} className="mr-2 text-blue-500" />
            适老化改造建议
          </h3>
          
          <div className="space-y-4">
            {MODIFICATION_PACKAGES.map((pkg, i) => (
              <div key={i} className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-blue-800 text-sm">{pkg.name}</div>
                  <div className="text-blue-600 font-black text-sm">¥{pkg.price}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {pkg.items.map((item, j) => (
                    <span key={j} className="text-[10px] bg-white/60 px-2 py-0.5 rounded-md text-blue-700">{item}</span>
                  ))}
                </div>
                <button className="w-full bg-white text-blue-600 py-2 rounded-xl text-xs font-bold border border-blue-200">
                  查看改造方案详情
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Business Linkage */}
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 space-y-3">
          <div className="flex items-start space-x-3">
            <Bell size={18} className="text-orange-600 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-orange-800">家属端同步预警</h4>
              <p className="text-[10px] text-orange-600">报告已同步至家属端，将以红字视觉提醒家属关注居家环境安全。</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp size={18} className="text-orange-600 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-orange-800">精准线索流转</h4>
              <p className="text-[10px] text-orange-600">评估数据已作为“精准销售线索”流转至业务运营部，将由专人跟进改造意愿。</p>
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
          <span>确认并同步至全息档案</span>
        </button>
      </div>
    </div>
  );
}
