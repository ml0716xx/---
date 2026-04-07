import React, { useState } from 'react';
import { ChevronLeft, Camera, Mic, Save, Send, AlertTriangle, CheckCircle2, Info, MapPin } from 'lucide-react';
import { Assessment, AssessmentItem, AssessmentStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const ENV_CHECKLIST: AssessmentItem[] = [
  // 地面与动线
  { id: 'env-1', question: '地面是否存在积水湿滑、地毯边缘卷起或地板松动？', options: [{ label: '安全', score: 0 }, { label: '轻微隐患', score: 5 }, { label: '严重隐患', score: 10 }] },
  { id: 'env-2', question: '门槛高度是否超过 2cm 或动线有杂物堆积？', options: [{ label: '无障碍', score: 0 }, { label: '有障碍', score: 10 }] },
  // 电气与照明
  { id: 'env-3', question: '插座面板是否松动、是否存在“飞线”或过载风险？', options: [{ label: '安全', score: 0 }, { label: '存在隐患', score: 10 }] },
  { id: 'env-4', question: '起夜动线（床头-走廊-卫生间）是否有感应灯？', options: [{ label: '全覆盖', score: 0 }, { label: '部分覆盖', score: 5 }, { label: '无感应灯', score: 10 }] },
  // 卫浴空间
  { id: 'env-5', question: '马桶及淋浴区是否安装加固扶手？', options: [{ label: '已安装', score: 0 }, { label: '未安装', score: 15 }] },
  { id: 'env-6', question: '是否铺设专业防滑垫或配备助浴凳？', options: [{ label: '齐全', score: 0 }, { label: '部分缺失', score: 5 }, { label: '完全缺失', score: 10 }] },
  // 家具与结构
  { id: 'env-7', question: '老人常扶的桌椅是否稳固？', options: [{ label: '稳固', score: 0 }, { label: '不稳固', score: 10 }] },
  { id: 'env-8', question: '家具边缘是否有防撞角处理？', options: [{ label: '已处理', score: 0 }, { label: '未处理', score: 5 }] },
];

export default function EnvironmentalAssessmentForm({ assessment, onBack, onComplete }: { assessment: Assessment, onBack: () => void, onComplete: (a: Assessment) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<AssessmentItem[]>(ENV_CHECKLIST.map(item => ({
    ...item,
    selectedScore: assessment.items?.find(i => i.id === item.id)?.selectedScore
  })));
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleSelect = (score: number) => {
    const newItems = [...items];
    newItems[currentIndex] = { ...newItems[currentIndex], selectedScore: score };
    setItems(newItems);
    
    // Auto next if not the last one
    if (currentIndex < items.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    }
  };

  const calculateResult = () => {
    const totalScore = items.reduce((sum, item) => sum + (item.selectedScore || 0), 0);
    let level = 'SAFE';
    if (totalScore > 40) level = 'HIGH';
    else if (totalScore > 20) level = 'MEDIUM';
    else if (totalScore > 5) level = 'LOW';

    return { totalScore, level };
  };

  const handleFinish = () => {
    const { totalScore, level } = calculateResult();
    onComplete({
      ...assessment,
      items,
      totalScore,
      level,
      status: AssessmentStatus.SUBMITTED,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b border-gray-200 sticky top-0 z-30">
        <button onClick={onBack} className="p-1 -ml-1 mr-2 text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">环境安全评估</h2>
          <p className="text-[10px] text-gray-500">对象: {assessment.patientName} | 场景: {assessment.triggerReason === 'ACCIDENT' ? '意外追溯' : '常规巡检'}</p>
        </div>
        <button className="text-blue-600 text-xs font-bold px-3 py-1 bg-blue-50 rounded-full flex items-center">
          <Save size={14} className="mr-1" /> 保存草稿
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-2">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-medium">
          <span>评估进度 {currentIndex + 1}/{items.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col"
          >
            <div className="mb-6">
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md mb-2">
                {currentIndex < 2 ? '地面与动线' : currentIndex < 4 ? '电气与照明' : currentIndex < 6 ? '卫浴空间' : '家具与结构'}
              </span>
              <h3 className="text-lg font-bold text-gray-800 leading-snug">
                {currentItem.question}
              </h3>
            </div>

            <div className="space-y-3 flex-1">
              {currentItem.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.score)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                    currentItem.selectedScore === opt.score 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="font-bold">{opt.label}</span>
                  {currentItem.selectedScore === opt.score && <CheckCircle2 size={20} className="text-blue-500" />}
                </button>
              ))}
            </div>

            {/* Evidence & Location */}
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Info size={14} className="mr-1 text-blue-500" />
                  <span>发现隐患请拍照并标记位置</span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => setShowEvidenceModal(true)} className="p-2 bg-gray-100 rounded-xl text-gray-600 active:scale-95 transition-transform">
                    <Camera size={20} />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-xl text-gray-600 active:scale-95 transition-transform">
                    <MapPin size={20} />
                  </button>
                </div>
              </div>
              
              {/* Mock Evidence List */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {currentIndex === 0 && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src="https://picsum.photos/seed/floor/100/100" alt="Evidence" className="w-full h-full object-cover" />
                    <div className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg">
                      <AlertTriangle size={10} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-gray-100 p-4 flex items-center space-x-3">
        <button 
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 disabled:opacity-30"
        >
          上一项
        </button>
        {currentIndex === items.length - 1 ? (
          <button 
            onClick={handleFinish}
            disabled={currentItem.selectedScore === undefined}
            className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send size={18} />
            <span>生成安全报告</span>
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIndex(currentIndex + 1)}
            disabled={currentItem.selectedScore === undefined}
            className="flex-[2] bg-gray-800 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>下一项</span>
          </button>
        )}
      </div>

      {/* Mock Camera Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 bg-gray-900 flex items-center justify-center relative">
            <button onClick={() => setShowEvidenceModal(false)} className="absolute top-6 left-6 text-white p-2 bg-white/10 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <div className="text-white/30 text-center">
              <Camera size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">正在调用系统相机...</p>
            </div>
            {/* Mock Overlay */}
            <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between items-center">
              <div className="w-12 h-12 rounded-lg bg-white/20"></div>
              <button onClick={() => setShowEvidenceModal(false)} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white"></div>
              </button>
              <div className="w-12 h-12 rounded-lg bg-white/20"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
