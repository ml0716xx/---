import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, MapPin, Phone, ShieldAlert, ChevronRight, Navigation } from 'lucide-react';
import { Alarm, AlarmStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_ALARMS: Alarm[] = [
  {
    id: 'ALM-001',
    type: 'FALL',
    level: 'CRITICAL',
    patientName: '王大爷',
    address: '朝阳区北苑家园 6栋 1201',
    lat: 39.95,
    lon: 116.42,
    triggerTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    status: AlarmStatus.TRIGGERED,
    deviceInfo: '毫米波雷达 - 浴室',
    description: '检测到剧烈跌倒动作，且1分钟内无起身迹象。'
  },
  {
    id: 'ALM-002',
    type: 'SOS',
    level: 'CRITICAL',
    patientName: '李奶奶',
    address: '海淀区中关村南路 2号院 302',
    lat: 39.98,
    lon: 116.31,
    triggerTime: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: AlarmStatus.RESPONDED,
    respondTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    deviceInfo: '床头紧急按钮',
    description: '用户主动触发SOS警报。'
  }
];

export default function AlarmCenter({ onSelect }: { onSelect: (alarm: Alarm) => void }) {
  const [alarms, setAlarms] = useState<Alarm[]>(MOCK_ALARMS);

  // Simulate a new incoming alarm
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAlarm: Alarm = {
        id: 'ALM-003',
        type: 'VITAL_SIGNS',
        level: 'WARNING',
        patientName: '赵爷爷',
        address: '丰台区方庄芳群园 1区 505',
        lat: 39.86,
        lon: 116.43,
        triggerTime: new Date().toISOString(),
        status: AlarmStatus.TRIGGERED,
        deviceInfo: '智能手环',
        description: '心率持续高于120次/分，建议核实。'
      };
      setAlarms(prev => [newAlarm, ...prev]);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const getAlarmTypeLabel = (type: string) => {
    switch (type) {
      case 'FALL': return '跌倒警报';
      case 'SOS': return '紧急呼救';
      case 'INACTIVITY': return '久坐预警';
      case 'VITAL_SIGNS': return '体征异常';
      default: return '未知警报';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <ShieldAlert className="mr-2 text-red-500" size={24} />
          待处理警报 ({alarms.filter(a => a.status !== AlarmStatus.RESOLVED).length})
        </h2>
      </div>

      <AnimatePresence>
        {alarms.map((alarm) => (
          <motion.div
            key={alarm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => onSelect(alarm)}
            className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform ${
              alarm.level === 'CRITICAL' ? 'border-l-red-500' : 'border-l-orange-400'
            } border-t border-r border-b border-gray-100`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alarm.level === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {alarm.level === 'CRITICAL' ? '特级紧急' : '重要预警'}
                  </span>
                  <h3 className="font-bold text-gray-800">{getAlarmTypeLabel(alarm.type)}</h3>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {new Date(alarm.triggerTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-2 mt-3">
                <div className="flex items-center text-sm text-gray-700 font-medium">
                  <AlertCircle size={16} className="text-gray-400 mr-2" />
                  <span>老人: {alarm.patientName}</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{alarm.address}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <Clock size={14} className="mr-1.5" />
                  <span>已触发: {Math.floor((Date.now() - new Date(alarm.triggerTime).getTime()) / 60000)} 分钟</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span>状态: {alarm.status === AlarmStatus.TRIGGERED ? '待接警' : '响应中'}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                    LBS
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-red-100 flex items-center justify-center text-red-600 text-[10px] font-bold">
                    SOS
                  </div>
                </div>
                <button className={`flex items-center text-sm font-bold ${
                  alarm.status === AlarmStatus.TRIGGERED ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {alarm.status === AlarmStatus.TRIGGERED ? '立即接警' : '继续处理'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {alarms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ShieldAlert size={48} className="opacity-20 mb-4" />
          <p>暂无待处理警报</p>
        </div>
      )}
    </div>
  );
}
