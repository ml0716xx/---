import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Navigation, Camera, Mic, CheckCircle2, ShieldAlert, 
  ChevronLeft, AlertTriangle, User, History, Send, XCircle, 
  Stethoscope, Ambulance, Signature, MessageSquare, MapPin, ChevronRight
} from 'lucide-react';
import { Alarm, AlarmStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function AlarmDetail({ alarm, onBack, onResolve }: { alarm: Alarm, onBack: () => void, onResolve: (id: string) => void }) {
  const [status, setStatus] = useState<AlarmStatus>(alarm.status);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  // Track response time
  useEffect(() => {
    if (status === AlarmStatus.RESPONDED && !responseTime) {
      const diff = Math.floor((Date.now() - new Date(alarm.triggerTime).getTime()) / 1000);
      setResponseTime(diff);
      addLog(`确认接警，响应耗时: ${Math.floor(diff / 60)}分${diff % 60}秒`);
    }
  }, [status]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`, ...prev]);
  };

  const handleRespond = () => {
    setStatus(AlarmStatus.RESPONDED);
    setActiveStep(1);
  };

  const handleArrive = () => {
    setStatus(AlarmStatus.ARRIVED);
    setActiveStep(2);
    addLog('护理员已到达现场，地理围栏校验通过');
  };

  const handleResultSelect = (result: string) => {
    setSelectedResult(result);
    setShowResultModal(false);
    addLog(`处理结果录入: ${result}`);
    if (result === '协助送医') {
      addLog('已拨打120，正在陪同送医...');
    }
  };

  const handleComplete = () => {
    setStatus(AlarmStatus.RESOLVED);
    addLog('处置凭证已上传，电子签名确认完成');
    setTimeout(() => {
      onResolve(alarm.id);
      onBack();
    }, 1500);
  };

  const steps = [
    { label: '接警响应', icon: <Phone size={18} /> },
    { label: '上门核实', icon: <Navigation size={18} /> },
    { label: '处置录入', icon: <Stethoscope size={18} /> },
    { label: '凭证闭环', icon: <Signature size={18} /> }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center border-b border-gray-200 sticky top-0 z-30">
        <button onClick={onBack} className="p-1 -ml-1 mr-2 text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800 flex items-center">
            警报详情
            <span className={`ml-2 px-2 py-0.5 rounded text-[10px] ${
              alarm.level === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {alarm.id}
            </span>
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-blue-50 text-blue-600 rounded-full">
            <Phone size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Alarm Info Card */}
        <div className="p-4">
          <div className={`rounded-2xl p-4 text-white shadow-lg ${
            alarm.level === 'CRITICAL' ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-orange-400 to-orange-500'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs opacity-80 mb-1">警报类型</div>
                <div className="text-xl font-bold">{alarm.type === 'FALL' ? '跌倒警报' : '紧急呼救'}</div>
              </div>
              <ShieldAlert size={32} className="opacity-30" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-[10px] opacity-80">老人姓名</div>
                <div className="font-medium">{alarm.patientName}</div>
              </div>
              <div>
                <div className="text-[10px] opacity-80">触发时间</div>
                <div className="font-medium">{new Date(alarm.triggerTime).toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 flex items-start">
              <MapPin size={14} className="mr-1.5 mt-0.5 flex-shrink-0" />
              <div className="text-xs leading-relaxed">{alarm.address}</div>
            </div>
          </div>
        </div>

        {/* SOP Steps */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between mb-6">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center space-y-1 relative flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${
                    activeStep >= i ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-[10px] font-medium ${activeStep >= i ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[60%] top-4 w-[80%] h-0.5 -z-0 ${
                      activeStep > i ? 'bg-blue-600' : 'bg-gray-100'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="space-y-4">
              {activeStep === 0 && (
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <p className="text-xs text-red-700 leading-relaxed">
                      <AlertTriangle size={14} className="inline mr-1 mb-0.5" />
                      系统已指派您处理该警报，请立即确认接警并前往。响应时长将计入KPI。
                    </p>
                  </div>
                  <button onClick={handleRespond} className="w-full bg-red-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform">
                    确认接警
                  </button>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">响应耗时</span>
                    <span className="font-mono font-bold text-blue-600">{Math.floor(responseTime! / 60)}' {responseTime! % 60}"</span>
                  </div>
                  <button onClick={() => window.open(`https://maps.google.com/?q=${alarm.lat},${alarm.lon}`)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2">
                    <Navigation size={20} />
                    <span>一键导航前往</span>
                  </button>
                  <button onClick={handleArrive} className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-bold">
                    已到达现场 (LBS打卡)
                  </button>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Stethoscope size={18} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">处置结果录入</span>
                    </div>
                    <button onClick={() => setShowResultModal(true)} className="text-blue-600 text-xs font-bold">
                      {selectedResult || '点击选择'}
                    </button>
                  </div>
                  
                  {selectedResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-gray-100 p-3 rounded-xl flex flex-col items-center border border-gray-200">
                          <Camera size={20} className="text-gray-500 mb-1" />
                          <span className="text-[10px] text-gray-600">现场拍照</span>
                        </button>
                        <button 
                          onMouseDown={() => setIsRecording(true)}
                          onMouseUp={() => { setIsRecording(false); addLog('录入语音护理日志: 老人生命体征平稳，环境安全。'); }}
                          className={`p-3 rounded-xl flex flex-col items-center border transition-colors ${
                            isRecording ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-100 border-gray-200 text-gray-600'
                          }`}
                        >
                          <Mic size={20} className={isRecording ? 'animate-pulse' : ''} />
                          <span className="text-[10px]">{isRecording ? '松开结束' : '语音日志'}</span>
                        </button>
                      </div>
                      <button onClick={() => setActiveStep(3)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                        下一步: 凭证采集
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                    <Signature size={32} className="mb-2 opacity-30" />
                    <p className="text-xs">请老人或家属在此区域电子签名</p>
                    <div className="w-full h-24 mt-2 bg-white rounded border border-gray-100"></div>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-gray-500">
                    <CheckCircle2 size={12} className="text-green-500" />
                    <span>处理结果将实时同步至家属端小程序</span>
                  </div>
                  <button onClick={handleComplete} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-100">
                    完成处置并闭环
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
              <History size={16} className="mr-2 text-gray-400" />
              处置动态
            </h3>
            <div className="space-y-3">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <p className="text-[11px] text-gray-600 font-mono leading-relaxed">{log}</p>
                </div>
              ))}
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-400 font-mono">
                  [{new Date(alarm.triggerTime).toLocaleTimeString()}] 系统触发警报: {alarm.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar (Contextual) */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-4 flex space-x-3 z-40">
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2">
          <MessageSquare size={18} />
          <span>转服务工单</span>
        </button>
        <button className="flex-1 bg-orange-50 text-orange-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2">
          <AlertTriangle size={18} />
          <span>异常挂起</span>
        </button>
      </div>

      {/* Result Selection Modal */}
      <AnimatePresence>
        {showResultModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowResultModal(false)}
              className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            >
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                onClick={e => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4"
              >
                <h3 className="font-bold text-lg text-center">选择处理结果</h3>
                <div className="grid grid-cols-1 gap-3">
                  {['误报消除', '电话确认无碍', '已上门查看', '协助送医'].map(res => (
                    <button 
                      key={res}
                      onClick={() => handleResultSelect(res)}
                      className="w-full p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 font-medium text-left flex justify-between items-center transition-colors"
                    >
                      {res}
                      <ChevronRight size={18} className="opacity-30" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowResultModal(false)} className="w-full py-4 text-gray-500 font-medium">取消</button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
