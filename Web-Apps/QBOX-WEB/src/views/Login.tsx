import React, { useState } from 'react';
import { Eye, EyeOff, ChevronRight, ArrowRight } from 'lucide-react';
import { apiService } from '@services/apiService';
import type { ApiResponse } from '../types/apiTypes';
import { toast } from 'react-toastify';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '@assets/images/q-logo.png';

const PORT = import.meta.env.VITE_API_QBOX_AUTHN_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_AUTHN_PREFIX_URL;

const LoginPage = () => {

  const navigate = useNavigate();
  const { login, logout, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const params = {
      authUserName: formData.email,
      password: formData.password,
      isTempPassword: false,
      deviceId: "12345"
    }
    // setIsLoading(true);
    const response = await apiService.post<ApiResponse<any>>('login', params, PORT, PRIFIX_URL);
    console.log(response)
    const loginDetails = response?.data || {};
    loginDetails.profileName = loginDetails.profileName ?? 'User Name';
    loginDetails.roleName = loginDetails.roleName ?? 'Role Name';
    loginDetails.media_link = loginDetails.media_link ?? 'media_link';
    const isLoginSuccess = response?.data?.isLoginSuccess
    const authUserName = response?.data?.authUserName
    const roleId = response?.data?.roleId
    if (!response?.data?.isLoginSuccess) {
      toast.warning(response?.data?.msg);
    } else {
      toast.success("Signed In Succeesfully");
      login({
        email: formData.email, isLoginSuccess: isLoginSuccess,
        authUserName: authUserName,
        roleId: roleId,
        loginDetails: loginDetails
      });
      if (loginDetails.roleName == 'Super Admin' || loginDetails.roleName == 'Admin' || loginDetails.roleName == 'Aggregator Admin') {
        navigate('/home');
      } else {
        navigate('/super-admin-dashboard');
      }


      // navigate('/home');
      window.location.reload();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Branding Side */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 p-8 lg:p-12 relative">
          {/* Abstract Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-yellow-300"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-red-400"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-orange-300"></div>
            <div className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full bg-yellow-400"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-12">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                {/* <div className="text-3xl">🚀</div> */}
                <div className="w-12 h-12">
                  <img
                    src={logo}
                    alt="User Avatar"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white">QeuBox</h1>
            </div>

            <div className="flex-grow flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Delicious food, <br />delivered with <span className="text-yellow-300">speed</span>
              </h2>
              <p className="text-white text-lg opacity-90 mb-8 max-w-md">
                Join thousands of food lovers who trust QeuBox for the best food delivery experience.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-12">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <div className="text-white text-xl">⏱️</div>
                  </div>
                  <p className="text-white">Lightning-fast delivery</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <div className="text-white text-xl">🍔</div>
                  </div>
                  <p className="text-white">Wide restaurant selection</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <div className="text-white text-xl">🎁</div>
                  </div>
                  <p className="text-white">Exclusive offers and discounts</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm border border-white border-opacity-20">
              <p className="text-white italic text-sm lg:text-base mb-4">
                "QeuBox has transformed my dining experience. The variety of restaurants and quick delivery times are unmatched!"
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me for 30 days
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.email.trim() ||
                  !formData.password.trim()
                }
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="absolute right-0 h-full w-12 bg-white bg-opacity-20 skew-x-12 transform -translate-x-20 group-hover:translate-x-20 transition-transform duration-700"></span>
                <div className="flex items-center relative z-10">
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Sign In <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;