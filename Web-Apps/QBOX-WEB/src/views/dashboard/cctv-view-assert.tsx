import { useCCTV } from "@context/CCTVContext";
import { console } from "inspector";
import { ChevronLeft, Clock, Info, ListVideo } from "lucide-react";
import React from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom";

const CCTVViewerAssert = () => {

    const location = useLocation();
    const url = new URLSearchParams(location.search).get("url");
    const from = new URLSearchParams(location.search).get("from");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/assert-detail`, {
            state: {
                infraData: location.state?.infraData,
                selectedCardId: location.state?.selectedCardId,
                selectedLocation: location.state?.selectedLocation,
                selectedQboxEntityName: location.state?.selectedQboxEntityName,
                selectedQboxArea: location.state?.selectedQboxArea
            }
        });
    };

    // Mock data for the UI elements shown in your screenshot
    const videoTitle = "Rick Astley - Never Gonna Give You Up (Official Music)";
    const pagination = "404 / 333";
    const relatedVideos = [
        { id: 1, title: "Parking Lot Camera - East Side" },
        { id: 2, title: "Lobby Camera - Main Entrance" },
        { id: 3, title: "Security Feed - Floor 3" },
    ];

    return (
        <div className="bg-gray-100 h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm py-4 px-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between">
                        {/* Left side - Back button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center px-3 py-2 text-white bg-color hover:bg-blue-700 rounded-lg transition-all duration-200 group border border-color hover:border-blue-700"
                        >
                            <ChevronLeft
                                className="mr-1 group-hover:-translate-x-1 transition-transform"
                                size={18}
                            />
                            <span className="font-medium text-sm">Back</span>
                        </button>

                        {/* Right side - Title and info */}
                        <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                                    Live CCTV Camera View
                                </h1>
                                <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    Live Feed
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Monitoring camera: {videoTitle || "Unnamed camera feed"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content - fills remaining space without scrolling */}
            <div className="flex-1 overflow-hidden max-w-7xl mx-auto w-full p-4">
                <div className="h-full flex flex-col lg:flex-row gap-6">
                    {/* Video player section */}
                    <div className="flex-1 flex flex-col h-full">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col">
                            {url ? (
                                <div className="flex-1">
                                    <ReactPlayer
                                        url={url}
                                        playing
                                        controls
                                        width="100%"
                                        height="100%"
                                        style={{ aspectRatio: "16/9" }}
                                        config={{
                                            file: {
                                                attributes: {
                                                    controlsList: "nodownload",
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="bg-gray-200 aspect-video flex items-center justify-center flex-1">
                                    <p className="text-gray-500">No camera URL provided.</p>
                                </div>
                            )}
                        </div>

                        {/* Video info section - fixed height */}
                        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                            <h2 className="text-lg font-semibold mb-2 truncate">{videoTitle}</h2>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                    <Clock className="mr-1" size={16} />
                                    Watch Later
                                </span>
                                <span className="flex items-center">
                                    <Info className="mr-1" size={16} />
                                    Info
                                </span>
                            </div>
                            <div className="border-t pt-3">
                                <p className="text-sm text-gray-500">{pagination}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CCTVViewerAssert;