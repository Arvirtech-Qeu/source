import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { ChartBarIcon } from "lucide-react"; // Ensure this import is correct
import { useEffect } from "react";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const logData = [
  { time: '00:00', value: 30 },
  { time: '04:00', value: 45 },
  { time: '08:00', value: 75 },
  { time: '12:00', value: 120 },
  { time: '16:00', value: 85 },
  { time: '20:00', value: 60 },
  { time: '23:59', value: 40 },
];

const LogChart: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Ensure theme and toggleTheme are being used if required

  useEffect(() => {
    // Use this to handle any side effects like fetching log data, etc.
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
      className="relative backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-opacity-20 bg-gradient-to-br"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-red-600">
            System Logs
          </h2>
          <p className={`${theme === 'light' ? 'text-gray-600 ' : 'text-gray-600'}`}>
            Real-time monitoring
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-3 ">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2  rounded-lg bg-white/5 border border-gray-300 hover:border-white/20 transition-colors"
          >
            <ChartBarIcon className="w-5 h-5 text-red-600" />
          </motion.button>
          <select className={`bg-white/5 border border-gray-300  rounded-lg px-3 py-1.5 ${theme === 'light' ? 'text-gray-600 text-sm ' : 'text-gray-600 text-sm '}`}>
            <option>Last 24h</option>
            <option>Last Week</option>
            <option>Last Month</option>
          </select>
        </div>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={200} className="mt-20">
        <AreaChart data={logData}>
          <defs>
            <linearGradient id="logGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis dataKey="time" stroke={`${theme === 'light' ? 'rgba(25,7,29,0.8)' : 'rgba(25,7,29,0.8)'}`} />
          <YAxis stroke={`${theme === 'light' ? 'rgba(25,7,29,0.8)' : 'rgba(25,7,29,0.8)'}`} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#14b8a6" fill="url(#logGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LogChart;