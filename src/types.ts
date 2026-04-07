import { TaskState } from './lib/stateMachine';

export enum AlarmStatus {
  TRIGGERED = 'TRIGGERED',         // 警报触发
  RESPONDED = 'RESPONDED',         // 已接警
  ARRIVED = 'ARRIVED',             // 已到达现场
  PROCESSING = 'PROCESSING',       // 处理中
  RESOLVED = 'RESOLVED',           // 已解决
  SUSPENDED = 'SUSPENDED'          // 异常挂起
}

export enum AssessmentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED'
}

export interface AssessmentItem {
  id: string;
  question: string;
  options: { label: string; score: number }[];
  selectedScore?: number;
  evidence?: string[]; // URLs to photos/videos
}

export type AssessmentType = 'ADL' | 'IADL' | 'ENVIRONMENT';

export interface Assessment {
  id: string;
  type: AssessmentType;
  patientName: string;
  patientId: string;
  status: AssessmentStatus;
  items: AssessmentItem[];
  totalScore?: number;
  level?: string; // For ADL: 'SELF_CARE' | 'MILD_MODERATE' | 'SEVERE'; For ENV: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string;
  updatedAt: string;
  triggerReason?: 'INITIAL' | 'PERIODIC' | 'ACCIDENT';
}

export interface Alarm {
  id: string;
  type: 'FALL' | 'SOS' | 'INACTIVITY' | 'VITAL_SIGNS';
  level: 'CRITICAL' | 'WARNING';
  patientName: string;
  address: string;
  lat: number;
  lon: number;
  triggerTime: string;
  respondTime?: string;
  status: AlarmStatus;
  deviceInfo?: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'CARE' | 'MAINTENANCE';
  patientName?: string;
  deviceName?: string;
  address: string;
  lat: number;
  lon: number;
  distance: number;
  skills: string[];
  state: TaskState;
  time: string;
  reward: number;
  entryCode?: string;
}
