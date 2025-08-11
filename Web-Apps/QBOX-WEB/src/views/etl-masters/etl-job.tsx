import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Search, Server } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createArea, deleteArea, editArea, getAllArea } from '@state/areaSlice';
import { AppDispatch, RootState } from '@state/store';
import { Column, Table } from '@components/Table';
import { getAllEtljob } from '@state/etlJobSlice';
import NoDataFound from '@components/no-data-found';

interface EtlJobData {
    activeFlag: any;
    etlJobSno: number;
    orderEtlHdrSno: number;
    fileName: string;
    fileLoadTimeStamp: string;
    etlStartTimeStamp: string;
    etlEndTimeStamp: string;
    status: boolean;
    errorMessage: string;
    recordCount: number;
    processedBy: string;
    lastUpdated: string
}

interface EtlJobFormData {
    etlJobSno: number | null;
    orderEtlHdrSno: number | null;
    fileName: string;
    fileLoadTimeStamp: string;
    etlStartTimeStamp: string;
    etlEndTimeStamp: string;
    status: boolean;
    errorMessage: string;
    recordCount: number | null;
    processedBy: string;
    lastUpdated: string
}


interface EtlJobProps {
    isHovered: any;
}
const EtlJob: React.FC<EtlJobProps> = ({ isHovered }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEtlJob, setSelectedEtlJob] = useState<EtlJobData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        trigger,
        clearErrors,
        formState: { errors },
    } = useForm<EtlJobFormData>({
        defaultValues: {
            etlJobSno: null,
            orderEtlHdrSno: null,
            fileName: '',
            fileLoadTimeStamp: '',
            etlStartTimeStamp: '',
            etlEndTimeStamp: '',
            status: true,
            errorMessage: '',
            recordCount: null,
            processedBy: '',
            lastUpdated: ''
        },
        mode: 'onChange',
    });

    const { etlJobList } = useSelector((state: RootState) => state.etlSlice);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllEtljob({}));
    }, [dispatch]);


    const columns: Column<EtlJobData>[] = [
        {
            key: 'sno',
            header: 'Sno',
            sortable: true,
        },
        {
            key: 'fileName',
            header: 'File Name',
            sortable: true,
        },
        {
            key: 'processedBy',
            header: 'Processed By',
        },
        {
            key: 'status',
            header: 'Status',
        }
    ];

    const handleOpenModal = (editing = false, etlJob: EtlJobData | null = null) => {
        if (editing && etlJob) {
            reset({
                etlJobSno: etlJob.etlJobSno,
                orderEtlHdrSno: etlJob.orderEtlHdrSno,
                fileName: etlJob.fileName,
                fileLoadTimeStamp: etlJob.fileLoadTimeStamp.toString(),
                etlStartTimeStamp: etlJob.etlStartTimeStamp,
                etlEndTimeStamp: etlJob.etlEndTimeStamp,
                errorMessage: etlJob.errorMessage,
                recordCount: etlJob.recordCount,
                processedBy: etlJob.processedBy,
                lastUpdated: etlJob.lastUpdated,
                status: etlJob.status
            });
            setSelectedEtlJob(etlJob);
        } else {
            reset({
                etlJobSno: null,
                orderEtlHdrSno: null,
                fileName: '',
                fileLoadTimeStamp: '',
                etlStartTimeStamp: '',
                etlEndTimeStamp: '',
                status: true,
                errorMessage: '',
                recordCount: null,
                processedBy: '',
                lastUpdated: ''
            });
            setSelectedEtlJob(null);
        }
        setIsEditing(editing);
        setIsModalOpen(true);
    };
    const handleFieldChange = (
        field: { onChange: (value: any) => void },
        fieldName: keyof EtlJobFormData
    ) => (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);
    };
    const onSubmit = async (data: EtlJobFormData) => {
        try {
            if (isEditing) {
                await dispatch(editArea({
                    ...data,
                }));
            } else {
                const { etlJobSno, ...newEtlJobData } = data;
                await dispatch(createArea({
                    ...newEtlJobData,

                }));
            }
            dispatch(getAllArea({}));
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDeleteModalClose = () => {
        setSelectedEtlJob(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (etlJob: EtlJobData) => {
        if (etlJob) {
            await dispatch(deleteArea({ etlJobSno: etlJob.etlJobSno }));
            dispatch(getAllArea({}));
            handleDeleteModalClose();
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredEtlJob = etlJobList?.filter((etlJob) =>
        etlJob.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedEtlJob = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEtlJob?.slice(startIndex, endIndex);
    }, [filteredEtlJob, currentPage, itemsPerPage]);


    const totalItems = filteredEtlJob.length;

    return (

        <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl text-color flex items-center gap-1.5">
                            <Server className="w-6 h-6 text-color" /> {/* Lucide icon */}
                            Etl Job
                        </h1>
                        <p className="text-gray-600 mt-2">Manage your Etl Job</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search delivery zones..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-red-100 focus:border-color"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    {filteredEtlJob.length > 0 ? (
                        <Table
                            columns={columns}
                            data={filteredEtlJob.map((etlJob, index) => ({
                                sno: index + 1,
                                fileName: etlJob.fileName,
                                processedBy: etlJob.processedBy,
                                status: etlJob.status,
                            }))}
                            rowsPerPage={10}
                            initialSortKey="sno"
                            onRowClick={(etlJob) => console.log('Row clicked:', etlJob)}
                            globalSearch={false}
                        />
                    ) : (
                        <NoDataFound
                            icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
                            message1="No Data Found"
                            message2="No matching Etl Jobs found."
                        />
                    )}
                </div>
            </div>
        </div>

    );

}
export default EtlJob;