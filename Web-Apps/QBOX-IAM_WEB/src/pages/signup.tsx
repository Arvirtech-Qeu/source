import React, { useEffect, useState } from 'react';
import { Shield, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import storage from '@/utils/storage';
import { FeatureShowcase } from './login';
import { ApiService } from '@/services/apiServices';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllRole } from '@/redux/features/roleSlice';
import { isSaveDisabled, validateFieldOnBlur } from '@/utils/validation';

export const SignUpPage = () => {

    const dispatch = useDispatch();
    const { theme, toggleTheme } = useTheme();
    const { roleList } = useSelector((state: RootState) => state.roleSlice)
    const [activeInput, setActiveInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        roleId: '',
    });


    const validationRules = {
        email: { required: true, displayName: "Email" },
        roleId: { required: true, displayName: "Role" },
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
        const response = await ApiService('8914', 'post', '/auth_user_register', params);
        console.log(response)
        if (response?.data?.status === "success") {
            const authUserId = response?.data?.userData?.authUserId;
            storage.setToken(JSON.stringify({ 'email': formData.email, 'authUserId': authUserId }));
            navigate('/OTPVerification');
        } else if (response?.data?.status === "error" && response?.data?.message === "Email is already registered") {
            toast.warning(response?.data?.message);
        } else {
            toast.error("Someting went wrong");
        }
    };

    useEffect(() => {
        dispatch(getAllRole({}))
    }, []);

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
                                            <Shield size={48} className="text-red-600 transform transition-all duration-300 group-hover:scale-110" />
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
                                {/* Name Fields */}
                                {/* <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-foreground">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            onFocus={() => setActiveInput('firstName')}
                                            onBlur={() => setActiveInput('')}
                                            className="w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-foreground">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            onFocus={() => setActiveInput('lastName')}
                                            onBlur={() => setActiveInput('')}
                                            className="w-full px-4 py-3 bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div> */}

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
                                        <p className="pt-1 text-red-500 text-md">{errors.email}</p>
                                    )}
                                </div>

                                {/* Email Field */}
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
                                            style={{
                                                color: 'white', // Ensures selected option text is white
                                            }}
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
                                            <p className="pt-2 text-red-500 text-md">{errors.roleId}</p>
                                        )}
                                    </div>
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
                            <FeatureShowcase />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;