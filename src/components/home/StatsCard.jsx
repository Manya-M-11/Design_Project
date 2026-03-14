import React from 'react';

const colorMap = {
  emerald: { iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
  blue: { iconBg: 'bg-blue-50', iconText: 'text-blue-600' },
  amber: { iconBg: 'bg-amber-50', iconText: 'text-amber-600' },
  purple: { iconBg: 'bg-purple-50', iconText: 'text-purple-600' },
  rose: { iconBg: 'bg-rose-50', iconText: 'text-rose-600' }
};

export default function StatsCard({ icon: Icon, value, label, color = 'emerald' }) {
  const styles = colorMap[color] || colorMap.emerald;

  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-xl shadow-emerald-200/40 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl p-3 ${styles.iconBg}`}>
          <Icon className={`w-6 h-6 ${styles.iconText}`} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

