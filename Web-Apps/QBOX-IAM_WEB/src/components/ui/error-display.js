import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ErrorDisplay({ message, className }) {
    return (_jsxs("div", { className: cn("flex items-center justify-center p-6 rounded-lg bg-red-900/20 border border-red-500/50 backdrop-blur-sm", "animate-pulse shadow-lg shadow-red-500/20", className), children: [_jsx(AlertCircle, { className: "w-8 h-8 text-red-500 mr-4 animate-bounce" }), _jsxs("div", { className: "text-red-100 font-semibold", children: [_jsx("h3", { className: "text-lg mb-1", children: "Error Detected" }), _jsx("p", { className: "text-sm opacity-80", children: message })] })] }));
}
