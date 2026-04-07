import React, { useState } from 'react';
import { 
  Plus, Search, Filter, ChevronRight, Calendar, 
  User, ClipboardCheck, AlertCircle, CheckCircle2,
  Home, ShieldAlert, HeartPulse
} from 'lucide-react';
import { Assessment, AssessmentStatus, AssessmentType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'ASS-001',
    type: 'ADL',
    patientName: '张爷爷',
    patientId: 'P-1001',
    status: AssessmentStatus.APPROVED,
    items: [],
    totalScore: 85,
    level: 'SELF_CARE',
    createdAt: '2023-12-01',
    updatedAt: '2023-12-01'
  },
  {
    id: 'ASS-002',
    type: 'ENVIRONMENT',
    patientName: '李奶奶',
    patientId: 'P-1002',
    status: AssessmentStatus.SUBMITTED,
    items: [],
    totalScore: 45,
    level: 'MEDIUM',
    createdAt: '2023-12-15',
    updatedAt: '2023-12-15',
    triggerReason: 'ACCIDENT'
  }
];

export default function AssessmentList({ onStart, onSelect }: { onStart: (type: AssessmentType) => void, onSelect: (a: Assessment) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);

  const getStatusBadge = (status: AssessmentStatus) => {
    switch (status) {
      case AssessmentStatus.DRAFT:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md">草稿</span>;
      case AssessmentStatus.SUBMITTED:
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md">待审批</span>;
      case AssessmentStatus.APPROVED:
        return <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded-md">已通过</span>;
    }
  };

  const getLevelBadge = (assessment: Assessment) => {
    if (assessment.type === 'ENVIRONMENT') {
      const levels: Record<string, any> = {
        'SAFE': { label: '安全', color: 'text-green-600', bg: 'bg-green-50' },
        'LOW': { label: '低风险', color: 'text-blue-600', bg: 'bg-blue-50' },
        'MEDIUM': { label: '中风险', color: 'text-orange-600', bg: 'bg-orange-50' },
        'HIGH': { label: '高风险', color: 'text-red-600', bg: 'bg-red-50' },
      };
      const info = levels[assessment.level || 'SAFE'];
      return <span className={`px-2 py-0.5 ${info.bg} ${info.color} text-[10px] font-bold rounded-md`}>{info.label}</span>;
    } else {
      const levels: Record<string, any> = {
        'SELF_CARE': { label: '自理', color: 'text-green-600', bg: 'bg-green-50' },
        'MILD_MODERATE': { label: '轻/中度', color: 'text-orange-600', bg: 'bg-orange-50' },
        'SEVERE': { label: '重度失能', color: 'text-red-600', bg: 'bg-red-50' },
      };
      const info = levels[assessment.level || 'SELF_CARE'];
      return <span className={`px-2 py-0.5 ${info.bg} ${info.color} text-[10px] font-bold rounded-md`}>{info.label}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Search & Filter */}
      <div className="bg-white p-4 space-y-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-bold text-gray-800">评估记录</h2>
          <button 
            onClick={() => setShowTypeModal(true)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-xl flex items-center text-xs font-bold active:scale-95 transition-transform"
          >
            <Plus size={16} className="mr-1" /> 发起评估
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索老人姓名或评估编号" 
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center">
            <Filter size={14} className="mr-1" /> 全部类型
          </button>
          <button className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold flex items-center justify-center">
            状态筛选
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {MOCK_ASSESSMENTS.map((assessment) => (
          <motion.div 
            key={assessment.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(assessment)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${assessment.type === 'ENVIRONMENT' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {assessment.type === 'ENVIRONMENT' ? <Home size={20} /> : <ClipboardCheck size={20} />}
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">{assessment.type === 'ENVIRONMENT' ? '环境安全评估' : '能力等级评估'}</div>
                  <div className="font-bold text-gray-800">{assessment.patientName}</div>
                </div>
              </div>
              {getStatusBadge(assessment.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50 mb-3">
              <div>
                <div className="text-[10px] text-gray-400 uppercase mb-1">评估结果</div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-gray-800">{assessment.totalScore}分</span>
                  {getLevelBadge(assessment)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase mb-1">评估日期</div>
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar size={12} className="mr-1" /> {assessment.createdAt}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-[10px] text-gray-400">流水号: {assessment.id}</div>
              <button className="text-blue-600 text-xs font-bold flex items-center">
                查看详情 <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowTypeModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-200 flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <Plus size={28} />
      </button>

      {/* Type Selection Modal */}
      <AnimatePresence>
        {showTypeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTypeModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="fixed bottom-0 left-0 w-full bg-white rounded-t-[40px] p-8 z-50 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">选择评估类型</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => { onStart('ADL'); setShowTypeModal(false); }}
                  className="flex flex-col items-center p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-100">
                    <HeartPulse size={28} />
                  </div>
                  <span className="font-bold text-blue-800 text-sm">能力评估</span>
                  <span className="text-[10px] text-blue-400 mt-1">ADL/IADL量表</span>
                </button>

                <button 
                  onClick={() => { onStart('ENVIRONMENT'); setShowTypeModal(false); }}
                  className="flex flex-col items-center p-6 bg-orange-50 rounded-3xl border-2 border-orange-100 active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-orange-100">
                    <ShieldAlert size={28} />
                  </div>
                  <span className="font-bold text-orange-800 text-sm">环境评估</span>
                  <span className="text-[10px] text-orange-400 mt-1">居家安全巡检</span>
                </button>
              </div>

              <button 
                onClick={() => setShowTypeModal(false)}
                className="w-full py-4 text-gray-400 font-bold text-sm"
              >
                取消
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
