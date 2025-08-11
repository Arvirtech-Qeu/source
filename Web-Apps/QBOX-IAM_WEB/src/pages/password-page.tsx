import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Shield, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import storage from '@/utils/storage';
import { FeatureShowcase } from './login';
import { ApiService } from '@/services/apiServices';
import { toast } from 'react-toastify';
import { validateFieldOnBlur } from '@/utils/validation';

export const PasswordPage = () => {
    const { theme, toggleTheme } = useTheme();
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

        const storedData = storage.getToken();
        if (storedData) {
            const { authUserId } = JSON.parse(storedData);
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
            const response = await ApiService('8914', 'post', '/set_auth_user_password', params);
            console.log(response)
            if (response?.data?.status === "success") {
                toast.success("Password set successfully");
                storage.removeToken()
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
        validateFieldOnBlur(e, formData, validationRules, setErrors);
    };


    return (
        <>
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
                        className="absolute top-4 right-4 p-3 rounded-full hover:bg-muted transition-all duration-300 transform hover:scale-110"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon size={20} className="text-muted-foreground" />
                        ) : (
                            <Sun size={20} className="text-muted-foreground" />
                        )}
                    </button>

                    {/* Sign Up Card */}
                    <div className="w-full max-w-lg">
                        <div className="bg-card/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-border/50 transform transition-all duration-300 hover:shadow-xl">
                            <div className="space-y-3 text-center mb-8">
                                <div className="flex justify-center">
                                    <div className="relative group cursor-pointer">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                        <div className="relative">
                                            <Shield size={48} className="text-primary transform transition-all duration-300 group-hover:scale-110" />
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
                                            <p className="pt-2 text-red-500 text-md">{errors.password}</p>
                                        )}
                                        {/* {errors.password && (
                                            <p className="pt-2 text-red-500 text-md">{errors.password}</p>
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
                                            <p className="pt-2 text-red-500 text-md">{errors.confirmPassword}</p>
                                        )}
                                        {/* {errors.confirmPassword && (
                                            <p className="pt-2 text-red-500 text-md">{errors.confirmPassword}</p>
                                        )} */}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative overflow-hidden group py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
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
                            <FeatureShowcase />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
