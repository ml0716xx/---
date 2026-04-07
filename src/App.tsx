/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClipboardList, MapPin, BarChart3, User, ShieldAlert, ClipboardCheck, Home } from 'lucide-react';
import TaskHall from './components/TaskHall';
import ActiveTask from './components/ActiveTask';
import Performance from './components/Performance';
import Profile from './components/Profile';
import AlarmCenter from './components/AlarmCenter';
import AlarmDetail from './components/AlarmDetail';
import AssessmentList from './components/AssessmentList';
import AssessmentForm from './components/AssessmentForm';
import AssessmentResult from './components/AssessmentResult';
import EnvironmentalAssessmentForm from './components/EnvironmentalAssessmentForm';
import EnvironmentalAssessmentResult from './components/EnvironmentalAssessmentResult';
import Dashboard from './components/Dashboard';
import { Task, Alarm, Assessment, AssessmentStatus, AlarmStatus, AssessmentType } from './types';
import { TaskState } from './lib/stateMachine';

const MOCK_ALARMS: Alarm[] = [
  {
    id: 'ALM-001',
    type: 'FALL',
    level: 'CRITICAL',
    status: AlarmStatus.TRIGGERED,
    patientName: '张爷爷',
    address: '幸福里小区 3号楼 102室',
    triggerTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lat: 31.2304,
    lon: 121.4737
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'hall' | 'active' | 'performance' | 'profile' | 'alarm' | 'assessment'>('home');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [showAssessmentResult, setShowAssessmentResult] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>(MOCK_ALARMS);

  const handleAcceptTask = (task: Task) => {
    setActiveTask({ ...task, state: TaskState.ASSIGNED, entryCode: Math.floor(100000 + Math.random() * 900000).toString() });
    setActiveTab('active');
  };

  const handleResolveAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, status: AlarmStatus.RESOLVED } : a));
    setSelectedAlarm(null);
  };

  const handleStartAssessment = (type: AssessmentType) => {
    const newAssessment: Partial<Assessment> = {
      id: `ASS-${Date.now()}`,
      type: type,
      patientName: '张爷爷',
      patientId: 'P-1001',
      status: AssessmentStatus.DRAFT,
      createdAt: new Date().toISOString().split('T')[0],
      triggerReason: 'INITIAL'
    };
    setSelectedAssessment(newAssessment as Assessment);
    setIsAssessing(true);
  };

  const handleCompleteAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsAssessing(false);
    setShowAssessmentResult(true);
  };

  const handleSubmitAssessment = (assessment: Assessment) => {
    console.log('Assessment submitted:', assessment);
    setShowAssessmentResult(false);
    setSelectedAssessment(null);
    setActiveTab('assessment');
  };

  if (selectedAlarm) {
    return (
      <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
          <AlarmDetail 
            alarm={selectedAlarm} 
            onBack={() => setSelectedAlarm(null)} 
            onResolve={handleResolveAlarm}
          />
        </div>
      </div>
    );
  }

  if (isAssessing && selectedAssessment) {
    return (
      <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
          {selectedAssessment.type === 'ENVIRONMENT' ? (
            <EnvironmentalAssessmentForm 
              assessment={selectedAssessment} 
              onBack={() => setIsAssessing(false)} 
              onComplete={handleCompleteAssessment}
            />
          ) : (
            <AssessmentForm 
              assessment={selectedAssessment} 
              onBack={() => setIsAssessing(false)} 
              onComplete={handleCompleteAssessment}
            />
          )}
        </div>
      </div>
    );
  }

  if (showAssessmentResult && selectedAssessment) {
    return (
      <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
          {selectedAssessment.type === 'ENVIRONMENT' ? (
            <EnvironmentalAssessmentResult 
              assessment={selectedAssessment} 
              onBack={() => setShowAssessmentResult(false)} 
              onSubmit={handleSubmitAssessment}
            />
          ) : (
            <AssessmentResult 
              assessment={selectedAssessment} 
              onBack={() => setShowAssessmentResult(false)} 
              onSubmit={handleSubmitAssessment}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header (Hidden on Home Dashboard as it has its own) */}
        {activeTab !== 'home' && (
          <header className="bg-blue-600 text-white p-4 shadow-md z-10">
            <h1 className="text-xl font-bold text-center">
              {activeTab === 'hall' && '任务大厅'}
              {activeTab === 'active' && '执行中工单'}
              {activeTab === 'alarm' && '警报中心'}
              {activeTab === 'assessment' && '能力评估'}
              {activeTab === 'performance' && '绩效与统计'}
              {activeTab === 'profile' && '个人中心'}
            </h1>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 bg-gray-50">
          {activeTab === 'home' && (
            <Dashboard 
              activeTask={activeTask} 
              activeAlarms={alarms} 
              onNavigate={setActiveTab} 
              onSelectAlarm={setSelectedAlarm}
              onStartAssessment={handleStartAssessment}
            />
          )}
          {activeTab === 'hall' && <TaskHall onAccept={handleAcceptTask} hasActiveTask={!!activeTask} />}
          {activeTab === 'active' && <ActiveTask task={activeTask} setTask={setActiveTask} />}
          {activeTab === 'alarm' && <AlarmCenter onSelect={setSelectedAlarm} />}
          {activeTab === 'assessment' && <AssessmentList onStart={handleStartAssessment} onSelect={(a) => { setSelectedAssessment(a); setShowAssessmentResult(true); }} />}
          {activeTab === 'performance' && <Performance />}
          {activeTab === 'profile' && <Profile />}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 pb-safe z-20">
          <NavItem 
            icon={<Home size={20} />} 
            label="首页" 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
          />
          <NavItem 
            icon={<ClipboardList size={20} />} 
            label="大厅" 
            isActive={activeTab === 'hall'} 
            onClick={() => setActiveTab('hall')} 
          />
          <NavItem 
            icon={<MapPin size={20} />} 
            label="执行" 
            isActive={activeTab === 'active'} 
            onClick={() => setActiveTab('active')} 
            badge={activeTask && activeTask.state !== TaskState.COMPLETED}
          />
          <NavItem 
            icon={<ShieldAlert size={20} />} 
            label="警报" 
            isActive={activeTab === 'alarm'} 
            onClick={() => setActiveTab('alarm')} 
            badge={alarms.some(a => a.status === AlarmStatus.TRIGGERED)} 
          />
          <NavItem 
            icon={<ClipboardCheck size={20} />} 
            label="评估" 
            isActive={activeTab === 'assessment'} 
            onClick={() => setActiveTab('assessment')} 
          />
          <NavItem 
            icon={<User size={20} />} 
            label="我的" 
            isActive={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick, badge }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, badge?: boolean | null }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full h-full relative ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
      {badge && (
        <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      )}
    </button>
  );
}
