import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDetailsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [profilePicture, setProfilePicture] = useState('https://cdn-icons-png.freepik.com/256/14723/14723957.png?semt=ais_hybrid');
  const fileInputRef = useRef(null);

  const [userDetails, setUserDetails] = useState({
    username: 'Rajkumar S',
    email: 'rajkumars0143@quebox.com',
    phone: '+91 9840858983',
    dob: 'DD/MM/YYYY',
    location: 'Sholinganallur'
  });

  const tabs = ['General', 'Roles', 'Hotbox Assigned', 'Performance', 'Permissions & Security'];

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    // fileInputRef.current.click();
  };

  // Handle profile picture update
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type and size
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (isValidType && isValidSize) {
        const reader = new FileReader();
        reader.onload = (event) => {
          //   setProfilePicture(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
      }
    }
  };

  // Handle profile picture delete
  const handleDeletePicture = () => {
    setProfilePicture('/api/placeholder/64/64'); // Reset to placeholder
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <a onClick={() => navigate(-1)} className="text-color flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ml-1">Back</span>
        </a>
        <h1 className="text-xl font-semibold ml-4">User Details</h1>
      </div>

      {/* Tabs */}
      <div className="border-b mb-8">
        <div className="flex flex-nowrap overflow-x-auto">
          {tabs.map((tab) => (
            <div key={tab} className={`mr-6 pb-3 whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-color' : ''}`}>
              <button
                className={`${activeTab === tab ? 'text-color' : 'text-gray-500'} font-medium text-sm`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeTab === 'General' && (
        <>
          {/* Profile Picture Section */}
          <div className="mb-8">
            <h2 className="font-medium mb-1">Profile Picture</h2>
            <p className="text-sm text-gray-500 mb-4">Your picture must be PNG, JPEG under 10MB</p>

            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>

              <div className="flex space-x-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <button
                  className="px-4 py-2 bg-color text-white rounded-md text-sm"
                  onClick={triggerFileUpload}
                >
                  Update Picture
                </button>

                <button
                  className="px-4 py-2 bg-red-50 text-color rounded-md text-sm"
                  onClick={handleDeletePicture}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* User Details Form */}
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="flex items-center relative">
                <div className="absolute left-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={userDetails.username}
                  readOnly
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-md text-gray-700"
                />
                <button className="absolute right-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center relative">
                <div className="absolute left-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={userDetails.email}
                  readOnly
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-md text-gray-700"
                />
                <button className="absolute right-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="flex items-center relative">
                <div className="absolute left-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27103 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.21649 3.36163C2.3051 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.05074 2.28271 3.30534 2.17052C3.55994 2.05833 3.83577 2.00026 4.12 2H7.12C7.62475 1.99522 8.1142 2.16708 8.49452 2.48353C8.87484 2.79999 9.12033 3.23945 9.19 3.72C9.33683 4.68007 9.59995 5.6227 9.97 6.53C10.1231 6.88792 10.1743 7.27691 10.1188 7.65088C10.0632 8.02485 9.90284 8.37344 9.65 8.65L8.21 10.07C9.63676 12.5738 11.696 14.6252 14.21 16.05L15.63 14.63C15.9066 14.3771 16.2552 14.2168 16.6291 14.1612C17.0031 14.1057 17.3921 14.1569 17.75 14.31C18.6573 14.68 19.5999 14.9432 20.56 15.09C21.0405 15.1597 21.48 15.4052 21.7964 15.7855C22.1129 16.1659 22.2847 16.6553 22.28 17.16L22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={userDetails.phone}
                  readOnly
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-md text-gray-700"
                />
                <button className="absolute right-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <div className="flex items-center relative">
                <div className="absolute left-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={userDetails.dob}
                  readOnly
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-md text-gray-700"
                />
                <button className="absolute right-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="flex items-center relative">
                <div className="absolute left-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={userDetails.location}
                  readOnly
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-md text-gray-700"
                />
                <button className="absolute right-4 text-color">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Roles' && (
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-medium mb-4">User Roles</h2>
          <p className="text-gray-500">Role management content goes here</p>
        </div>
      )}

      {activeTab === 'Hotbox Assigned' && (
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-medium mb-4">Hotbox Assignment</h2>
          <p className="text-gray-500">Hotbox assignment content goes here</p>
        </div>
      )}

      {activeTab === 'Performance' && (
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-medium mb-4">User Performance</h2>
          <p className="text-gray-500">Performance metrics and reports goes here</p>
        </div>
      )}

      {activeTab === 'Permissions & Security' && (
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-medium mb-4">Permissions & Security Settings</h2>
          <p className="text-gray-500">Security settings and permission management goes here</p>
        </div>
      )}
    </div>
  );
}