import { useState } from "react";
import { FlexibleTable } from "@/components/FlexibleTable";

// Sample Data for Menu Permissions
const initialMenuData = [
    { id: 1, menu: "Dashboard", action: "View", permissions: ["Read", "Update"] },
    { id: 2, menu: "Settings", action: "Edit", permissions: ["Create", "Update"] },
    { id: 3, menu: "Profile", action: "View", permissions: ["Read"] },
    { id: 4, menu: "Reports", action: "Generate", permissions: ["Read", "Delete"] },
];

// Column Configuration for Menu Permissions
const menuColumnConfig = [
    { key: "menu", header: "Menu", sortable: true, filterable: true },
    {
        key: "action",
        header: "Action",
        sortable: false,
        filterable: false,
        render: (value: any) => {
            return (
                <div className="flex space-x-2">
                        <span  className={`px-2 py-1 text-sm font-medium text-white rounded ${getPermissionColor(value)}`}>
                            {value}
                        </span>
                </div>
            );
        },
    },
];

// Function to get permission color
const getPermissionColor = (permission: any) => {
    switch (permission) {
        case "Generate":
            return "bg-green-500";
        case "View":
            return "bg-blue-500";
        case "Edit":
            return "bg-yellow-500";
        case "Delete":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

// MenuPermissions Component
export default function MenuActions() {
    // Explicitly type the state for newMenu and permissions
    const [menuData, setMenuData] = useState(initialMenuData);

    // Explicitly type the state for newMenu and permissions
    const [newMenu, setNewMenu] = useState<{
        menu: string;
        action: string;
        permissions: string[]; // Explicitly declare permissions as an array of strings
    }>({
        menu: "",
        action: "",
        permissions: [], // Array of strings to hold permissions
    });

    // Handler for adding a new menu
    const handleAddMenu = () => {
        if (newMenu.menu && newMenu.action && newMenu.permissions.length > 0) {
            const newMenuItem = {
                ...newMenu,
                id: menuData.length + 1, // Simple ID generation for new entries
            };
            setMenuData((prevData) => [...prevData, newMenuItem]);
            setNewMenu({ menu: "", action: "", permissions: [] }); // Reset the input fields
        }
    };

    return (
        <div>
            {/* Add Menu Form */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Add New Menu</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Menu Name</label>
                        <input
                            type="text"
                            value={newMenu.menu}
                            onChange={(e) => setNewMenu({ ...newMenu, menu: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Action</label>
                        <input
                            type="text"
                            value={newMenu.action}
                            onChange={(e) => setNewMenu({ ...newMenu, action: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Permissions</label>
                        <input
                            type="text"
                            value={newMenu.permissions.join(", ")}
                            onChange={(e) => setNewMenu({ ...newMenu, permissions: e.target.value.split(",").map(p => p.trim()) })}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Comma separated permissions"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAddMenu}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
                >
                    Add Menu
                </button>
            </div>

            {/* Table for Displaying Menu Permissions */}
            <FlexibleTable
                data={menuData}
                columns={menuColumnConfig}
                defaultItemsPerPage={5}
                tableName="Menu Permissions"
            />
        </div>
    );
}
