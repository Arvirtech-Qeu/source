import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Moon, Sun, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// import { ApiService } from '@/services/apiServices';
import { toast } from 'react-toastify';
// import { isSaveDisabled, validateFieldOnBlur } from '@/utils/validation';
import { apiService } from '@services/apiService';
import type { ApiResponse } from '../types/apiTypes';
import { useTheme } from '@hooks/useTheme';
import { saveToLocalStorage } from '@utils/storage';
import { useAuth } from '../hooks/useAuth';

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

export const LoginTrail = () => {
    // const { theme, toggleTheme } = useTheme();
    const { login, logout, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [activeInput, setActiveInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const validationRules = {
        email: { required: true, displayName: "Email" },
        password: { required: true, displayName: "Password" },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear the error for the current field as the user starts typing
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: "", // Reset error when the user starts typing
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
            navigate('/');
            window.location.reload();
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
                {/* Enhanced Animated Background */}
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
                        className="absolute top-4 right-4 p-3 rounded-full hover:bg-muted transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon size={20} className="text-muted-foreground" />
                        ) : (
                            <Sun size={20} className="text-muted-foreground" />
                        )}
                    </button> */}

                    {/* Login Card */}
                    <div className="w-full max-w-lg">
                        <div className="bg-card/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-border/50 transform transition-all duration-300 hover:shadow-xl">
                            <div className="space-y-3 text-center mb-8">
                                <div className="flex justify-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                        <div className="relative">
                                            <Shield size={48} className="text-color transform transition-all duration-300 group-hover:scale-110" />
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse-custom" />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Welcome to QueBox
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Your favorite meals are just a click away
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground transition-all duration-200">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            // onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setActiveInput('email')}
                                            // onBlur={() => setActiveInput('')}
                                            onBlur={handleBlur}
                                            className="w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                                            placeholder="you@example.com"
                                        />
                                        <div className="absolute top-1/2 -translate-y-1/2 right-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-muted-foreground"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.email && (
                                        <p className="pt-1 text-color text-md">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground transition-all duration-200">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            // onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setActiveInput('password')}
                                            // onBlur={() => setActiveInput('')}
                                            onBlur={handleBlur}
                                            className="w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder:text-muted-foreground pr-10"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 p-1 rounded-lg hover:bg-muted"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="pt-1 text-color text-md">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="h-5 w-5 border-2 border-muted-foreground rounded transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary group-hover:border-primary">
                                                {rememberMe && (
                                                    <svg
                                                        className="h-full w-full text-primary-foreground"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                                            Remember me
                                        </span>
                                    </label>

                                    <a
                                        href="/forgotPassword"
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    // disabled={isLoading}
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
                                                Sign in
                                                <ChevronRight size={18} className="ml-2 text-white   transform transition-transform duration-200 group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            {/* Social Login */}
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-card text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <SocialButton provider="Google" />
                                    <SocialButton provider="Facebook" />
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-6 text-center">
                                <span className="text-muted-foreground">Don't have an account? </span>
                                <a
                                    href="#/signin"
                                    // href="/signin"
                                    className="font-medium text-primary hover:text-primary/80 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
                                >
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="hidden lg:block lg:w-5/12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm" />
                    <div className="relative h-full flex items-center justify-center p-12">
                        <div className="bg-card/30 backdrop-blur-md rounded-2xl p-8 border border-border/50 transform transition-all duration-300 hover:scale-[1.02]">
                            <FeatureShowcase />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// FeatureShowcase Component
const FeatureShowcase = () => {
    const features = [
        {
            title: "Quick Delivery",
            description: "Get your favorite food delivered in 30 minutes or less",
            icon: "🚀"
        },
        {
            title: "Wide Selection",
            description: "Choose from thousands of restaurants near you",
            icon: "🍽️"
        },
        {
            title: "Special Offers",
            description: "Exclusive deals and discounts on your favorite meals",
            icon: "🎁"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Why Choose QueBox?</h2>
                <p className="text-muted-foreground">Your ultimate food delivery companion</p>
            </div>

            <div className="space-y-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background/50 transition-all duration-200"
                    >
                        <div className="text-3xl">{feature.icon}</div>
                        <div className="space-y-1">
                            <h3 className="font-medium text-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Animations CSS (to be added to globals.css)
const GlobalStyles = () => (
    <style>{`
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
  `}</style>
);

// SocialButton Component (updated version)
const SocialButton = ({ provider }: any) => {
    return (
        <button
            type="button"
            className="flex items-center justify-center px-4 py-3 border border-border rounded-xl bg-background/50 backdrop-blur-sm text-foreground hover:bg-muted transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary w-full"
        >
            {provider === 'Google' ? (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
            ) : provider === 'Facebook' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
            ) : null}
            <span className="font-medium">{provider}</span>
        </button>
    );
};

export { FeatureShowcase, GlobalStyles, SocialButton };