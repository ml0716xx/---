import React, { useState } from 'react';
import { MapPin, Clock, Wrench, HeartPulse, AlertCircle, User } from 'lucide-react';
import { Task } from '../types';
import { TaskState } from '../lib/stateMachine';

const MOCK_TASKS: Task[] = [
  {
    id: 'T-20231001',
    title: '压疮护理与助浴',
    type: 'CARE',
    patientName: '张爷爷',
    address: '朝阳区阳光小区 3栋 402',
    lat: 39.92,
    lon: 116.46,
    distance: 2.1,
    skills: ['压疮护理', '方言沟通'],
    state: TaskState.PENDING,
    time: '今天 14:00 - 16:00',
    reward: 120
  },
  {
    id: 'T-20231002',
    title: '毫米波雷达离线检修',
    type: 'MAINTENANCE',
    deviceName: '卧室跌倒监测雷达',
    address: '海淀区清华园 1栋 101',
    lat: 39.99,
    lon: 116.32,
    distance: 4.5,
    skills: ['IoT设备维修'],
    state: TaskState.PENDING,
    time: '今天 16:30 之前',
    reward: 80
  },
  {
    id: 'T-20231003',
    title: '日常生命体征测量',
    type: 'CARE',
    patientName: '李奶奶',
    address: '丰台区科技园 5栋 201',
    lat: 39.82,
    lon: 116.28,
    distance: 3.2,
    skills: ['基础护理'],
    state: TaskState.PENDING,
    time: '明天 09:00 - 10:00',
    reward: 60
  }
];

export default function TaskHall({ onAccept, hasActiveTask }: { onAccept: (task: Task) => void, hasActiveTask: boolean }) {
  const [tasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start space-x-3">
        <AlertCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="text-sm font-medium text-blue-800">智能调度已开启</h3>
          <p className="text-xs text-blue-600 mt-1">系统已根据您的LBS位置（半径5公里）和技能标签为您匹配以下最优工单。</p>
        </div>
      </div>

      {tasks.map(task => (
        <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                {task.type === 'CARE' ? (
                  <div className="bg-green-100 p-1.5 rounded-md text-green-600">
                    <HeartPulse size={18} />
                  </div>
                ) : (
                  <div className="bg-orange-100 p-1.5 rounded-md text-orange-600">
                    <Wrench size={18} />
                  </div>
                )}
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
              </div>
              <span className="text-lg font-bold text-red-500">¥{task.reward}</span>
            </div>

            <div className="space-y-2 mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User size={16} className="text-gray-400" />
                <span>对象: {task.type === 'CARE' ? task.patientName : task.deviceName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-400" />
                <span>时间: {task.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate">地址: {task.address}</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 ml-auto flex-shrink-0">
                  {task.distance} km
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {task.skills.map(skill => (
                <span key={skill} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <button 
              onClick={() => onAccept(task)}
              disabled={hasActiveTask}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                hasActiveTask 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {hasActiveTask ? '您有正在执行的工单' : '立即抢单'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
