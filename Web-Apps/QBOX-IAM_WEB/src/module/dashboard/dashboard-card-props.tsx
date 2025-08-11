import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons
import { useTheme } from '@/hooks/useTheme';

type DashboardCardProps = {
  icon: keyof typeof LucideIcons; // Restrict the icon to valid keys from react-icons
  title: string;
  count: number;
  onClick?: (title: string) => void; // Add onClick handler prop
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon, onClick }) => {
  const IconComponent = LucideIcons[icon] as React.ElementType;
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {

  }, []
  )
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{
        duration: 0.7,
        type: "spring",
        stiffness: 90,
        damping: 15
      }}
      className={`
        relative group
        backdrop-blur-xl rounded-2xl p-6 
        border border-opacity-20 ${theme === 'light' ? 'bg-white ' : 'bg-white '}
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        hover:shadow-2xl hover:shadow-blue-500/10
        transition-all duration-500
        after:content-[''] after:absolute after:inset-0 
        after:opacity-0 after:transition-opacity
        after:duration-500 hover:after:opacity-100
        after:rounded-2xl after:blur-3xl after:-z-10
        overflow-hidden
        before:content-[''] before:absolute before:inset-0
        before:bg-gradient-to-br before:from-white/5 before:to-transparent
        before:rounded-2xl before:opacity-0 before:transition-opacity
        before:duration-500 hover:before:opacity-100
      `}
      onClick={() => onClick?.(title)} // Add onClick handler here
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="p-3.5 rounded-xl backdrop-blur-lg border
            bg-gradient-to-br from-white/10 to-white/5
            shadow-lg relative overflow-hidden
            before:content-[''] before:absolute before:inset-0
            before:bg-gradient-to-br before:from-white/10 before:to-transparent
            before:opacity-0 before:transition-opacity before:duration-300
            hover:before:opacity-100"
        >
          {IconComponent && <IconComponent className="w-6 h-6 text-red-600 transition-all duration-300 group-hover:scale-110 relative z-10" />}
        </motion.div>
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-sm font-medium text-red-600   opacity-80 mb-1"
        >
          {title}
        </motion.p>
        <motion.h3
          className="text-3xl font-bold text-red-600 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {count.toLocaleString()}
        </motion.h3>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
