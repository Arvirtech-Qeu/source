// import React, { useState, useMemo } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { PlusCircle, Filter, ChevronUp, ChevronDown, MoreVertical } from "lucide-react";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils"
// import { ArrowDownFromLine, Settings } from "lucide-react"; // Import icons for export and settings


// interface ColumnConfig {
//     key: string;
//     header: string;
//     render?: (value: any, row: any) => React.ReactNode;
//     sortable?: boolean;
//     filterable?: boolean;
//     type?: "text" | "number" | "date" | "image" | "badge";
//     badgeConfig?: {
//         colorMap: { [key: string]: string };
//     };
// }

// interface TableProps {
//     data: any[];
//     columns: ColumnConfig[];
//     itemsPerPageOptions?: number[];
//     defaultItemsPerPage?: number;
//     tableName?: string;
//     isSearch?: boolean;
//     isAction?: boolean;
//     createNewFn?: () => void;
//     actionFn?: (rowData: any, action: string) => void;
//     playRow?: boolean;
//     playRowFn?: (rowData: any) => void;
//     background?: string
// }

// type SortConfig = {
//     key: string;
//     direction: "asc" | "desc" | null;
// };
// const tableNameCheckList = ["Create New Flow", "Create New Project", "Create New Environment"]

// const CustomTableHeader: React.FC<{
//     columns: ColumnConfig[];
//     visibleColumns: { [key: string]: boolean };
//     sortConfig: SortConfig;
//     requestSort: (key: string) => void;
//     isAction?: boolean;
// }> = React.memo(({ columns, visibleColumns, sortConfig, requestSort, isAction }) => {
//     const getSortIcon = (key: string) => {
//         if (sortConfig.key === key) {
//             return sortConfig.direction === "asc" ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />;
//         }
//         return null;
//     };

//     return (
//         <TableHeader className="bg-gray-200 text-black font-semibold">
//             <TableRow>
//                 {columns.map((column) =>
//                     visibleColumns[column.key] ? (
//                         <TableHead key={column.key} onClick={() => column.sortable && requestSort(column.key)} className={column.sortable ? "cursor-pointer" : ""}>
//                             {column.header} {column.sortable && getSortIcon(column.key)}
//                         </TableHead>
//                     ) : null
//                 )}
//                 {isAction && <TableHead>Action</TableHead>}
//             </TableRow>
//         </TableHeader>
//     );
// });


// const TableBodyComponent: React.FC<{
//     data: any[];
//     columns: ColumnConfig[];
//     visibleColumns: { [key: string]: boolean };
//     actionFn?: (rowData: any, action: string) => void;
//     playRow?: boolean;
//     playRowFn?: (rowData: any) => void;
//     isAction?: boolean;
// }> = React.memo(({ data, columns, visibleColumns, actionFn, playRow, playRowFn, isAction }) => (
//     <TableBody>
//         {data?.map((row, index) => (
//             <TableRow key={index} className={playRow ? "cursor-pointer" : ""} onClick={playRow && playRowFn ? () => playRowFn(row) : undefined}>
//                 {columns.map((column) =>
//                     visibleColumns[column.key] ? (
//                         <TableCell key={column.key} className={column.type === "number" ? "text-center" : "text-justify"}>
//                             {column.render
//                                 ? column.render(row[column.key], row)
//                                 : column.type === "image" ? (
//                                     <Avatar className="h-8 w-8">
//                                         <AvatarImage src={row[column.key]} alt={row[column.key]} />
//                                         <AvatarFallback>{row[column.key] ? row[column.key][0] : <PlusCircle className="h-4 w-4" />}</AvatarFallback>
//                                     </Avatar>
//                                 ) : column.type === "badge" && column.badgeConfig ? (
//                                     <Badge className={`${column.badgeConfig.colorMap[row[column.key]]} text-white p-1`}>
//                                         {row[column.key]}
//                                     </Badge>
//                                 ) : (
//                                     row[column.key]
//                                 )}
//                         </TableCell>
//                     ) : null
//                 )}
//                 {isAction && (
//                     <TableCell>
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="destructive" size="sm">
//                                     <MoreVertical className="h-4 w-4" />
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent side="right" align="start">
//                                 <DropdownMenuItem onClick={() => actionFn && actionFn(row, "edit")}>Edit</DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => actionFn && actionFn(row, "changeStatus")}>Change Status</DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </TableCell>
//                 )}
//             </TableRow>
//         ))}
//     </TableBody>
// ));

// export function FlexibleTable({
//     data,
//     columns,
//     itemsPerPageOptions = [5, 10, 15, 25],
//     defaultItemsPerPage = 5,
//     tableName = "",
//     isSearch = true,
//     isAction = true,
//     createNewFn,
//     actionFn,
//     playRow = false,
//     playRowFn,
//     background = 'gray',
// }: TableProps) {
//     const [sortConfig, setSortConfig] = useState<SortConfig>({
//         key: columns[0].key,
//         direction: null,
//     });
//     const [filters, setFilters] = useState<{ [key: string]: string }>({});
//     const [searchTerm, setSearchTerm] = useState("");
//     const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [visibleColumns, setVisibleColumns]: any = useState(
//         columns.reduce((acc, column) => ({ ...acc, [column.key]: true }), {})
//     );

//     const handleColumnVisibility = (key: string) => {
//         setVisibleColumns((prev: any) => ({ ...prev, [key]: !prev[key] }));
//     };
//     const sortedAndFilteredData = useMemo(() => {
//         return data?.filter((item) =>
//             Object.entries(filters).every(
//                 ([key, value]) =>
//                     value === "All" || item[key]?.toString() === value
//             )
//         )
//             .filter((item) =>
//                 Object.values(item).some((value) =>
//                     value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//                 )
//             )
//             .sort((a, b) => {
//                 if (!sortConfig.direction) return 0;

//                 const column = columns.find((col) => col.key === sortConfig.key);
//                 let aValue = a[sortConfig.key];
//                 let bValue = b[sortConfig.key];
//                 let compare = 0;

//                 if (column?.type === "date") {
//                     aValue = new Date(aValue).getTime();
//                     bValue = new Date(bValue).getTime();
//                     compare = aValue - bValue;
//                 } else if (
//                     typeof aValue === "number" &&
//                     typeof bValue === "number"
//                 ) {
//                     compare = aValue - bValue;
//                 } else {
//                     compare = aValue.toString().localeCompare(bValue.toString());
//                 }

//                 return sortConfig.direction === "asc" ? compare : -compare;
//             });
//     }, [data, sortConfig, filters, searchTerm, columns]);

//     const paginatedData = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return sortedAndFilteredData?.slice(
//             startIndex,
//             startIndex + itemsPerPage
//         );
//     }, [sortedAndFilteredData, currentPage, itemsPerPage]);

//     const totalPages = Math.ceil(sortedAndFilteredData?.length / itemsPerPage);

//     const requestSort = (key: string) => {
//         setSortConfig((prevConfig) => ({
//             key,
//             direction:
//                 prevConfig.key === key
//                     ? prevConfig.direction === "asc"
//                         ? "desc"
//                         : prevConfig.direction === "desc"
//                             ? null
//                             : "asc"
//                     : "asc",
//         }));
//     };

//     const handleFilter = (key: string, value: string) => {
//         setFilters((prev) => ({ ...prev, [key]: value }));
//         setCurrentPage(1);
//     };

//     function functionCreation() {
//         if (createNewFn) {
//             createNewFn();
//         }
//     }
//     const exportTableData = () => {
//         const csvContent = [
//             columns.map(col => col.header).join(","), // Headers
//             ...data.map(row => columns.map(col => row[col.key] || "").join(",")), // Rows
//         ].join("\n");

//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `${tableName || "table-data"}.csv`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
//     return (
//         // <div className="container mx-auto p-4">
//         <div className="flex justify-between items-center mb-4">
//             <div className="flex space-x-4">
//                 {columns.filter((col) => col.filterable).map((column) => (
//                     <DropdownMenu key={column.key} >
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="garden" className="border shadow-sm">
//                                 <Filter className="mr-2 h-4 w-4" /> {column.header} /{" "}
//                                 {filters[column.key] || "All"}
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="max-h-60 overflow-y-auto">
//                             <DropdownMenuItem
//                                 onClick={() => handleFilter(column.key, "All")}
//                             >
//                                 All
//                             </DropdownMenuItem>
//                             {Array.from(
//                                 new Set(
//                                     data
//                                         .map((item) => item[column.key])
//                                         .filter((value) => value !== undefined)
//                                 )
//                             ).map((value) => (
//                                 <DropdownMenuItem
//                                     key={value}
//                                     onClick={() => handleFilter(column.key, value)}
//                                 >
//                                     {value}
//                                 </DropdownMenuItem>
//                             ))}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 ))}
//             </div>
//             <div className="flex space-x-2">
//                 {isSearch && (<Input
//                     placeholder="Search"
//                     className="w-44 border shadow text-black"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />)}
//                 <Button variant="default" onClick={exportTableData} className="ml-2">
//                     Export <ArrowDownFromLine className="ml-2 h-4 w-4" />
//                 </Button>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="sm">
//                             <Settings className="h-4 w-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent side="right" align="start">
//                         {columns.map((column: any) => (
//                             <DropdownMenuItem key={column.key}>
//                                 <label className="flex items-center cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         checked={visibleColumns[column.key]}
//                                         onChange={() => handleColumnVisibility(column.key)}
//                                         className="mr-2 h-5 w-5"  // Increase checkbox size
//                                     />
//                                     <span onClick={() => handleColumnVisibility(column.key)} className="select-none text-sm">{column.header}</span>
//                                 </label>
//                             </DropdownMenuItem>
//                         ))}
//                     </DropdownMenuContent>
//                 </DropdownMenu>

//                 {tableName != '' && (<Button
//                     variant="garden"
//                     className={`border bg-teal-500 text-white`}
//                     onClick={functionCreation}
//                 >
//                     {tableName} <PlusCircle className="ml-2 h-4 w-4" />
//                 </Button>)}
//             </div>
//             {/* </div> */}
//             {data && data.length > 0 ? (
//                 <Table>
//                     <CustomTableHeader columns={columns} visibleColumns={visibleColumns} sortConfig={sortConfig} requestSort={() => { }} isAction={isAction} />
//                     <TableBodyComponent data={paginatedData} columns={columns} visibleColumns={visibleColumns} actionFn={actionFn} playRow={playRow} playRowFn={playRowFn} isAction={isAction} />

//                 </Table>
//             ) : (
//                 <div className="flex mt-28 justify-center h-screen">
//                     <img src="/src/common/image.svg" className="h-96" alt="No Data" />
//                 </div>
//             )}

//             {data?.length > 10 && (<div className="flex justify-between items-center mt-4">
//                 <div className="flex items-center space-x-2">
//                     <Button
//                         className="bg-gray-900 text-white hover:bg-gray-800"
//                         onClick={() =>
//                             setCurrentPage((prev) => Math.max(prev - 1, 1))
//                         }
//                         disabled={currentPage === 1}
//                     >
//                         Previous
//                     </Button>
//                     <span>
//                         Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                         className="bg-gray-900 text-white hover:bg-gray-800"
//                         onClick={() =>
//                             setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                         }
//                         disabled={currentPage === totalPages}
//                     >
//                         Next
//                     </Button>
//                 </div>
//                 <Select
//                     value={itemsPerPage.toString()}
//                     onValueChange={(value: any) => {
//                         setItemsPerPage(Number(value));
//                         setCurrentPage(1);
//                     }}
//                 >
//                     <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Select items per page" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {itemsPerPageOptions.map((num) => (
//                             <SelectItem key={num} value={num.toString()}>
//                                 {num} per page
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>
//             )}
//         </div>
//     );
// }



import React, { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Filter, ChevronUp, ChevronDown, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils"
import { ArrowDownFromLine, Settings } from "lucide-react"; // Import icons for export and settings
import WarningToast from "@/common/WarningToast";


interface ColumnConfig {
    key: string;
    header: string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    type?: "text" | "number" | "date" | "image" | "badge";
    badgeConfig?: {
        colorMap: { [key: string]: string };
    };
}

interface TableProps {
    data: any[];
    columns: ColumnConfig[];
    itemsPerPageOptions?: number[];
    defaultItemsPerPage?: number;
    tableName?: string;
    isSearch?: boolean;
    isAction?: boolean;
    createNewFn?: () => void;
    actionFn?: (rowData: any, action: string) => void;
    playRow?: boolean;
    playRowFn?: (rowData: any) => void;
    background?: string,
    warningMessage?: string;
    openWarningTost?: boolean;
    closeWarningTost?: () => void;
}

type SortConfig = {
    key: string;
    direction: "asc" | "desc" | null;
};
const tableNameCheckList = ["Create New Flow", "Create New Project", "Create New Environment"]

const CustomTableHeader: React.FC<{
    columns: ColumnConfig[];
    visibleColumns: { [key: string]: boolean };
    sortConfig: SortConfig;
    requestSort: (key: string) => void;
    isAction?: boolean;
}> = React.memo(({ columns, visibleColumns, sortConfig, requestSort, isAction }) => {
    const getSortIcon = (key: string) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />;
        }
        return null;
    };

    return (
        <TableHeader className="bg-gray-200 text-black font-semibold">
            <TableRow>
                {columns.map((column) =>
                    visibleColumns[column.key] ? (
                        <TableHead key={column.key} onClick={() => column.sortable && requestSort(column.key)} className={column.sortable ? "cursor-pointer" : ""}>
                            {column.header} {column.sortable && getSortIcon(column.key)}
                        </TableHead>
                    ) : null
                )}
                {isAction && <TableHead>Action</TableHead>}
            </TableRow>
        </TableHeader>
    );
});


const TableBodyComponent: React.FC<{
    data: any[];
    columns: ColumnConfig[];
    visibleColumns: { [key: string]: boolean };
    actionFn?: (rowData: any, action: string) => void;
    playRow?: boolean;
    playRowFn?: (rowData: any) => void;
    isAction?: boolean;
}> = React.memo(({ data, columns, visibleColumns, actionFn, playRow, playRowFn, isAction }) => (
    <TableBody>
        {data?.map((row, index) => (
            <TableRow key={index} className={playRow ? "cursor-pointer" : ""} onClick={playRow && playRowFn ? () => playRowFn(row) : undefined}>
                {columns.map((column) =>
                    visibleColumns[column.key] ? (
                        <TableCell key={column.key} className={column.type === "number" ? "text-center" : "text-justify"}>
                            {column.render
                                ? column.render(row[column.key], row)
                                : column.type === "image" ? (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={row[column.key]} alt={row[column.key]} />
                                        <AvatarFallback>{row[column.key] ? row[column.key][0] : <PlusCircle className="h-4 w-4" />}</AvatarFallback>
                                    </Avatar>
                                ) : column.type === "badge" && column.badgeConfig ? (
                                    <Badge className={`${column.badgeConfig.colorMap[row[column.key]]} text-white p-1`}>
                                        {row[column.key]}
                                    </Badge>
                                ) : (
                                    row[column.key]
                                )}
                        </TableCell>
                    ) : null
                )}
                {isAction && (
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                                <DropdownMenuItem onClick={() => actionFn && actionFn(row, "edit")}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => actionFn && actionFn(row, "changeStatus")}>Change Status</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                )}
            </TableRow>
        ))}
    </TableBody>
));

export function FlexibleTable({
    data,
    columns,
    itemsPerPageOptions = [5, 10, 15, 25],
    defaultItemsPerPage = 5,
    tableName = "",
    isSearch = true,
    isAction = true,
    createNewFn,
    actionFn,
    playRow = false,
    playRowFn,
    background = 'gray',
    dependencies = [], // New prop for checking dependencies
    warningMessage = "",
    openWarningTost = false,
    closeWarningTost, // Destructure the prop here


}: TableProps & { dependencies?: any[] }) {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: columns[0].key,
        direction: null,
    });
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns]: any = useState(
        columns.reduce((acc, column) => ({ ...acc, [column.key]: true }), {})
    );

    // Check if any dependency array is empty
    const hasEmptyDependencies = dependencies.some(dep => !dep || dep.length === 0);

    const handleColumnVisibility = (key: string) => {
        setVisibleColumns((prev: any) => ({ ...prev, [key]: !prev[key] }));
    };
    const sortedAndFilteredData = useMemo(() => {
        return data?.filter((item) =>
            Object.entries(filters).every(
                ([key, value]) =>
                    value === "All" || item[key]?.toString() === value
            )
        )
            .filter((item) =>
                Object.values(item).some((value) =>
                    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
            .sort((a, b) => {
                if (!sortConfig.direction) return 0;

                const column = columns.find((col) => col.key === sortConfig.key);
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                let compare = 0;

                if (column?.type === "date") {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                    compare = aValue - bValue;
                } else if (
                    typeof aValue === "number" &&
                    typeof bValue === "number"
                ) {
                    compare = aValue - bValue;
                } else {
                    compare = aValue.toString().localeCompare(bValue.toString());
                }

                return sortConfig.direction === "asc" ? compare : -compare;
            });
    }, [data, sortConfig, filters, searchTerm, columns]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredData?.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [sortedAndFilteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedAndFilteredData?.length / itemsPerPage);

    const requestSort = (key: string) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key
                    ? prevConfig.direction === "asc"
                        ? "desc"
                        : prevConfig.direction === "desc"
                            ? null
                            : "asc"
                    : "asc",
        }));
    };

    const handleFilter = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    function functionCreation() {
        if (createNewFn) {
            createNewFn();
        }
    }
    const exportTableData = () => {
        const csvContent = [
            columns.map(col => col.header).join(","), // Headers
            ...data.map(row => columns.map(col => row[col.key] || "").join(",")), // Rows
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${tableName || "table-data"}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    {data?.length > 0 && (
                        <>
                            {columns.filter((col) => col.filterable).map((column) => (
                                <DropdownMenu key={column.key} >
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="garden" className="border shadow-sm">
                                            <Filter className="mr-2 h-4 w-4" /> {column.header} /{" "}
                                            {filters[column.key] || "All"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                        <DropdownMenuItem
                                            onClick={() => handleFilter(column.key, "All")}
                                        >
                                            All
                                        </DropdownMenuItem>
                                        {Array.from(
                                            new Set(
                                                data
                                                    .map((item) => item[column.key])
                                                    .filter((value) => value !== undefined)
                                            )
                                        ).map((value) => (
                                            <DropdownMenuItem
                                                key={value}
                                                onClick={() => handleFilter(column.key, value)}
                                            >
                                                {value}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ))}
                        </>
                    )}
                </div>
                <div className="flex space-x-2">
                    {isSearch && (<Input
                        placeholder="Search"
                        className="w-44 border shadow text-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />)}
                    <Button variant="default" onClick={exportTableData} className="ml-2 text-white">
                        Export <ArrowDownFromLine className="ml-2 h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4 " />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                            {columns.map((column: any) => (
                                <DropdownMenuItem key={column.key}>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={visibleColumns[column.key]}
                                            onChange={() => handleColumnVisibility(column.key)}
                                            className="mr-2 h-5 w-5"  // Increase checkbox size
                                        />
                                        <span onClick={() => handleColumnVisibility(column.key)} className="select-none text-sm">{column.header}</span>
                                    </label>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* {tableName != '' && (<Button
                        variant="garden"
                        className={`border bg-teal-500 text-white`}
                        onClick={functionCreation}>
                        {tableName} <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>)} */}
                    {tableName !== '' && (
                        <div className="flex flex-col">
                            <Button
                                variant="default"
                                className="bg-teal-500 text-white hover:bg-teal-600"
                                onClick={createNewFn}
                            >
                                {tableName} <PlusCircle className="ml-2 h-4 w-4" />
                            </Button>
                            {hasEmptyDependencies && openWarningTost &&
                                <WarningToast
                                    message={warningMessage || "Please ensure all required data is available"}
                                    onClose={closeWarningTost} // Pass the function reference here
                                />
                            }
                        </div>
                    )}
                </div>
            </div>
            {/* <Table>
                <CustomTableHeader columns={columns} visibleColumns={visibleColumns} sortConfig={sortConfig} requestSort={() => { }} isAction={isAction} />
                <TableBodyComponent data={paginatedData} columns={columns} visibleColumns={visibleColumns} actionFn={actionFn} playRow={playRow} playRowFn={playRowFn} isAction={isAction} />

            </Table> */}
            {data && data.length > 0 ? (
                <Table>
                    <CustomTableHeader columns={columns} visibleColumns={visibleColumns} sortConfig={sortConfig} requestSort={() => { }} isAction={isAction} />
                    <TableBodyComponent data={paginatedData} columns={columns} visibleColumns={visibleColumns} actionFn={actionFn} playRow={playRow} playRowFn={playRowFn} isAction={isAction} />

                </Table>
            ) : (
                <div className="flex mt-28 justify-center h-screen">
                    <img src="/src/common/image.svg" className="h-96" alt="No Data" />
                </div>
            )}
            {data?.length > 10 && (<div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                    <Button
                        className="bg-gray-900 text-white hover:bg-gray-800"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        className="bg-gray-900 text-white hover:bg-gray-800"
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value: any) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select items per page" />
                    </SelectTrigger>
                    <SelectContent>
                        {itemsPerPageOptions.map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                                {num} per page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>)}
        </div>
    );
}