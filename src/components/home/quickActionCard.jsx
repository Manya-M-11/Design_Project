import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '../../Layout/utils';

const accentStyles = {
  rose: { iconBg: 'bg-rose-50', iconText: 'text-rose-600', accent: 'text-rose-600' },
  blue: { iconBg: 'bg-blue-50', iconText: 'text-blue-600', accent: 'text-blue-600' },
  emerald: { iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', accent: 'text-emerald-600' },
  purple: { iconBg: 'bg-purple-50', iconText: 'text-purple-600', accent: 'text-purple-600' },
  amber: { iconBg: 'bg-amber-50', iconText: 'text-amber-600', accent: 'text-amber-600' }
};

export default function QuickActionCard({ icon: Icon, title, description, page, color = 'emerald', delay = 0 }) {
  const styles = accentStyles[color] || accentStyles.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="h-full rounded-[28px] border border-white/40 bg-white/80 p-5 shadow-2xl shadow-emerald-200/30 backdrop-blur-xl"
    >
      <Link
        to={createPageUrl(page)}
        className="flex h-full flex-col justify-between gap-4"
      >
        <div className="flex items-center justify-between">
          <div className={`rounded-2xl p-3 ${styles.iconBg} shadow-sm`}>
            <Icon className={`w-6 h-6 ${styles.iconText}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${styles.accent}`}>
            Go
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <div className="flex items-center justify-between text-sm font-medium text-emerald-600">
          <span className="text-emerald-700/80">Open</span>
          <ArrowRight className="w-4 h-4 text-emerald-700/80" />
        </div>
      </Link>
    </motion.div>
  );
}

