import React, { useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import '/src/App.css'
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCog,
  UserCheck,
  User
} from "lucide-react";


const getRoleIcon = (roleName: any) => {
  switch (roleName.toLowerCase()) {
    case 'admin':
      return <Shield className="h-6 w-6" />;
    case 'superadmin':
      return <UserCog className="h-6 w-6" />;
    case 'teacher':
      return <UserCheck className="h-6 w-6" />;
    default:
      return <User className="h-6 w-6" />;
  }
};

const RoleCard = ({ role, isActive, onClick }: any) => {
  // Different icons for different role types

  return (
    <motion.div
      whileHover={{ y: -5 }}
      // whileTap={{ scale: 0.98 }}
      className="px-2"
    >
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1.05 : 1,
          y: isActive ? -10 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card
          onClick={onClick}
          className={`
            relative w-48 h-32 cursor-pointer
            transition-all duration-300
            ${isActive
              ? 'bg-red-600 text-black shadow-lg'
              : 'bg-white text-black shadow-lg'
            }
          `}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className={`w-full h-full opacity-10 transform rotate-180 ${isActive ? 'text-white' : 'text-white'
                }`}
              fill="red"
              viewBox="0 0 40 40"
            >
              <pattern
                id="pattern-circles"
                x="0"
                y="0"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
          </div>

          <div className="relative p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-white text-red-600'
                }`}>
                {getRoleIcon(role.roleName)}
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-3 w-3 rounded-full bg-green-400 shadow-lg"
                />
              )}  
            </div>

            <div>
              <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-red-600'
                }`}>
                {role.roleName}
              </h3>
              <p className={`text-sm ${isActive ? 'text-white/80' : 'text-white/80'
                }`}>
                {/* {role.permissions?.length || 0} Permissions */}
              </p>
            </div>
          </div>

          {/* Selection Indicator */}
          {/* <motion.div
            initial={false}
            animate={{
              width: isActive ? '100%' : '0%',
            }}
            className="absolute bottom-0 left-0 h-1 bg-indigo-300"
            style={{ borderRadius: '0 0 0.5rem 0.5rem' }}
          /> */}
        </Card>
      </motion.div>
    </motion.div>
  );
};

const RoleSelector = ({ roleList, activeTab, setActiveTab, handleRoleClick, searchTerm }: any) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction: any) => {  
    const container: any = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredRoles = roleList?.filter((role: any) =>
    role.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // const selectedRole = roleList?.find((role: any) => role.roleId === activeTab);
  const selectedRole = filteredRoles?.find((role: any) => role.roleId === activeTab) || null;

  return roleList?.length > 0 ? (
    <div className="relative mb-8">
      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-20 to-transparent" />

      {/* Scroll Buttons */}
      {filteredRoles?.length > 5 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="absolute left-2 z-20 bg-red-600  rounded-full p-2 shadow-lg hover:shadow-xl" style={{ top: '70px' }}
          >
            <ChevronLeft className="h-6 w-6 text-white " />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="absolute right-2 z-20 bg-red-600 rounded-full p-2 shadow-lg hover:shadow-xl" style={{ top: '70px' }}
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </motion.button>
        </> 
      )}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide py-6 px-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <AnimatePresence>
          {filteredRoles?.length > 0 ? (
            <motion.div
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {filteredRoles?.map((role: any) => (
                <RoleCard
                  key={role.roleId}
                  role={role}
                  isActive={activeTab === role.roleId}
                  onClick={() => {
                    setActiveTab(role.roleId);
                    handleRoleClick(role.roleId);
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-64"
            >
              <User className="h-8 w-8 text-red-600" />
              <p className="mt-4 text-gray-500">No roles found for "{searchTerm}".</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Role Display */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-black py-4 mt-4 flex justify-center"
        >
          {/* {getRoleIcon(selectedRole.roleName)} */}
          <div className='flex  bg-red-600 text-white  py-4 rounded-lg p-5'>
            <h3 className="font-semibold">Selected Role : {selectedRole.roleName}</h3>
          </div>
        </motion.div>
      )}
    </div>
  ) : (
    <>
      <div className='flex justify-center mt-20'>
        {/* <img src="/src/image.png" alt="Light Theme Image" className=" h-54" /> */}
        <img src="/src/assets/data_not_found.png" className="h-96" alt="No Data" />
      </div>
    </>
  );
};

export default RoleSelector;