import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { ShoppingBag, ShoppingCart, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


interface PurchaseOrderProps {
    isHovered: any;
}
const PurchaseOrder: React.FC<PurchaseOrderProps> = ({ isHovered }) => {

    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.csv')) {
            setMessage('Please select a CSV file');
            setFile(null);
            return;
        }

        setFile(selectedFile || null);
        setMessage('');
    };

    const handleCancel = () => {
        setFile(null);
        setMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            setMessage('Please select a CSV file first');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('csvFile', file);

            const response = await fetch(
                `${import.meta.env.VITE_API_DOMAIN}:8913/api/v1/pool/upload_order_csv`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            setMessage('CSV file uploaded successfully!');
            setTimeout(() => {
                setMessage('');
            }, 2000);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen mb-10">
                <div className="custom-gradient-left h-24" />
                <div className={`-mt-16 ${isHovered ? 'pl-32 pr-14 ' : 'pl-16 pr-14 '}`}>
                    <div className="max-w-8xl mx-auto">

                        <header className="bg-white text-black p-6 shadow-lg flex rounded-2xl items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="low-bg-color p-3 rounded-xl">
                                    <ShoppingCart className="w-8 h-8 text-color" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold"> Upload Purchase Order</h1>
                                    <p className="text-gray-500 mt-2">Upload your purchase order scv file here.</p>
                                </div>
                            </div>
                        </header>
                        <div className="max-w-2xl mx-auto px-4 mt-20">
                            <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 
                    ${file ? 'scale-102' : 'scale-100'}
                    ${loading ? 'opacity-80' : 'opacity-100'}`}>

                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="text-center mb-8">
                                            <Upload
                                                className={`mx-auto h-16 w-16 transition-all duration-300 
                                    ${file ? 'text-color' : 'text-gray-400'}
                                    ${loading ? 'animate-bounce' : ''}`}
                                            />
                                            <h2 className="mt-4 text-xl font-semibold text-gray-700">
                                                Upload Purchase Order CSV
                                            </h2>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Drag and drop your CSV file here or click to browse
                                            </p>
                                        </div>

                                        <div className="relative group"
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsDragOver(true);
                                            }}
                                            onDragLeave={() => setIsDragOver(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDragOver(false);
                                                const droppedFile = e.dataTransfer.files[0];
                                                if (droppedFile?.name.toLowerCase().endsWith('.csv')) {
                                                    setFile(droppedFile);
                                                    setMessage('');
                                                } else {
                                                    setMessage('Please select a CSV file');
                                                }
                                            }}>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".csv"
                                                onChange={handleFileChange}
                                                className={`w-full px-4 py-8 border-2 border-dashed rounded-lg 
                                        transition-all duration-300 cursor-pointer
                                        ${file ? 'hovered-border menu-item' : 'border-gray-300 bg-gray-50'}
                                        ${isDragOver ? 'border-blue-500 bg-blue-50' : ''}
                                        hovered-border menu-item`}
                                            />
                                            {file && (
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 
                                            low-bg-color rounded-full menu-item
                                            transition-colors duration-200"
                                                >
                                                    <X className="w-4 h-4 text-color" />
                                                </button>
                                            )}
                                        </div>

                                        {file && (
                                            <div className="flex items-center justify-between text-sm 
                                    bg-green-50 text-green-800 p-3 rounded-lg">
                                                <span>Selected: {file.name} ({Math.round(file.size / 1024)} KB)</span>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading || !file}
                                            className={`w-full py-4 px-6 rounded-lg font-medium 
                                    transition-all duration-300 
                                    flex items-center justify-center space-x-2
                                    ${loading || !file
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-color menu-item text-white shadow-lg '}`}
                                        >
                                            {loading ? (
                                                <span className="animate-pulse">Uploading...</span>
                                            ) : (
                                                <>
                                                    <Upload className="w-5 h-5" />
                                                    <span>Upload CSV</span>
                                                </>
                                            )}
                                        </button>

                                        {message && (
                                            <div className={`p-4 rounded-lg text-sm font-medium transition-all duration-300
                                    ${message.includes('failed') || message.includes('Please select')
                                                    ? 'bg-red-50 text-red-700'
                                                    : 'bg-green-50 text-green-700'}`}>
                                                {message}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchaseOrder;