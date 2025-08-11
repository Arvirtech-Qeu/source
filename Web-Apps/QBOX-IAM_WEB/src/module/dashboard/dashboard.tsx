import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardCard from './dashboard-card-props';
import RecentActivity from './recent-activities';
import { ApiService } from '@/services/apiServices';
import LogChart from './log-chart';
import { useNavigate } from 'react-router-dom';
import { setSelectedItem } from "@/redux/features/sideBarSlice";
import { useDispatch } from 'react-redux';
import { mockUser } from '@/pages/layout';



const Dashboard: React.FC = () => {

  const [stats, setStats] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getDashboard = async () => {
    try {
      const params = {};
      const data = await ApiService('8914', 'get', '/get_dashboard', null, params); // Ensure ApiService returns a promise
      const dashboardData = data?.data?.data || [];
      setStats(dashboardData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Call getDashboard when the component is mounted
  useEffect(() => {
    getDashboard();
  }, []);


  const handleCardClick = (title: any) => {
    if (title === "Total DBTable") {
      dispatch(setSelectedItem('Database Tables'))
      navigate('/database/tables');
    } else if (title === "Total Roles") {
      dispatch(setSelectedItem('Roles'))
      navigate('/roles');
    } else if (title === "Modules") {
      dispatch(setSelectedItem('Modules'))
      navigate('/modules');
    } else if (title === "Menus") {
      dispatch(setSelectedItem('Menu Management'))
      navigate('/menu/menu-list');
    } else {
      dispatch(setSelectedItem('Permissions'))
      navigate('/permissions');
    }
  }

  return (
    <div className="min-h-screen bg-white p-8" >
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">IAM Dashboard</h1>
          {/* <p className="text-[hsl(var(--muted-foreground))]">Welcome back, {mockUser.authUserName.split('@')[0].charAt(0).toUpperCase() + mockUser.authUserName.split('@')[0].slice(1)} */}
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            {...stat}
            onClick={() => handleCardClick(stat.title)} // Pass the title to handleClick
          />
        ))}
      </div>


      {/* Charts and Activity Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="lg:col-span-2 space-y-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* <LogChart />
          <RecentActivity /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        </div>
      </motion.div>

    </div>
    // </div>
  );
};

export default Dashboard;