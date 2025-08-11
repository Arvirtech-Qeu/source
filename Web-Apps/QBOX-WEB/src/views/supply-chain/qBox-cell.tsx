import { useState } from "react";
import HotBox from "./hot-boxTab";
import QRCodeTab from "./qr-codeTab";
import { Camera, ChartNoAxesCombined, Grid, Presentation, QrCode, Table2, Table2Icon } from "lucide-react";
import { Table } from "@components/Table";


interface QboxCellProps {
  isHovered: any;
}

const QboxCell: React.FC<QboxCellProps> = ({ isHovered }) => {

  const [activeTab, setActiveTab] = useState("hotbox");

  return (
    <>
      <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
        <div className="flex">
          {/* <ChartNoAxesCombined className="mt-1 text-color" />
          <h1 className="text-2xl text-color flex items-center gap-3 mb-8 pl-2">HotBox/Qbox Current Status</h1> */}
          <h1 className="text-2xl text-color flex items-center gap-1.5 mb-8">
            <ChartNoAxesCombined className='w-8 h-8 text-color' />
            HotBox/Qbox Current Status</h1>
        </div>
        {/* Dropdown for Small Screens */}
        <div className="sm:hidden">
          <select
            id="tabs"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className=" text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="hotbox">Hot Box</option>
            <option value="qrcode">Qbox</option>
          </select>
        </div>

        {/* Horizontal Tabs for Larger Screens */}
        <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 w-fit">
          <li className="w-44 focus-within:z-10">
            <button
              onClick={() => setActiveTab("hotbox")}
              className={`inline-block w-full p-3 border-r ${activeTab === "hotbox"
                ? "bg-color text-white "
                : "bg-white text-black hover:bg-red-50 hover:text-black"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Presentation className="w-4 h-4" />
                <span className="font-medium">Hot Box</span>
              </div>
            </button>
          </li>

          <li className="w-44 focus-within:z-10">
            <button
              onClick={() => setActiveTab("qrcode")}
              className={`inline-block w-full p-3 border-r ${activeTab === "qrcode"
                ? "bg-color text-white"
                : "bg-white text-black hover:bg-red-50 hover:text-black"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Grid className="w-4 h-4" />
                <span className="font-medium">QBox</span>
              </div>
            </button>
          </li>
        </ul>


        {/* Tab Content */}
        <div className="p-4 mt-4 dark:border-gray-700">
          {activeTab === "hotbox" && <HotBox />}
          {activeTab === "qrcode" && (
            <QRCodeTab />
          )}
        </div>
      </div>
    </>
  );
}
export default QboxCell;