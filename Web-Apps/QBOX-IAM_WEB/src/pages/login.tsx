import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Link, useNavigate } from 'react-router-dom';
import storage from '@/utils/storage';
import { ApiService } from '@/services/apiServices';
import { toast } from 'react-toastify';
import { isSaveDisabled, validateFieldOnBlur } from '@/utils/validation';

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
`;

export const LoginPage = () => {
    const { theme, toggleTheme } = useTheme();
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
        const response = await ApiService('8914', 'post', '/login', params);
        console.log(response)
        const isLoginSuccess = response?.data?.isLoginSuccess
        const roleName = response?.data?.roleName || 'User';
        if (!response?.data?.isLoginSuccess) {
            toast.warning(response?.data?.msg);
        } else {
            toast.success("Signed In Succeesfully");
            storage.setToken(JSON.stringify({
                'email': formData.email, 'password': formData.password,
                'rememberMe': rememberMe, 'isLoginSuccess': isLoginSuccess, 'roleName': roleName,
            }));
            navigate('/');
            window.location.reload();
        }
        setIsLoading(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };


    return (
        <>
            <style>{style}</style>
            <div className="min-h-screen w-full bg-background flex overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-blob" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
                    <button
                        onClick={toggleTheme}
                        className="absolute top-4 right-4 p-3 rounded-full hover:bg-muted transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon size={20} className="text-muted-foreground" />
                        ) : (
                            <Sun size={20} className="text-muted-foreground" />
                        )}
                    </button>

                    {/* Login Card */}
                    <div className="w-full max-w-lg">
                        <div className="bg-card/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-border/50 transform transition-all duration-300 hover:shadow-xl">
                            <div className="space-y-3 text-center mb-8">
                                <div className="flex justify-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                        <div className="relative">
                                            <Shield size={48} className="text-red-600 transform transition-all duration-300 group-hover:scale-110" />
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse-custom" />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Welcome Back
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Secure access to your account
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
                                        <p className="pt-1 text-red-500 text-md">{errors.email}</p>
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
                                        <p className="pt-1 text-red-500 text-md">{errors.password}</p>
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

                                    {/* <a
                                        href="/forgotPassword"
                                        className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
                                    >
                                        Forgot password?
                                    </a> */}
                                </div>

                                <button
                                    type="submit" disabled={isSaveDisabled(formData, validationRules)}
                                    // disabled={isLoading}
                                    className="w-full relative overflow-hidden group py-3 px-4 rounded-xl bg-red-600 text-white font-medium transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
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
                                    href="/signin"
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
            title: "Secure Access",
            description: "Enterprise-grade security with end-to-end encryption",
            icon: "🔒"
        },
        {
            title: "Smart Authentication",
            description: "Multi-factor authentication and biometric login support",
            icon: "🔑"
        },
        {
            title: "24/7 Support",
            description: "Round-the-clock technical assistance and monitoring",
            icon: "💫"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Why Choose Us?</h2>
                <p className="text-muted-foreground">Experience the next generation of secure authentication</p>
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