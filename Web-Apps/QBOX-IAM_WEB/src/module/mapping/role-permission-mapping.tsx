import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Save, Lock, Unlock, ChevronRight, ChevronDown, ArrowDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRole } from "@/redux/features/roleSlice";
import { RootState } from "@/redux/store";
import { ApiService } from "@/services/apiServices";
import RoleSelector from "./RoleSelector";
import { toast } from "react-toastify";
import Popup from "@/components/ui/popup";
import { useTheme } from "@/hooks/useTheme";

const RolePermissionMapping = () => {
  const dispatch = useDispatch();
  const [selectedMappedItems, setSelectedMappedItems]: any = useState([]);
  const [selectedUnmappedItems, setSelectedUnmappedItems]: any = useState([]);
  const [mappedPermissions, setMappedPermissions]: any = useState([]);
  const [unmappedPermissions, setUnmappedPermissions]: any = useState([]);
  const [activeTab, setActiveTab] = useState("unmapped");
  const [mappedData, setMappedData]: any = useState([]);
  const [unMappedData, setUnmappedData]: any = useState([]);
  const [isAllUnmappedSelected, setIsAllUnmappedSelected] = useState(false);
  const [isAllMappedSelected, setIsAllMappedSelected] = useState(false);
  const [showSelectAll, setShowSelectAll] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [menuSearchTermMapped, setMenuSearchTermMapped] = useState(""); // For searching unmapped menu
  const [menuSearchTermUnmapped, setMenuSearchTermUnmapped] = useState(""); // For searching mapped menu
  const [searchTerm, setSearchTerm] = useState(""); // For searching role
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // "map" or "unmap"
  const { theme, toggleTheme } = useTheme();
  // Add these new state variables to store previous state
  const [previousMappedData, setPreviousMappedData]: any = useState([]);
  const [previousUnmappedData, setPreviousUnmappedData]: any = useState([]);


  // Tree Node Component
  const TreeNode = ({
    isOpen,
    onToggle,
    label,
    isChecked,
    onCheckboxChange,
    hasChildren = false,
    level = 0
  }: any) => {
    return (
      <div
        className={`${theme === 'light' ? 'hover:bg-gray-100 transition-colors flex items-center p-2 rounded-lg' : 'hover:bg-gray-800 transition-colors flex items-center p-2 rounded-lg'} ${level === 0 ? 'font-medium' : 'text-sm'
          }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={onToggle}
            className="p-1 rounded-full hover:bg-gray-200 mr-1"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckboxChange}
          className="h-4 w-4 text-indigo-600 rounded border-gray-300 mr-2"
        />
        <span className="text-white-700">{label}</span>
      </div>
    );
  };

  // Permissions Tree Component
  const PermissionsTree = ({
    data,
    type = "unmapped",
    selectedItems,
    onMenuSelect,
    onPermissionSelect,
    onSelectAll, // New prop to handle select all
    isAllSelected, // New prop to track select all state
  }: any) => {
    const [expandedMenus, setExpandedMenus]: any = useState({});

    const toggleMenu = (menuId: any) => {
      setExpandedMenus((prev: { [x: string]: any }) => ({
        ...prev,
        [menuId]: !prev[menuId],
      }));
    };

    const isMenuSelected = (menu: any) => {
      return selectedItems.some((item: { menuId: any }) => item.menuId === menu.menuId);
    };

    const isPermissionSelected = (
      menu: { menuId: any },
      permission: { permissionId: any }
    ) => {
      return selectedItems.some(
        (item: { permissionId: any; menuId: any }) =>
          item.permissionId === permission.permissionId && item.menuId === menu.menuId
      );
    };

    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600 space-x-2">
            {type === "unmapped" ? (
              <Lock className="h-5 w-5 text-gray-400" />
            ) : (
              <Unlock className="h-5 w-5 text-red-600" />
            )}
            <span>{type === "unmapped" ? "Unmapped" : "Mapped"} Permissions</span>
            <Badge variant="secondary" className="ml-2 bg-gray-200 text-black">
              {data?.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center mt-2 pt-2">
            {showSelectAll && (
              <>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300 mr-2"
                />
                <span>{isAllSelected ? "Unselect All" : "Select All"}</span>
              </>
            )}
          </div>
        </CardHeader>
        {/* Add overflow-y-auto and max-h-[400px] for scrolling */}
        <CardContent className="max-h-[400px] overflow-y-auto">
          {data?.length > 0 ? (
            <AnimatePresence>
              {data.map((menu: { menuId: any; menuName?: any; permissions?: any }) => (
                <motion.div
                  key={menu.menuId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-2"
                >
                  <TreeNode
                    isOpen={expandedMenus[menu.menuId]}
                    onToggle={() => toggleMenu(menu.menuId)}
                    label={menu.menuName}
                    isChecked={isMenuSelected(menu)}
                    onCheckboxChange={() => onMenuSelect(menu)}
                    hasChildren={menu.permissions?.length > 0}
                  />
                  <AnimatePresence>
                    {expandedMenus[menu.menuId] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        {menu.permissions.map(
                          (permission: { permissionId: any; permissionName?: any }) => (
                            <motion.div
                              key={permission.permissionId}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: -10, opacity: 0 }}
                            >
                              <TreeNode
                                level={1}
                                label={permission.permissionName}
                                isChecked={isPermissionSelected(menu, permission)}
                                onCheckboxChange={() =>
                                  onPermissionSelect(menu, permission)
                                }
                              />
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex justify-center items-center text-gray-500 h-[50px]">
              No Data Found
            </div>
          )}
        </CardContent>
      </Card>

    );
  };

  useEffect(() => {
    dispatch(getAllRole({}));
  }, [dispatch]);

  const { roleList } = useSelector((state: RootState) => state.roleSlice);

  const handleSelectAll = (type: string) => {
    if (type === "unmapped") {
      if (!isAllUnmappedSelected) {
        // Select all unmapped menus and permissions
        const allUnmappedItems = unMappedData.flatMap(
          (menu: {
            menuName: any; permissions: any[]; menuId: any; roleId: any
          }) =>
            menu.permissions.map((permission) => ({
              roleId: menu.roleId,
              menuId: menu.menuId,
              menuName: menu.menuName,
              permissionId: permission.permissionId,
              permissionName: permission.permissionName,
              mediaLink: permission.mediaLink,
              isActive: permission.isActive
            }))
        );
        setSelectedUnmappedItems(allUnmappedItems);
      } else {
        // Unselect all unmapped
        setSelectedUnmappedItems([]);
      }
      setIsAllUnmappedSelected(!isAllUnmappedSelected);
    } else if (type === "mapped") {
      if (!isAllMappedSelected) {
        // Select all mapped menus and permissions
        const allMappedItems = mappedData.flatMap(
          (menu: {
            menuName: any; permissions: any[]; menuId: any; roleId: any
          }) =>
            menu.permissions.map((permission) => ({
              menuId: menu.menuId,
              menuName: menu.menuName,
              roleId: menu.roleId,
              permissionId: permission.permissionId,
              permissionName: permission.permissionName,
              isActive: permission.isActive,
              mediaLink: permission.mediaLink
            }))
        );
        setSelectedMappedItems(allMappedItems);
      } else {
        // Unselect all mapped
        setSelectedMappedItems([]);
      }
      setIsAllMappedSelected(!isAllMappedSelected);
    }
  };

  const handleRoleClick = async (roleId: any) => {
    setShowButton(false);
    try {
      const params = { roleId: roleId };
      const data = await ApiService('8914', 'get', '/get_map_unmap_role_permission_by_role_id',
        null,
        params
      );
      console.log(data)
      setMappedData(data?.data?.mapped_permissions || []);
      setUnmappedData(data?.data.unmapped_permissions || []);
      setSelectedUnmappedItems([]);
      setSelectedMappedItems([]);
      setShowSelectAll(true);
      setIsAllUnmappedSelected(false)
      setIsAllMappedSelected(false)

    } catch (error) {

    }
  };

  const handleRolePermissionMapping = async () => {
    try {
      const params = {
        mappedPermissions: mappedPermissions.length > 0 ? mappedPermissions : [],
        unmappedPermissions: mappedPermissions.length === 0 ? unmappedPermissions : [],
      };
      const data = await ApiService('8914', 'post', '/create_map_unmap_role_permissions', params);
      if (data?.data?.status === "success" && data?.data?.insertMessage === "Mapped success") {
        toast.success("Premission Mapped Success");
      } else if (data?.data?.status === "success" && data?.data?.deleteMessage === "Unmapped success") {
        toast.success("Premission UnMapped Success");
      } else {
        toast.error("Someting went wrong");
      }
      setMappedPermissions([]);
      setUnmappedPermissions([]);
      setIsAllUnmappedSelected(false)
      setIsAllMappedSelected(false)
    } catch (error) {
      toast.error("Someting went wrong");
    }
    setShowButton(false);
  };

  const moveToMapped = () => {

    // Store current state before making changes
    setPreviousMappedData([...mappedData]);
    setPreviousUnmappedData([...unMappedData]);

    setIsPopupOpen(true);
    setActionType("map")
    const newMappedData = [...mappedData];

    // Move unmapped items to mapped
    selectedUnmappedItems.forEach((item: any) => {
      const menuIndex = newMappedData.findIndex((menu: any) => menu.menuId === item.menuId);

      if (menuIndex !== -1) {
        // If menu exists, add permission under the existing menu
        const existingPermissions = newMappedData[menuIndex].permissions.map((perm: any) => perm.permissionId);
        if (!existingPermissions.includes(item.permissionId)) {
          newMappedData[menuIndex].permissions.push({
            ...item,
            isNew: true,
          });
        }
      } else {
        // If menu doesn't exist, create a new menu with the permission
        newMappedData.push({
          menuId: item.menuId,
          menuName: item.menuName,
          roleId: item.roleId,
          permissions: [{
            ...item,
            isNew: true,
          }],
        });
      }
    });

    const newUnmappedData = unMappedData.map((menu: any) => {
      return {
        ...menu,
        permissions: menu.permissions.filter(
          (perm: any) => !selectedUnmappedItems.some(
            (selected: any) => selected.permissionId === perm.permissionId && selected.menuId === menu.menuId
          )
        ),
      };
    }).filter((menu: any) => menu.permissions.length > 0);

    setMappedData(newMappedData);
    setUnmappedData(newUnmappedData);
    setSelectedUnmappedItems([]);
    setMappedPermissions(selectedUnmappedItems);
    setShowButton(true);
  };

  const moveToUnmapped = () => {

    // Store current state before making changes
    setPreviousMappedData([...mappedData]);
    setPreviousUnmappedData([...unMappedData]);

    setIsPopupOpen(true);
    setActionType("unmap")
    const newUnmappedData = [...unMappedData];

    // Move mapped items back to unmapped
    selectedMappedItems.forEach((item: any) => {
      const menuIndex = newUnmappedData.findIndex((menu: any) => menu.menuId === item.menuId);

      if (menuIndex !== -1) {
        // If menu exists, add permission under the existing menu
        const existingPermissions = newUnmappedData[menuIndex].permissions.map((perm: any) => perm.permissionId);
        if (!existingPermissions.includes(item.permissionId)) {
          newUnmappedData[menuIndex].permissions.push({
            ...item,
            isNew: false,
          });
        }
      } else {
        // If menu doesn't exist, create a new menu with the permission
        newUnmappedData.push({
          menuId: item.menuId,
          menuName: item.menuName,
          roleId: item.roleId,
          permissions: [{
            ...item,
            isNew: false,
          }],
        });
      }
    });

    const newMappedData = mappedData.map((menu: any) => {
      return {
        ...menu,
        permissions: menu.permissions.filter(
          (perm: any) => !selectedMappedItems.some(
            (selected: any) => selected.permissionId === perm.permissionId && selected.menuId === menu.menuId && selected.roleId === menu.roleId
          )
        ),
      };
    }).filter((menu: any) => menu.permissions.length > 0);

    setUnmappedData(newUnmappedData);
    setMappedData(newMappedData);
    setSelectedMappedItems([]);
    setUnmappedPermissions(selectedMappedItems);
    setShowButton(true);
  };

  const handleMenuSelect = (menu: { menuId: any; permissions: any[]; menuName: any; roleId: any; }, type: string) => {

    const selectedItems = type === "mapped" ? selectedMappedItems : selectedUnmappedItems;
    const setSelectedItems = type === "mapped" ? setSelectedMappedItems : setSelectedUnmappedItems;
    const isSelected = selectedItems.some((item: { menuId: any; }) => item.menuId === menu.menuId);

    if (isSelected) {
      setSelectedItems((prev: any[]) => prev.filter(item => item.menuId !== menu.menuId));
    } else {
      setSelectedItems((prev: any) => [
        ...prev,
        ...menu.permissions.map(permission => ({
          ...permission,
          menuId: menu.menuId,
          menuName: menu.menuName,
          roleId: menu.roleId
        }))
      ]);
    }
  };

  const handlePermissionSelect = (menu: any, permission: any, type: string) => {
    const selectedItems = type === "mapped" ? selectedMappedItems : selectedUnmappedItems;
    const setSelectedItems = type === "mapped" ? setSelectedMappedItems : setSelectedUnmappedItems;

    const isSelected = selectedItems.some(
      (item: any) =>
        item.permissionId === permission.permissionId &&
        item.menuId === menu.menuId
    );

    if (isSelected) {
      setSelectedItems((prev: any) =>
        prev.filter(
          (item: any) =>
            item.permissionId !== permission.permissionId ||
            item.menuId !== menu.menuId
        )
      );
    } else {
      setSelectedItems((prev: any) => [
        ...prev,
        { ...permission, menuId: menu.menuId, menuName: menu.menuName, roleId: menu.roleId },
      ]);
    }
  };

  const filteredUnmappedData = unMappedData.filter((menu: any) =>
    (menu?.menuName ?? '').toLowerCase().includes(menuSearchTermUnmapped.toLowerCase())
  );

  const filteredMappedData = mappedData.filter((menu: any) =>
    (menu?.menuName ?? '').toLowerCase().includes(menuSearchTermMapped.toLowerCase())
  );


  const handleSearchMenu = (type: "mapped" | "unmapped", value: string) => {
    if (type === "mapped") {
      setMenuSearchTermMapped(value);
    } else if (type === "unmapped") {
      setMenuSearchTermUnmapped(value);
    }
  };

  // Modify handleClosePopup function
  const handleClosePopup = () => {
    // Revert to previous state when user cancels
    setMappedData(previousMappedData);
    setUnmappedData(previousUnmappedData);
    setIsPopupOpen(false);
    setSelectedUnmappedItems([]);
    setSelectedMappedItems([]);
    setMappedPermissions([]);
    setUnmappedPermissions([]);
    setShowButton(false);
  };

  const filteredRoles = roleList?.filter((role: any) =>
    role.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Section */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-red-600" />
                <div>
                  <CardTitle className="text-2xl text-red-600 font-bold">Role Permission Mapping</CardTitle>
                  <p className="text-sm text-gray-500">Manage role permissions and access rights</p>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2  transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-5  bg-gray-100 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 text-black"
                />
              </div>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
            {/* Roles Section */}
            <RoleSelector
              roleList={roleList}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleRoleClick={handleRoleClick}
              searchTerm={searchTerm}
            />

            {/* Permissions UnMapping Section */}
            <div className="grid grid-cols-12 ">
              {filteredRoles?.length > 0 && (
                <>
                  <div className="col-span-5">
                    {/* Search Box for Unmapped */}
                    {showSelectAll && (
                      <>
                        <div className="relative w-full mb-4">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="text"
                            placeholder="Search Unmapped Menu..."
                            value={menuSearchTermUnmapped}
                            onChange={(e) => handleSearchMenu("unmapped", e.target.value)}
                            className="pl-8 pr-4 py-2 bg-gray-200 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 text-black"
                          />
                        </div>
                      </>
                    )}
                    <PermissionsTree
                      data={filteredUnmappedData}
                      type="unmapped"
                      selectedItems={selectedUnmappedItems}
                      onMenuSelect={(menu: any) => handleMenuSelect(menu, "unmapped")}
                      onPermissionSelect={(menu: any, permission: any) =>
                        handlePermissionSelect(menu, permission, "unmapped")
                      }
                      onSelectAll={() => handleSelectAll("unmapped")}
                      isAllSelected={isAllUnmappedSelected}
                    />
                  </div>
                  {/* Action Buttons */}
                  <div className="col-span-2 flex flex-col items-center justify-center space-y-4">
                    {/* {filteredRoles.length > 0 && ( */}
                    {/* <> */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        onClick={moveToMapped}
                        disabled={selectedUnmappedItems?.length === 0}
                        className="w-12 h-12 rounded-full bg-red-600 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        onClick={moveToUnmapped}
                        disabled={selectedMappedItems?.length === 0}
                        className="w-12 h-12 rounded-full bg-red-600 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        <ChevronRight className="h-6 w-6 rotate-180" />
                      </Button>
                    </motion.div>
                    {/* </>
            )} */}
                  </div>

                  {/* Mapped Permissions */}
                  <div className="col-span-5">
                    {showSelectAll && (
                      <>
                        <div className="relative w-full mb-4">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="text"
                            placeholder="Search Mapped Menu..."
                            value={menuSearchTermMapped}
                            onChange={(e) => handleSearchMenu("mapped", e.target.value)}
                            className="pl-8 pr-4 py-2 bg-gray-200  border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-200 text-black"
                          />
                        </div>
                      </>
                    )}
                    {filteredMappedData.length > 0 ? (
                      <PermissionsTree
                        data={filteredMappedData}
                        type="mapped"
                        selectedItems={selectedMappedItems}
                        onMenuSelect={(menu: any) => handleMenuSelect(menu, "mapped")}
                        onPermissionSelect={(menu: any, permission: any) =>
                          handlePermissionSelect(menu, permission, "mapped")
                        }
                        onSelectAll={() => handleSelectAll("mapped")}
                        isAllSelected={isAllMappedSelected}
                      />
                    ) : (
                      <PermissionsTree
                        data={filteredMappedData}
                        type="mapped"
                        selectedItems={selectedMappedItems}
                        onMenuSelect={(menu: any) => handleMenuSelect(menu, "mapped")}
                        onPermissionSelect={(menu: any, permission: any) =>
                          handlePermissionSelect(menu, permission, "mapped")
                        }
                        onSelectAll={() => handleSelectAll("mapped")}
                        isAllSelected={isAllMappedSelected} />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Submit Button */}
            <motion.div
              className="mt-8 flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
            </motion.div>
          </div>
        </motion.div>

      </div>
      <Popup
        IsPopupOpen={isPopupOpen}
        icon={<Shield />}
        confirmSave={() => {
          handleRolePermissionMapping();
          setIsPopupOpen(false);
        }}
        cancelSave={handleClosePopup}
        Description={`Are you sure you want to ${actionType === "map" ? "map" : "unmap"} the permission to the menu?`}
        option1="Confirm"
        option2="Cancel"
      />
    </div>

  );
};

export default RolePermissionMapping;