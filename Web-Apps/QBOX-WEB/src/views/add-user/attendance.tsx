import React, { useState, useEffect } from 'react';
import { UserCircle, Calendar, Clock, CheckCircle, LogOut, ChevronDown, Bell, Search, Activity, BarChart, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { createAttendanceRecord, getAttendanceSummary, getTodayAttendance, updateAttendanceRecord } from '@state/attendanceSlice';
import { useLocation } from 'react-router-dom';

interface UserData {
  contact: string;
  roleName: string;
  profileName: string;
  aadharNumber: string;
  authUserName: string;
  supervisorName: string;
  mediaLink: {
    mediaUrl: string;
  };
  additionalDetails: Array<{
    createdOn: string;
    qboxEntitySno: number;
  }>;
}

export default function EnhancedLoaderAttendanceSystem() {

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [auth_user, setAuthUserId]: any = useState(localStorage.getItem('user'));
  const user = JSON.parse(auth_user);
  // const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { todayAttendanceList, allAttendanceList } = useSelector((state: RootState) => state.attendance);
  // const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const isCheckedIn = !!todayAttendanceList?.data;
  const hasCheckedOut = todayAttendanceList?.data?.checkOutTime !== null;
  const currectTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
  const currectDate = new Date().toISOString().split('T')[0];
  const searchParams = new URLSearchParams(location.search);
  const qboxEntitySno = searchParams.get('qboxEntitySno');
  const qboxEntityName = searchParams.get('qboxEntityName');


  useEffect(() => {
    if (qboxEntitySno) {
      // fetch attendance data for qboxEntitySno
      dispatch(getTodayAttendance({
        authUserId: user?.loginDetails?.authUserId,
        date: currectDate,
        qboxEntitySno: qboxEntitySno
      }));
      dispatch(getAttendanceSummary({ authUserId: user?.loginDetails?.authUserId, qboxEntitySno: qboxEntitySno }));
    }
  }, [qboxEntitySno]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(getAttendanceSummary({ authUserId: user?.loginDetails?.authUserId, qboxEntitySno: qboxEntitySno }));
  }, [dispatch]);

  // Date formatting
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentTime.toLocaleDateString('en-US', dateOptions);
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Stats data
  const statsData = {
    weeklyHours: 34.5,
    monthlyAttendance: 98,
    streakDays: 14
  };

  const handleCheckInOut = () => {
    // setIsCheckedIn(!isCheckedIn);
  };

  const handleCheckIn = async () => {
    try {
      const payload = {
        authUserId: user?.loginDetails?.authUserId,
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkInTime: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        checkOutTime: null,
        remarks: 'On time',
        barcodeValue: `USER${user?.loginDetails?.authUserId}-CHECKIN`,
        scannedBy: 201,
        qboxEntitySno: qboxEntitySno
      };

      await dispatch(createAttendanceRecord(payload));
      await dispatch(getTodayAttendance({
        authUserId: user?.loginDetails?.authUserId,
        date: currectDate,
        qboxEntitySno: qboxEntitySno
      }));
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const payload = {
        authUserId: user?.loginDetails?.authUserId,
        date: new Date().toISOString().split('T')[0],
        checkOutTime: currectTime,
        remarks: 'Left on time',
        qboxEntitySno: qboxEntitySno
      };

      // const response = await axios.put('/api/updateAttendanceRecord', payload);
      await dispatch(updateAttendanceRecord({
        ...payload,
      }));
      dispatch(getTodayAttendance({
        authUserId: user?.loginDetails?.authUserId,
        date: currectDate,
        qboxEntitySno: qboxEntitySno
      }));
    } catch (error) {
      console.error('Check-out failed:', error);
    }
  };

  const userName = user?.loginDetails?.profileName; // Replace with your actual name source

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || parts[0]?.[1] || ""; // If no last name, take second letter of first name
    return (first + second).toUpperCase();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };



  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-color text-white">
          <div className="text-2xl font-bold">Attendance Track</div>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-6 pt-4 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="h-20 w-20 rounded-full custom-gradient-right flex items-center justify-center text-white text-2xl font-bold mb-2">
                {getInitials(userName)}
              </div>
              {isCheckedIn && (
                <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <h3 className="mt-2 text-xl font-semibold">{user?.profileName}</h3>
            <h4>Welcome back, {userName}</h4>
            <p className="text-color text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              {/* <h1 className="text-xl font-semibold text-gray-800 md:hidden">LoadTrack</h1> */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1 low-bg-color text-color rounded-full">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center px-3 py-1 low-bg-color text-color rounded-full">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{formattedTime}</span>
              </div>

            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Attendance Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="bg-color px-6 py-8 text-white relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mt-12 -mr-12"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -mb-8 -ml-8"></div>

                {/* <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.loginDetails?.profileName}!</h2> */}
                <h2 className="text-2xl font-bold mb-1">{qboxEntityName} Delivery Location</h2>
                <p className="text-blue-100 mb-6">Track your attendance and manage your shifts easily.</p>

                <div className="flex flex-wrap items-center">
                  <div className="mr-8 mb-4">
                  </div>
                  {/* {isCheckedIn && ( */}
                  <div className="mr-8 mb-4">
                    <div className="text-blue-200 text-sm mb-1">TIME IN</div>
                    <div className="font-medium">  {todayAttendanceList?.data?.checkInTime ? todayAttendanceList.data.checkInTime : '--'}
                    </div>
                  </div>
                  {/* )} */}
                  <div className="mr-8 mb-4">
                    <div className="text-blue-200 text-sm mb-1">TIME OUT</div>
                    <div className="font-medium">  {todayAttendanceList?.data?.checkOutTime ? todayAttendanceList.data.checkOutTime : '--'}
                    </div>
                  </div>
                  <div className="mr-8 mb-4">
                    <div className="text-blue-200 text-sm mb-1">Today's Date</div>
                    <div className="font-medium">{getCurrentDate()}</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                  <h3 className="text-gray-800 text-xl font-semibold mb-4 sm:mb-0">Attendance Actions</h3>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Inactive</span>
                    </div>
                  </div>
                </div>

                <div className="low-bg-color rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-center sm:text-left mb-6 sm:mb-0">
                    {/* <h4 className="text-lg font-semibold text-gray-800">
                      {isCheckedIn ? 'Currently On Shift' : 'Ready to Start Your Shift?'}
                    </h4> */}
                    <h4>
                      {isCheckedIn && hasCheckedOut
                        ? 'Attendance Closed'
                        : isCheckedIn && !hasCheckedOut
                          ? 'Currently On Shift'
                          : 'Not Checked In'}
                      <p className="text-gray-600 mt-1">
                        {isCheckedIn
                          ? 'Click the button to check out when you finish your work'
                          : 'Click the button to check in and start tracking your time'}
                      </p>
                    </h4>
                  </div>

                  <button
                    onClick={
                      isCheckedIn && !hasCheckedOut
                        ? handleCheckOut
                        : !isCheckedIn
                          ? handleCheckIn
                          : undefined // No action if both check-in and check-out are done
                    }
                    disabled={isCheckedIn && hasCheckedOut} // disable when attendance is closed
                    className={`px-8 py-3 rounded-lg font-medium text-white shadow-md transform transition-all duration-200 hover:scale-105 
    ${isCheckedIn && hasCheckedOut
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isCheckedIn
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                  >
                    <div className="flex items-center">
                      {isCheckedIn && hasCheckedOut ? (
                        <>Attendance Closed</>
                      ) : isCheckedIn && !hasCheckedOut ? (
                        <>
                          <LogOut className="h-5 w-5 mr-2" />
                          Log Out
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Log In
                        </>
                      )}
                    </div>
                  </button>


                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Weekly Hours</h3>
                    <div className="text-2xl font-bold text-gray-800">{allAttendanceList?.weeklyHours} hrs</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Monthly Attendance</h3>
                    <div className="text-2xl font-bold text-gray-800">{allAttendanceList?.monthlyAttendanceCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Recent Attendance</h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} />
                </button>
              </div>

              {showDetails && (
                <>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allAttendanceList?.attendanceRecords?.map((record, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{record.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{record.checkInTime}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{record.checkOutTime}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{record.workingHours}</td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}