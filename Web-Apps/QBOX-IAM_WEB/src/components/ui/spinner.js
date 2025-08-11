import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Spinner({ size = 'md', className }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };
    return (_jsxs("div", { className: cn("relative w-full", sizeClasses[size], className), "aria-label": "Loading", children: [[0, 1, 2].map((index) => (_jsx("div", { className: cn("absolute inset-0 border-4 border-t-primary rounded-full animate-pulse", index === 0 && "opacity-20", index === 1 && "opacity-40 scale-75", index === 2 && "opacity-60 scale-50"), style: {
                    animationDelay: `${index * 200}ms`,
                    animationDuration: '1.5s'
                } }, index))), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("div", { className: cn("rounded-full bg-primary animate-ping", size === 'sm' && 'w-2 h-2', size === 'md' && 'w-3 h-3', size === 'lg' && 'w-4 h-4') }) })] }));
}
