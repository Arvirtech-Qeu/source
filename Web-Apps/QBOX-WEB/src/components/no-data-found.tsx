import { AlertCircle } from 'lucide-react'; 

const NoDataFound = ({ icon = <AlertCircle className="mx-auto mb-6 text-color" size={64} />, message1, message2 }) => {
    return (
        <div className="flex justify-center items-center h-full min-h-[500px]">
            <div className="w-full flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg shadow-lg transition-shadow duration-300 p-8">
                {/* Render icon */}
                {icon}
                {/* Display messages */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{message1}</h3>
                <p className="text-lg text-gray-600">{message2}</p>
            </div>
        </div>
    );
};

export default NoDataFound;
