import CommonHeader from "@components/common-header";
import NoDataFound from "@components/no-data-found";
import { Table } from "@components/Table";
import { getAllBoxCellInventory, editBoxCellInventory } from "@state/infrastructureSlice";
import { AppDispatch, RootState } from "@state/store";
import { AlertCircle, Cable, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

interface BoxcellData {
    value: string;
    boxCellSno: number;
    qboxEntitySno: number;
    entityInfraSno: number;
    rowNo: number;
    columnNo: number;
    description: string;
    boxCellStatusCd: string;
    openHex: string;
    closeHex: string;
}

interface BoxCellProps {
    isHovered: any;
}

const BoxCell = ({ isHovered }) => {
    const { boxCellList } = useSelector((state: RootState) => state.infra);
    const dispatch = useDispatch<AppDispatch>();
    const [editedData, setEditedData] = useState({});
    const location = useLocation();
    const qboxEntitySno = location.state?.qboxEntitySno || new URLSearchParams(location.search).get("qboxEntitySno");
    const [searchBoxCell, setSearchBoxCell] = React.useState('');

    useEffect(() => {
        dispatch(getAllBoxCellInventory({ qboxEntitySno }));
    }, [dispatch]);

    const handleOpenHexChange = (value, boxCellSno) => {
        setEditedData(prev => ({
            ...prev,
            [boxCellSno]: {
                ...prev[boxCellSno],
                openHex: value
            }
        }));
    };

    const handleCloseHexChange = (value, boxCellSno) => {
        setEditedData(prev => ({
            ...prev,
            [boxCellSno]: {
                ...prev[boxCellSno],
                closeHex: value
            }
        }));
    };

    const handleSave = async (boxCellSno) => {
        if (editedData[boxCellSno]) {
            try {
                const rowToUpdate = {
                    ...boxCellList.find(item => item.boxCellSno === boxCellSno),
                    ...editedData[boxCellSno]
                };
                await dispatch(editBoxCellInventory(rowToUpdate));
                await dispatch(getAllBoxCellInventory({ qboxEntitySno }));
                setEditedData(prev => {
                    const newData = { ...prev };
                    delete newData[boxCellSno];
                    return newData;
                });
            } catch (error) {
                console.error("Error saving data", error);
            }
        }
    };
    const handleopenhexedit = () => {
        // console.log(getAllBoxCellInventory)
    }

    const handleclosehexedit = () => {
    }
    const columns = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'boxCellSno',
            header: 'Boxcell No',
        },
        {
            key: 'description',
            header: 'Description',
        },
        {
            key: 'boxCellStatusName',
            header: 'Status',
        },
        {
            key: 'penHex',
            header: 'OpenHex',
            render: (row) => (
                <div className="flex items-center">
                    <input
                        type="text"
                        value={editedData[row.boxCellSno]?.openHex ?? row.openHex ?? ''}
                        className="w-96 border rounded px-2 py-1"
                        onChange={(e) => handleOpenHexChange(e.target.value, row.boxCellSno)}
                    />

                </div>
            ),
        },
        {
            key: 'closeHex',
            header: 'CloseHex',
            render: (row) => (
                <div className="flex items-center">
                    <input
                        type="text"
                        value={editedData[row.boxCellSno]?.closeHex ?? row.closeHex ?? ''}
                        className="w-96 border rounded px-2 py-1"
                        onChange={(e) => handleCloseHexChange(e.target.value, row.boxCellSno)}
                    />
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
                <button
                    onClick={() => handleSave(row.boxCellSno)}
                    className="bg-color text-white rounded-lg px-3 py-1"
                    disabled={!editedData[row.boxCellSno]}
                >
                    Save
                </button>
            ),
        },
    ];

    const filteredBoxCell = boxCellList?.filter((infra: BoxcellData) =>
        infra?.boxCellSno?.toString().toLowerCase().includes(searchBoxCell.toLowerCase()) ||
        infra?.description?.toLowerCase().includes(searchBoxCell.toLowerCase())
    );



    return (
        <div>
            <CommonHeader
                title='Boxcell Details'
                description="Manage your food Boxcell Details"
                HeaderIcon={Cable}
                searchQuery={searchBoxCell}
                setSearchQuery={setSearchBoxCell}
                placeholder='Search Box Cell...'
            />

            <div className="overflow-x-auto mt-8">
                {filteredBoxCell?.length > 0 ? (
                    <Table
                        columns={columns}
                        data={filteredBoxCell?.map((row, index) => ({
                            sno: index + 1,
                            boxCellSno: row.boxCellSno,
                            description: row.description,
                            boxCellStatusName: row.boxCellStatusName,
                            openHex: row.openHex,
                            closeHex: row.closeHex
                        }))}
                        rowsPerPage={10}
                        initialSortKey="Sno"
                        // onRowClick={(row) => console.log('Row clicked:', row)}
                        globalSearch={false}
                    />
                ) : (
                    <NoDataFound
                        icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                        message1="No Data Found"
                        message2="No matching Boxcell Detail found."
                    />
                )}
            </div>
        </div>
    );
};

export default BoxCell;
