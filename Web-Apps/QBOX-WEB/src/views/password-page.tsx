import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Shield, Moon, Sun, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import storage from '@/utils/storage';
import { toast } from 'react-toastify';

import { apiService } from '@services/apiService';
import type { ApiResponse } from '../types/apiTypes';
import { useTheme } from '@hooks/useTheme';
import { getFromLocalStorage, saveToLocalStorage } from '@utils/storage';
// import { FeatureShowcase } from './Login';

const PORT = import.meta.env.VITE_API_QBOX_AUTHN_PORT;
const PRIFIX_URL = import.meta.env.VITE_API_AUTHN_PREFIX_URL;

// Add this to your globals.css or create a new style module
const style = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-pulse-custom {
  animation: pulse 2s infinite;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.float-animation {
  animation: float 6s ease-in-out infinite;
}

.float-animation-delay-1 {
  animation-delay: 1s;
}

.float-animation-delay-2 {
  animation-delay: 2s;
}

.float-animation-delay-3 {
  animation-delay: 3s;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.gradient-animate {
  background: linear-gradient(
    45deg, 
    rgba(255, 99, 71, 0.1),  /* Tomato */
    rgba(255, 165, 0, 0.1),  /* Orange */
    rgba(255, 215, 0, 0.1),  /* Gold */
    rgba(255, 99, 71, 0.1)   /* Back to Tomato */
  );
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle-delay-1 { animation-delay: 0.5s; }
.sparkle-delay-2 { animation-delay: 1s; }
.sparkle-delay-3 { animation-delay: 1.5s; }
`;


export const PasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeInput, setActiveInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [authUserId, setAuthUserId] = useState<any>(null);
    const [errors, setErrors] = useState<any>({});
    const [errorPatterns, setErrorPatterns] = useState<any>({})
    const [errorPasswordMatch, setErrorPasswordMatch] = useState<any>({})

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const validationRules = {
        password: { required: true, displayName: "Password" },
        confirmPassword: { required: true, displayName: "Confirm Password" },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value, // Update form data
        }));

        // Password validation pattern: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        setErrors((prevErrors: any) => {
            const updatedErrors = { ...prevErrors };

            // Handle password errors
            if (name === "password") {
                if (value.trim() === "") {
                    updatedErrors.password = ""; // No error for empty input
                } else if (!passwordPattern.test(value)) {
                    updatedErrors.password = "Password does not meet the required criteria.";
                } else {
                    updatedErrors.password = ""; // Clear error if valid
                }
            }

            // Handle confirmPassword errors
            if (name === "confirmPassword") {
                if (value.trim() === "") {
                    updatedErrors.confirmPassword = ""; // No error for empty input
                } else if (value !== formData.password) {
                    updatedErrors.confirmPassword = "Passwords don't match!";
                } else {
                    updatedErrors.confirmPassword = ""; // Clear error if passwords match
                }
            }

            return updatedErrors;
        });
    };

    useEffect(() => {

        // const storedData = storage.getToken();
        const storedData = getFromLocalStorage('user');
        if (storedData) {
            const { authUserId } = storedData;
            setAuthUserId(authUserId)
        } else {
        }

    }, []);


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const params = {
                authUserId: authUserId,
                password: formData.password,
            }
            // const response = await ApiService('8084', 'post', '/set_auth_user_password', params);
            const response = await apiService.post<ApiResponse<any>>('set_auth_user_password', params, PORT, PRIFIX_URL);
            console.log(response)
            if (response?.data?.status === "success") {
                toast.success("Password set successfully");
                // storage.removeToken()
                navigate('/login');
            } else if (response?.data?.status === "error") {
                toast.error("Failed to set password");
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong");
        }
        setIsLoading(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        // validateFieldOnBlur(e, formData, validationRules, setErrors);
    };


    return (
        <>
            <style>{style}</style>
            <div className="min-h-screen w-full bg-background flex overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Base gradient */}
                    <div className="absolute inset-0 gradient-animate" />

                    {/* Colorful overlay patterns */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.1),transparent_50%)]" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,165,0,0.1),transparent_50%)]" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,99,71,0.1),transparent_50%)]" />
                    </div>

                    {/* Floating Food Elements */}
                    <div className="absolute top-20 left-20 opacity-20 float-animation">
                        <span className="text-6xl">🍕</span>
                    </div>
                    <div className="absolute top-40 right-32 opacity-20 float-animation float-animation-delay-1">
                        <span className="text-6xl">🍔</span>
                    </div>
                    <div className="absolute bottom-32 left-1/4 opacity-20 float-animation float-animation-delay-2">
                        <span className="text-6xl">🍜</span>
                    </div>
                    <div className="absolute top-1/3 right-1/4 opacity-20 float-animation float-animation-delay-3">
                        <span className="text-6xl">🌮</span>
                    </div>

                    {/* Additional Food Elements */}
                    <div className="absolute bottom-20 right-20 opacity-20 float-animation float-animation-delay-2">
                        <span className="text-6xl">🥗</span>
                    </div>
                    <div className="absolute top-1/2 left-32 opacity-20 float-animation float-animation-delay-1">
                        <span className="text-6xl">🍣</span>
                    </div>
                    <div className="absolute top-20 right-1/4 opacity-20 float-animation float-animation-delay-3">
                        <span className="text-6xl">🍦</span>
                    </div>

                    {/* Sparkle Effects */}
                    <div className="absolute inset-0">
                        <div className="absolute h-2 w-2 bg-yellow-300/40 rounded-full top-1/4 left-1/4 sparkle" />
                        <div className="absolute h-2 w-2 bg-orange-300/40 rounded-full top-1/3 right-1/3 sparkle sparkle-delay-1" />
                        <div className="absolute h-2 w-2 bg-red-300/40 rounded-full bottom-1/4 right-1/4 sparkle sparkle-delay-2" />
                        <div className="absolute h-2 w-2 bg-pink-300/40 rounded-full bottom-1/3 left-1/3 sparkle sparkle-delay-3" />
                    </div>

                    {/* Enhanced Decorative Circles */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full filter blur-3xl animate-blob" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000" />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M10 10l5-5M10 10l-5 5M10 10l5 5M10 10l-5-5' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E')] bg-repeat" />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* <button
                        onClick={toggleTheme}
                        className="absolute top-4 right-4 p-3 rounded-full hover:bg-muted transition-all duration-300 transform hover:scale-110"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon size={20} className="text-muted-foreground" />
                        ) : (
                            <Sun size={20} className="text-muted-foreground" />
                        )}
                    </button> */}

                    {/* Sign Up Card */}
                    <div className="w-full max-w-lg">
                        <div className="bg-card/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-border/50 transform transition-all duration-300 hover:shadow-xl">
                            <div className="space-y-3 text-center mb-8">
                                <div className="flex justify-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                        <div className="relative">
                                            <Shield size={48} className="text-color transform transition-all duration-300 group-hover:scale-110" />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Set Password
                                </h1>
                                {/* <p className="text-sm text-muted-foreground">
                                    Join us for a secure and seamless experience
                                </p> */}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Password Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-foreground">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => setActiveInput('password')}
                                                // onBlur={() => setActiveInput('')}
                                                onBlur={handleBlur}
                                                className="w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                                placeholder="Create a strong password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="pt-2 text-color text-md">{errors.password}</p>
                                        )}
                                        {/* {errors.password && (
                                            <p className="pt-2 text-color text-md">{errors.password}</p>
                                        )} */}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-foreground">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                onFocus={() => setActiveInput('confirmPassword')}
                                                // onBlur={() => setActiveInput('')}
                                                onBlur={handleBlur}
                                                className="w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="pt-2 text-color text-md">{errors.confirmPassword}</p>
                                        )}
                                        {/* {errors.confirmPassword && (
                                            <p className="pt-2 text-color text-md">{errors.confirmPassword}</p>
                                        )} */}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative overflow-hidden group py-3 px-4 rounded-xl bg-color text-white font-medium transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
                                >
                                    <span className="relative flex items-center justify-center">
                                        {isLoading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <>
                                                Set Password
                                                <ChevronRight size={18} className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Feature Showcase */}
                <div className="hidden lg:block lg:w-5/12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm" />
                    <div className="relative h-full flex items-center justify-center p-12">
                        <div className="bg-card/30 backdrop-blur-md rounded-2xl p-8 border border-border/50 transform transition-all duration-300 hover:scale-[1.02]">
                            {/* <FeatureShowcase /> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
