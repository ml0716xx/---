import React from 'react';
import { User, Settings, Bell, FileText, ChevronRight, Shield } from 'lucide-react';

export default function Profile() {
  return (
    <div className="bg-gray-50 min-h-full pb-20">
      {/* Header Profile */}
      <div className="bg-blue-600 px-6 pt-6 pb-12 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-300">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold">李师傅</h2>
            <div className="flex items-center mt-1 space-x-2 text-blue-100 text-sm">
              <span className="bg-blue-500 px-2 py-0.5 rounded-full text-xs">高级护理员</span>
              <span>工号: NO.8842</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats overlapping header */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex justify-around text-center">
          <div>
            <div className="text-xl font-bold text-gray-800">128</div>
            <div className="text-xs text-gray-500 mt-1">累计服务(单)</div>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div>
            <div className="text-xl font-bold text-gray-800">4.9</div>
            <div className="text-xs text-gray-500 mt-1">综合评分</div>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div>
            <div className="text-xl font-bold text-gray-800">3</div>
            <div className="text-xs text-gray-500 mt-1">技能认证</div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-6 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={<FileText className="text-blue-500" />} label="数字档案查阅" />
          <MenuItem icon={<Shield className="text-green-500" />} label="入户授权记录" />
          <MenuItem icon={<Bell className="text-orange-500" />} label="设备预警通知" badge="2" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={<User className="text-gray-500" />} label="个人资料" />
          <MenuItem icon={<Settings className="text-gray-500" />} label="系统设置" />
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, badge }: { icon: React.ReactNode, label: string, badge?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </button>
  );
}
