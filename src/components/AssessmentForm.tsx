import React, { useState } from 'react';
import { ChevronLeft, Camera, Mic, Save, Send, CheckCircle2, AlertCircle, Info, Plus } from 'lucide-react';
import { Assessment, AssessmentItem, AssessmentStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const ADL_QUESTIONS: AssessmentItem[] = [
  {
    id: 'Q-001',
    question: '进食：使用餐具将食物送入口中，咀嚼并吞咽。',
    options: [
      { label: '完全自理 (10分)', score: 10 },
      { label: '需部分协助 (5分)', score: 5 },
      { label: '完全依赖 (0分)', score: 0 }
    ]
  },
  {
    id: 'Q-002',
    question: '洗澡：进入浴室，洗刷身体，擦干并离开。',
    options: [
      { label: '完全自理 (5分)', score: 5 },
      { label: '需部分协助 (2分)', score: 2 },
      { label: '完全依赖 (0分)', score: 0 }
    ]
  },
  {
    id: 'Q-003',
    question: '行走：在平地上行走45米，可使用助行器。',
    options: [
      { label: '独立行走 (15分)', score: 15 },
      { label: '需1人协助 (10分)', score: 10 },
      { label: '需2人协助 (5分)', score: 5 },
      { label: '不能行走 (0分)', score: 0 }
    ]
  },
  {
    id: 'Q-004',
    question: '穿衣：穿脱衣服、系扣子、拉拉链、穿鞋袜。',
    options: [
      { label: '完全自理 (10分)', score: 10 },
      { label: '需部分协助 (5分)', score: 5 },
      { label: '完全依赖 (0分)', score: 0 }
    ]
  }
];

export default function AssessmentForm({ assessment, onBack, onComplete }: { assessment: Partial<Assessment>, onBack: () => void, onComplete: (a: Assessment) => void }) {
  const [items, setItems] = useState<AssessmentItem[]>(assessment.items || ADL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleSelectOption = (score: number) => {
    const newItems = [...items];
    newItems[currentIndex] = { ...newItems[currentIndex], selectedScore: score };
    setItems(newItems);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate total score and level
      const totalScore = items.reduce((sum, item) => sum + (item.selectedScore || 0), 0);
      let level: 'SELF_CARE' | 'MILD_MODERATE' | 'SEVERE' = 'SELF_CARE';
      if (totalScore < 40) level = 'SEVERE';
      else if (totalScore < 60) level = 'MILD_MODERATE';

      const completedAssessment: Assessment = {
        ...assessment as Assessment,
        items,
        totalScore,
        level,
        status: AssessmentStatus.SUBMITTED,
        updatedAt: new Date().toISOString()
      };
      onComplete(completedAssessment);
    }
  };

  const handleAddEvidence = () => {
    const newItems = [...items];
    const currentEvidence = newItems[currentIndex].evidence || [];
    newItems[currentIndex] = { 
      ...newItems[currentIndex], 
      evidence: [...currentEvidence, `https://picsum.photos/seed/${Math.random()}/400/300`] 
    };
    setItems(newItems);
    setShowEvidenceModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b border-gray-200 sticky top-0 z-30">
        <button onClick={onBack} className="p-1 -ml-1 mr-2 text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">ADL 能力评估</h2>
          <p className="text-[10px] text-gray-500">对象: {assessment.patientName}</p>
        </div>
        <button className="text-blue-600 text-sm font-bold flex items-center space-x-1">
          <Save size={16} />
          <span>存草稿</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-blue-600"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <span className="text-sm font-bold bg-blue-50 px-2 py-0.5 rounded">Q{currentIndex + 1}</span>
                <span className="text-xs font-medium text-gray-400">/ {items.length}</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 leading-relaxed mb-6">
                {currentItem.question}
              </h3>

              <div className="space-y-3">
                {currentItem.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(option.score)}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2 ${
                      currentItem.selectedScore === option.score 
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                        : 'bg-gray-50 border-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.label}</span>
                      {currentItem.selectedScore === option.score && <CheckCircle2 size={18} className="text-blue-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Multimedia Evidence */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800 flex items-center">
                  <Camera size={18} className="mr-2 text-gray-400" />
                  多媒体证据存证
                </h4>
                <button 
                  onClick={() => setShowEvidenceModal(true)}
                  className="text-blue-600 text-xs font-bold flex items-center"
                >
                  <Plus size={14} className="mr-0.5" /> 添加
                </button>
              </div>

              {currentItem.evidence && currentItem.evidence.length > 0 ? (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {currentItem.evidence.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={url} alt="Evidence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400">
                  <Info size={24} className="mb-2 opacity-30" />
                  <p className="text-[10px] text-center">拍摄老人执行特定动作的视频或照片，确保评估分值的客观性。</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-4 flex space-x-3 z-40">
        <button 
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm disabled:opacity-30"
        >
          上一题
        </button>
        <button 
          onClick={handleNext}
          disabled={currentItem.selectedScore === undefined}
          className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-blue-100"
        >
          <span>{currentIndex === items.length - 1 ? '完成评估' : '下一题'}</span>
          {currentIndex < items.length - 1 && <ChevronLeft size={18} className="rotate-180" />}
        </button>
      </div>

      {/* Evidence Modal */}
      <AnimatePresence>
        {showEvidenceModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4"
            >
              <h3 className="font-bold text-lg text-center">添加证据</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleAddEvidence} className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Camera size={32} className="text-blue-500 mb-2" />
                  <span className="text-xs font-medium">拍照</span>
                </button>
                <button onClick={handleAddEvidence} className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Mic size={32} className="text-orange-500 mb-2" />
                  <span className="text-xs font-medium">录音</span>
                </button>
              </div>
              <button onClick={() => setShowEvidenceModal(false)} className="w-full py-2 text-gray-500 font-medium text-sm">取消</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
