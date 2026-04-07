import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { TaskState, SOPStateMachine, TaskAction } from '../lib/stateMachine';
import { checkGeofence } from '../lib/lbs';
import { MapPin, Navigation, Camera, Mic, CheckCircle2, ShieldCheck, Key, FileText, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ActiveTask({ task, setTask }: { task: Task | null, setTask: (t: Task | null) => void }) {
  const [sm] = useState(() => new SOPStateMachine(task?.state || TaskState.PENDING));
  const [currentState, setCurrentState] = useState<TaskState>(task?.state || TaskState.PENDING);
  const [lbsStatus, setLbsStatus] = useState<{ isWithin: boolean, distance: number } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Sync state machine with component state
  useEffect(() => {
    if (task && task.state !== currentState) {
      setCurrentState(task.state);
    }
  }, [task, currentState]);

  const handleAction = (action: TaskAction) => {
    if (!task) return;

    // Simulate LBS Check for GPS_CHECK_IN
    if (action === 'GPS_CHECK_IN') {
      // Mock user location slightly off target
      const userLat = task.lat + 0.001; 
      const userLon = task.lon + 0.001;
      const status = checkGeofence(userLat, userLon, task.lat, task.lon, 200);
      setLbsStatus(status);
      
      if (!status.isWithin) {
        alert(`地理围栏校验失败！您距离目的地 ${status.distance} 米，需在 200 米内打卡。`);
        return;
      }
    }

    const success = sm.transition(action);
    if (success) {
      const newState = sm.getState();
      setCurrentState(newState);
      setTask({ ...task, state: newState });
      
      // Add log
      const actionMap: Record<TaskAction, string> = {
        'ACCEPT_TASK': '接单成功',
        'START_ROUTE': '开始导航前往',
        'GPS_CHECK_IN': 'GPS地理围栏打卡成功',
        'VERIFY_FACE': '人脸识别核验通过',
        'START_SERVICE': '关键工序拍照/录音完成',
        'COMPLETE_SERVICE': '离家签退完成'
      };
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${actionMap[action]}`]);
    }
  };

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center mt-20">
        <FileText size={64} className="text-gray-300 mb-4" />
        <p>当前没有正在执行的工单</p>
        <p className="text-sm mt-2">请前往任务大厅接单</p>
      </div>
    );
  }

  const steps = [
    { state: TaskState.ASSIGNED, label: '已接单', icon: <CheckCircle2 size={20} /> },
    { state: TaskState.EN_ROUTE, label: '前往中', icon: <Navigation size={20} /> },
    { state: TaskState.ARRIVED, label: 'GPS签到', icon: <MapPin size={20} /> },
    { state: TaskState.FACE_VERIFIED, label: '人脸核验', icon: <ShieldCheck size={20} /> },
    { state: TaskState.IN_PROGRESS, label: '服务记录', icon: <Camera size={20} /> },
    { state: TaskState.COMPLETED, label: '离家签退', icon: <CheckCircle2 size={20} /> },
  ];

  const getCurrentStepIndex = () => {
    const order = [TaskState.PENDING, TaskState.ASSIGNED, TaskState.EN_ROUTE, TaskState.ARRIVED, TaskState.FACE_VERIFIED, TaskState.IN_PROGRESS, TaskState.COMPLETED];
    return order.indexOf(currentState);
  };

  const stepIndex = getCurrentStepIndex();

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Task Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{task.title}</h2>
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
            {task.id}
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>服务对象: {task.patientName || task.deviceName}</p>
          <p>服务地址: {task.address}</p>
        </div>

        {/* Temporary Entry Code */}
        {(currentState === TaskState.EN_ROUTE || currentState === TaskState.ARRIVED || currentState === TaskState.FACE_VERIFIED) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2 text-orange-800">
              <Key size={20} />
              <span className="font-medium text-sm">临时动态入户码</span>
            </div>
            <div className="text-2xl font-mono font-bold tracking-widest text-orange-600">
              {task.entryCode}
            </div>
          </motion.div>
        )}
      </div>

      {/* SOP Progress */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">SOP 标准化执行流程</h3>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6 relative">
            {steps.map((step, index) => {
              const stepOrder = index + 1; // ASSIGNED is 1
              const isCompleted = stepIndex > stepOrder;
              const isCurrent = stepIndex === stepOrder;
              const isPending = stepIndex < stepOrder;

              return (
                <div key={step.state} className={`flex items-start ${isPending ? 'opacity-50' : ''}`}>
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white
                    ${isCompleted ? 'border-green-500 text-green-500' : 
                      isCurrent ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'}`}
                  >
                    {step.icon}
                  </div>
                  <div className="ml-4 flex-1 pt-1">
                    <h4 className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>
                      {step.label}
                    </h4>
                    
                    {/* Action Buttons for Current Step */}
                    {isCurrent && (
                      <div className="mt-3">
                        {currentState === TaskState.ASSIGNED && (
                          <button onClick={() => handleAction('START_ROUTE')} className="btn-primary w-full flex items-center justify-center">
                            <Navigation size={18} className="mr-2" /> 开始导航
                          </button>
                        )}
                        {currentState === TaskState.EN_ROUTE && (
                          <div className="space-y-2">
                            <button onClick={() => handleAction('GPS_CHECK_IN')} className="btn-primary w-full flex items-center justify-center">
                              <MapPin size={18} className="mr-2" /> LBS 地理围栏打卡
                            </button>
                            {lbsStatus && !lbsStatus.isWithin && (
                              <p className="text-xs text-red-500 flex items-center"><AlertTriangle size={14} className="mr-1"/> 距离过远 ({lbsStatus.distance}m)</p>
                            )}
                          </div>
                        )}
                        {currentState === TaskState.ARRIVED && (
                          <button onClick={() => handleAction('VERIFY_FACE')} className="btn-primary w-full flex items-center justify-center">
                            <ShieldCheck size={18} className="mr-2" /> 人脸识别核验
                          </button>
                        )}
                        {currentState === TaskState.FACE_VERIFIED && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <button className="bg-gray-100 text-gray-700 py-2 rounded-lg flex flex-col items-center justify-center border border-gray-200">
                                <Camera size={24} className="mb-1 text-gray-500" />
                                <span className="text-xs">拍测温照</span>
                              </button>
                              <button className="bg-gray-100 text-gray-700 py-2 rounded-lg flex flex-col items-center justify-center border border-gray-200">
                                <Mic size={24} className="mb-1 text-gray-500" />
                                <span className="text-xs">语音日志</span>
                              </button>
                            </div>
                            <button onClick={() => handleAction('START_SERVICE')} className="btn-primary w-full">
                              提交记录并开始服务
                            </button>
                          </div>
                        )}
                        {currentState === TaskState.IN_PROGRESS && (
                          <button onClick={() => handleAction('COMPLETE_SERVICE')} className="bg-green-600 text-white py-2.5 rounded-lg font-medium w-full flex items-center justify-center hover:bg-green-700">
                            <CheckCircle2 size={18} className="mr-2" /> 离家签退
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Execution Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">执行日志</h3>
          <div className="space-y-1 text-xs text-gray-600 font-mono">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>
      )}
      
      {currentState === TaskState.COMPLETED && (
        <button 
          onClick={() => setTask(null)}
          className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium mt-4"
        >
          返回任务大厅
        </button>
      )}
    </div>
  );
}
