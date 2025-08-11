import React from 'react';
import { Search } from 'lucide-react';
import WarningToast from './WarningToast';

type CommonHeaderProps = {
    title: string;
    description: string;
    onAdd?: () => void;
    searchQuery?: string;
    buttonName?: string;
    placeholder?: string;
    setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
    HeaderIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    AddIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    warningMessage?: string;
    dependencies?: any[],
    openWarningTost?: boolean;
    closeWarningTost?: () => void;
};

export const CommonHeader: React.FC<CommonHeaderProps> = ({
    title,
    description,
    onAdd,
    searchQuery,
    setSearchQuery,
    HeaderIcon,
    buttonName,
    placeholder,
    AddIcon,
    warningMessage = "",
    dependencies = [],
    openWarningTost = false,
    closeWarningTost,
}) => {

    // Check if any dependency array is empty
    const hasEmptyDependencies = dependencies.some(dep => !dep || dep.length === 0);

    return (
        <div>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    {/* Left side: Header and Description */}
                    <div>
                        <h1 className="text-2xl text-color flex items-center gap-1.5">
                            {HeaderIcon && <HeaderIcon className="w-8 h-8 text-color" />}
                            {title}
                        </h1>
                        <p className="text-gray-600 mt-1">{description}</p>
                    </div>

                    {/* Right side: Search bar and Add button */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        {setSearchQuery && (
                            <div className="flex relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-red-100 focus:border-color"
                                    placeholder={placeholder}
                                />
                            </div>
                        )}

                        {/* Add Button */}
                        {onAdd && (
                            <button
                                onClick={onAdd}
                                className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                {AddIcon && <AddIcon className="w-5 h-5" />}
                                {buttonName}
                            </button>
                        )}
                    </div>
                </div>

                {hasEmptyDependencies && openWarningTost &&
                    <WarningToast
                        message={warningMessage || "Please ensure all required data is available"}
                        onClose={closeWarningTost}
                    />
                }

            </div>
        </div>
    );
};

export default CommonHeader;