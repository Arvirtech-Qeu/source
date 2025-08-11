import { useTheme } from "@/hooks/useTheme";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { BellIcon, ChartBarIcon, ShieldCheckIcon } from "lucide-react";


const RecentActivity: React.FC = () => {
  const { theme, toggleTheme } = useTheme();


  const activities = [
    {
      title: "New user registered",
      time: "2 minutes ago",
      icon: <UserGroupIcon className="w-4 h-4" />,
      color: "violet",
    },
    {
      title: "System update completed",
      time: "1 hour ago",
      icon: <ChartBarIcon className="w-4 h-4" />,
      color: "fuchsia",
    },
    {
      title: "Security alert detected",
      time: "3 hours ago",
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      color: "pink",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      className="relative backdrop-blur-xl rounded-2xl p-6 
        border border-opacity-20 
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        hover:shadow-2xl hover:shadow-violet-500/10
        transition-all duration-500
        group"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 shadow-xl rounded-2xl bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header Section */}
      <div className={`flex items-center justify-between mb-8 relative z-10`}>
        <div>
          <h2 className={` text-xl font-bold bg-gradient-to-r from-white to-violet-200 bg-clip-text ${theme === 'light' ? 'text-red-600 ' : 'text-red-600'}`}>

            Recent Activity
          </h2>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600 mt-1 ' : 'text-gray-600 mt-1'}`}>Latest system events</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={`p-2 rounded-lg bg-white/5 ${theme === 'light' ? 'border border-gray-300' : 'border border-gray-300 hover:border-white/20 transition-colors'}`}
        >
          <BellIcon className="text-red-600" />
        </motion.button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: 0.1 + index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            key={index}
            className="relative group/item"
          >
            <div
              className={`absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full 
    bg-gradient-to-br from-${activity.color}-500/20 to-${activity.color}-500/20 
    ${theme === 'light' ? 'border-gray-400  ' : 'border-gray-400'} 
    border flex items-center justify-center`}
            >
              <div
                className={`w-2 h-2 rounded-full 
      ${theme === 'light' ? 'bg-${activity.color}-500/20' : `bg-${activity.color}-500/20`}`}
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={` ${theme === 'light' ? ' ml-6 p-4 rounded-xl bg-white/5 border border-gray-300  transition-all duration-300 cursor-pointer' : ' ml-6 p-4 rounded-xl bg-white/5 border border-gray-300  transition-all duration-300 cursor-pointer'}`}
            >
              <div className="flex items-center justify-between ">
                <div className="flex-1">
                  <p className={`${theme === 'light' ? 'text-black mt-1 text-xs ' : 'text-black mt-1 text-xs'}`}>
                    {activity.title}
                  </p>
                  <p className={`${theme === 'light' ? 'text-gray-600 mt-1 text-xs ' : 'text-gray-600 mt-1 text-xs'}`}>
                    {activity.time}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className={`w-8 h-8 rounded-lg ${theme === 'light' ? 'text-violet-700 border border-gray-300 ' : 'text-violet-700 border border-gray-300'}
                    bg-gradient-to-br from-${activity.color}-500/20 to-${activity.color}-500/10 
                    border border-${activity.color}-700/20
                    flex items-center justify-center 
                    text-${activity.color}-600`}
                >
                  {activity.icon}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className={`${theme === 'light' ? ' mt-6 pt-6 border-t border-gray-300 flex justify-between items-center' : 'mt-6 pt-6 border-t border-gray-300 flex justify-between items-center'}`}>
        <p className={`text-sm ${theme === 'light' ? 'text-black ' : 'text-black'}`} >Showing recent 3 of 24 activities  </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className={`px-4 py-2 text-sm font-medium rounded-lg 
           border border-violet-400/0 
            hover:bg-violet-500/20 transition-colors  ${theme === 'light' ? 'text-gray-800 ' : 'text-gray-800'}`}
        >
          View All
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecentActivity;