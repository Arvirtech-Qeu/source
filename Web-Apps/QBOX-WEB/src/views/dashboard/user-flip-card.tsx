import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  IdCard
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@state/store';
import { getUserByQboxEntity } from '@state/authnSlice';
import { useLocation } from 'react-router-dom';
import clsx from "clsx";

interface InwardOrdersProps {
  qboxEntitySno: any;
}

// EmptyState Component
const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 text-gray-500 text-sm">{message}</div>
);

// const UserGrid = () => {
const UserGrid: React.FC<InwardOrdersProps> = ({ qboxEntitySno }) => {

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { qboxEntityUserList } = useSelector((state: RootState) => state.authnSlice);
  // const qboxEntitySno = location.state?.qboxEntitySno || new URLSearchParams(location.search).get("qboxEntitySno");
  const [activeTab, setActiveTab] = useState('loader');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (qboxEntitySno) {
      dispatch(getUserByQboxEntity({ qboxEntitySno }));
    }
  }, [qboxEntitySno, dispatch]);

  const loaders = qboxEntityUserList?.loaders || [];
  const supervisors = qboxEntityUserList?.supervisors || [];


  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('loader')}
              className={clsx(
                'py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm',
                activeTab === 'loader'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <User className="w-4 h-4" />
              Loader
            </button>
            <button
              onClick={() => setActiveTab('supervisor')}
              className={clsx(
                'py-4 px-6 inline-flex items-center gap-2 border-b-2 font-medium text-sm',
                activeTab === 'supervisor'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <User className="w-4 h-4" />
              Supervisor
            </button>
          </nav>
        </div>
      </div>

      {/* Loader Cards */}
      {activeTab === "loader" && (
        loaders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loaders.map((user, index) => (
              <UserCard
                user={user}
                role="loader"
                key={user.id || index}
                isExpanded={expandedCardId === user.id}
                onToggle={() => setExpandedCardId(prev => (prev === user.id ? null : user.id))}
              />
            ))}
          </div>
        ) : <EmptyState message="No loaders found" />
      )}

      {/* Supervisor Cards */}
      {activeTab === "supervisor" && (
        supervisors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {supervisors.map((user, index) => (
              <UserCard
                user={user}
                role="supervisor"
                key={user.id || index}
                isExpanded={expandedCardId === user.id}
                onToggle={() => setExpandedCardId(prev => (prev === user.id ? null : user.id))}
              />
            ))}
          </div>
        ) : <EmptyState message="No supervisors found" />
      )}
    </div>
  );
};

const UserCard = ({
  user,
  role,
  isExpanded,
  onToggle
}: {
  user: any,
  role: 'loader' | 'supervisor',
  isExpanded: boolean,
  onToggle: () => void
}) => {
  const roleColors = {
    loader: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      badge: 'bg-blue-100 text-blue-800',
      ring: 'ring-blue-200',
    },
    supervisor: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      badge: 'bg-green-100 text-green-800',
      ring: 'ring-green-200',
    },
  };

  const colors = roleColors[role] || roleColors.loader;

  return (
    <div className={`rounded-xl border ${colors.border} overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${colors.bg}`}>
      <div className="p-5">
        {/* Top Section */}
        <div className="flex items-start space-x-4">
          <div className="relative flex-shrink-0">
            <div className={`h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ${colors.ring}`}>
              {user?.media_link?.mediaUrl ? (
                <img
                  src={JSON.parse(user.media_link.mediaUrl).mediaUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ${colors.iconBg} ${colors.text}`}>
              {role === 'loader' ? <Phone className="h-3 w-3" /> : <User className="h-3 w-3" />}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{user.profileName}</h3>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
                {user.roleName}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center space-x-3">
            <Mail className={`h-4 w-4 ${colors.text}`} />
            <p className="text-sm text-gray-600 truncate">{user.email || 'Not provided'}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className={`h-4 w-4 ${colors.text}`} />
            <p className="text-sm text-gray-600">{user.contact || 'Not provided'}</p>
          </div>
          <div className="flex items-center space-x-3">
            <IdCard className={`h-4 w-4 ${colors.text}`} />
            <p className="text-sm text-gray-600">{user.aadharNumber || 'Not provided'}</p>
          </div>

          {/* <div className='border border-color rounded-full p-2 low-bg-color'>
            <div className="flex items-center space-x-3">
              <Calendar className={`text-color h-5 w-5 mt-0.5 ${colors.text}`} />
              <div>
                <p className="text-sm font-semibold text-gray-800">{user.shiftTiming || 'Not provided'}</p>
              </div>
            </div>
          </div> */}
          {role === 'loader' && (
            <div className='border border-color rounded-full p-2 low-bg-color'>
              <div className="flex items-center space-x-3">
                <Calendar className={`text-color h-5 w-5 mt-0.5 ${colors.text}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.shiftTiming || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {/* {isExpanded && ( */}
      <div className={`border-t ${colors.border} px-5 py-4 bg-white/70`}>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Building className={`h-5 w-5 mt-0.5 ${colors.text}`} />
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Qbox Entity</p>
              <p className="text-sm text-gray-800">{user.qboxEntityName || 'Not available'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className={`h-5 w-5 mt-0.5 ${colors.text}`} />
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Created On</p>
              <p className="text-sm text-gray-800">
                {user.createdOn ? new Date(user.createdOn).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                }) : 'Not available'}
              </p>
            </div>
          </div>
          {user.supervisorDetails && (
            // <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <User className={`h-5 w-5 ${colors.text}`} />
              <div>
                <p className="text-xs font-medium text-gray-500">Supervisor</p>
                <p className="text-sm font-medium text-gray-800">
                  {user.supervisorDetails.supervisorName || 'Not assigned'}
                </p>
              </div>
              {/* </div> */}
            </div>
          )}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default UserGrid;
