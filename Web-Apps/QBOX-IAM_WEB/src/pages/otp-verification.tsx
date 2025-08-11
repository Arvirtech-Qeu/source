import React, { useState, useRef, useEffect } from 'react';
import { Shield, Moon, Sun, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '@/services/apiServices';
import { toast } from 'react-toastify';
import storage from '@/utils/storage';

export const OTPVerification = () => {
    const { theme, toggleTheme } = useTheme();
    // const [otp, setOtp] = useState(['', '', '', '']);
    const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [email, setEmail] = useState<any>(null);
    // const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const inputRefs = Array(4)
        .fill(null)
        .map(() => useRef<HTMLInputElement>(null));
    const navigate = useNavigate();

    // Timer for OTP resend
    useEffect(() => {
        const storedData = storage.getToken();

        if (storedData) {
            const { email } = JSON.parse(storedData);
            setEmail(email)
        } else {
        }

        if (timeLeft > 0 && !canResend) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !canResend) {
            setCanResend(true);
        }
    }, [timeLeft, canResend]);

    const handleChange = (index: any, value: any) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        // if (value && index < 3) {
        //     inputRefs[index + 1].current.focus();
        // }
        // Auto-focus next input
        if (value && index < otp.length - 1) {
            inputRefs[index + 1]?.current?.focus();
        }
    };

    const handleKeyDown = (index: any, e: any) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Focus previous input on backspace if current input is empty
            // inputRefs[index - 1].current.focus();
            inputRefs[index - 1]?.current?.focus();
        }
    };

    const handlePaste = (e: any) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4).split('');
        const newOtp = [...otp];
        pastedData.forEach((value: any, index: any) => {
            if (index < 4 && /^\d$/.test(value)) {
                newOtp[index] = value;
            }
        });
        setOtp(newOtp);
        // Focus last input after paste
        if (pastedData.length > 0) {
            // const lastIndex = Math.min(pastedData.length - 1, 3);
            // inputRefs[lastIndex].current.focus();
            const lastIndex = Math.min(pastedData.length - 1, otp.length - 1);
            inputRefs[lastIndex]?.current?.focus();
        }
    };

    const handleResend = () => {
        setCanResend(false);
        setTimeLeft(30);
        // Add your resend OTP logic here

    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const otpString = otp.join('');
        setIsLoading(true);
        try {
            const params = {
                otp: otpString,
                userRegistrationId: email,
                deviceId: "12345"
            }
            const response = await ApiService('8914', 'post', '/verify_otp', params);
            console.log(response)
            if (response?.data?.isValid === false) {
                toast.warning("Please enter valid OTP.");
            } else {
                toast.success("Verification Success.");
                navigate('/setPassword');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong");
        }
        setIsLoading(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
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

                {/* OTP Card */}
                <div className="w-full max-w-md">
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
                                Verify Your Email
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter the 4-digit code sent to your email
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-center gap-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-10 h-10 text-center text-2xl font-bold bg-background/50 backdrop-blur-sm border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground"
                                        required
                                    />
                                ))}
                            </div>
                            <button
                                type="submit" // Ensure this is explicitly defined
                                disabled={isLoading || otp.join('').length !== 4} // Update the length condition
                                className="w-full relative overflow-hidden group py-3 px-4 rounded-xl bg-red-600 text-white font-medium transition-all duration-200 hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
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
                                            Verify Code
                                            <ChevronRight
                                                size={18}
                                                className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </>
                                    )}
                                </span>
                            </button>

                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the code?{' '}
                                {canResend ? (
                                    <button
                                        onClick={handleResend}
                                        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <span>
                                        Resend code in {timeLeft}s
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

