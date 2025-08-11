import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { apiService } from '../../services/apiService';

interface UserData {
    contact: string;
    role_name: string;
    profile_name: string;
    aadhar_number: string;
    auth_user_name: string;
    supervisor_name: string | null;
    media_link: {
        mediaUrl: string;
    } | null;
    additional_details: Array<{
        created_on: string;
        qbox_entity_sno: number;
    }> | null;
}

export default function Profile() {

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [auth_user, setAuthUserId]: any = useState(localStorage.getItem('user'));
    const user = JSON.parse(auth_user);
    console.log('auth_user', user?.loginDetails?.authUserId)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiService.get<any>(
                    `/authn/get_auth_user?auth_user_id=${user?.loginDetails?.authUserId}`,
                    '8914',
                    '/api/v1'
                );
                // const response = await apiService.get<any>(
                //     `/authn/get_auth_user?auth_user_id=${user?.loginDetails?.authUserId}`,
                //     '5000',
                //     '/api/v1'
                // );
                console.log('response', response)
                console.log('response', response.data.users[0])
                setUserData(response.data.users[0]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatAadhar = (aadhar: string) => {
        const cleaned = aadhar.trim();
        return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    };

    const formatPhone = (phone: string) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-blue-400 opacity-20"></div>
                </div>
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>

                    <div className="relative p-8 text-center">
                        <div className="relative mx-auto mb-6 inline-block">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 blur-sm opacity-60"></div>
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-2xl">
                                {userData?.media_link ? (
                                    <img
                                        src={JSON.parse(userData.media_link.mediaUrl).mediaUrl}
                                        alt={userData.profile_name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        <span className="text-3xl font-bold">
                                            {getInitials(userData.profile_name)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h1 className="mb-3 text-4xl font-bold text-gray-900">{userData?.profile_name}</h1>
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 shadow-lg">
                            <div className="mr-2 h-2 w-2 rounded-full bg-white animate-pulse"></div>
                            <span className="text-sm font-semibold text-white">{userData?.role_name}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-6"
                >
                    <div className="h-full rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 hover:shadow-2xl transition-all duration-300">
                        <div className="mb-6 flex items-center">
                            <div className="mr-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="group relative overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:border-blue-200 hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <div className="relative flex items-center">
                                    <div className="mr-3 rounded-lg bg-blue-100 p-2">
                                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                                        <p className="text-lg font-semibold text-gray-900">{userData?.auth_user_name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:border-green-200 hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <div className="relative flex items-center">
                                    <div className="mr-3 rounded-lg bg-green-100 p-2">
                                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                        <p className="text-lg font-semibold text-gray-900">{formatPhone(userData?.contact)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <div className="relative flex items-center">
                                    <div className="mr-3 rounded-lg bg-purple-100 p-2">
                                        <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Aadhar Number</p>
                                        <p className="text-lg font-semibold text-gray-900 font-mono">{formatAadhar(userData?.aadhar_number)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Supervisor & Activity Section */}
                <div className="lg:col-span-6 space-y-6">
                    {/* Supervisor Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 hover:shadow-2xl transition-all duration-300">
                            <div className="mb-6 flex items-center">
                                <div className="mr-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Supervisor</h2>
                            </div>

                            {userData?.supervisor_name ? (
                                <div className="rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 text-center">
                                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">
                                            {getInitials(userData.supervisor_name)}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 mb-2">{userData.supervisor_name}</p>
                                    <p className="text-gray-600 font-medium">Team Supervisor</p>
                                </div>
                            ) : (
                                <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No supervisor assigned</p>
                                    <p className="text-sm text-gray-400 mt-1">Independent role</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}