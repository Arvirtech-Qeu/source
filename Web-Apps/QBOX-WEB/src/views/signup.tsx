import React, { useEffect, useState } from 'react';
import { Shield, Moon, Sun, ChevronRight } from 'lucide-react';
// import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
// import storage from '@/utils/storage';
// import { FeatureShowcase } from './login';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '@services/apiService';
import type { ApiResponse } from '../types/apiTypes';
// import { FeatureShowcase } from './Login';
import { saveToLocalStorage } from '@utils/storage';
import { RootState } from '@state/store';
import { getAllRole } from '@state/authnSlice';
import { getAllQboxEntities } from "@state/qboxEntitySlice";
// import { isSaveDisabled, validateFieldOnBlur } from '@/utils/validation';
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

export const SignUpPage = () => {

    const dispatch = useDispatch();
    // const { theme, toggleTheme } = useTheme();
    const { roleList } = useSelector((state: RootState) => state.authnSlice)
    const { qboxEntityList } = useSelector(
        (state: RootState) => state.qboxEntity
    );
    const [activeInput, setActiveInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        roleId: '',
        qboxEntitySno: '',
    });
    const [roleSelect, setRoleSelect] = useState('')

    const validationRules = {
        email: { required: true, displayName: "Email" },
        roleId: { required: true, displayName: "Role" },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRoleSelect(value)
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear the error for the current field as the user starts typing
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const params = {
            authUserName: formData.email,
            roleId: formData.roleId,
            deviceId: "12345"
        }
        // setIsLoading(true);
        // const response = await ApiService('8084', 'post', '/auth_user_register', params);
        const response = await apiService.post<ApiResponse<any>>('auth_user_register', params, PORT, PRIFIX_URL);
        console.log(response)
        if (response?.data?.status === "success") {
            const authUserId = response?.data?.userData?.authUserId;
            // storage.setToken(JSON.stringify({ 'email': formData.email, 'authUserId': authUserId }));
            saveToLocalStorage('user', {
                email: formData.email,
                authUserId: authUserId
            });
            navigate('/OTPVerification');
        } else if (response?.data?.status === "error" && response?.data?.message === "Email is already registered") {
            toast.warning(response?.data?.message);
        } else {
            toast.error("Someting went wrong");
        }
    };

    useEffect(() => {
        dispatch(getAllRole({}));
        dispatch(getAllQboxEntities({}));
    }, [dispatch]);

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
                                    Create Account
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Join us for a secure and seamless experience
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setActiveInput('email')}
                                            // onBlur={() => setActiveInput('')}
                                            onBlur={handleBlur}
                                            className="w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
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

                                {/* select Role Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">
                                        Select an Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="roleId"
                                            required
                                            value={formData.roleId} // Replace with your state variable for the select field
                                            onChange={handleChange}
                                            onFocus={() => setActiveInput('roleId')} // Optional focus handling
                                            // onBlur={() => setActiveInput('')} // Optional blur handling
                                            onBlur={handleBlur}
                                            className="w-full px-4 py-3 bg-background/100 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                        // style={{
                                        //     color: 'white', // Ensures selected option text is white
                                        // }}
                                        >
                                            <option value="" disabled hidden>
                                                Select Role
                                            </option>
                                            {roleList.map((role: any) => (
                                                <option key={role.roleId} value={role.roleId}>
                                                    {role.roleName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.roleId && (
                                            <p className="pt-2 text-color text-md">{errors.roleId}</p>
                                        )}
                                    </div>
                                </div>

                                {/* select QboxEnity Field */}
                                {roleSelect === "4" && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-foreground">
                                            Select QboxEntity
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="qboxEntitySno"
                                                required
                                                value={formData.qboxEntitySno}
                                                onChange={handleChange}
                                                onFocus={() => setActiveInput('qboxEntitySno')} // Optional focus handling
                                                onBlur={handleBlur} // Optional blur handling
                                                className="w-full px-4 py-3 bg-background/100 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="" disabled hidden>
                                                    Select QboxEntity
                                                </option>
                                                {qboxEntityList.map((entity: any) => (
                                                    <option key={entity.qboxEntitySno} value={entity.qboxEntitySno}>
                                                        {entity.qboxEntityName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.roleId && (
                                                <p className="pt-2 text-color text-md">{errors.roleId}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                                Create Account
                                                <ChevronRight size={18} className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            {/* Sign In Link */}
                            <div className="mt-6 text-center">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <a
                                    href="/login"
                                    className="font-medium text-primary hover:text-primary/80 transition-all duration-200 hover:underline"
                                >
                                    Sign in
                                </a>
                            </div>
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

export default SignUpPage;