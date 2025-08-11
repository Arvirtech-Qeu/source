import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  TableColumnsSplit,
  AlertCircle,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "@components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@state/store";
import Select from "@components/Select";
import { AnimatedModal } from "@components/AnimatedModel";
import Input from "@components/Input";
import { CommonHeader } from "@components/common-header";
import { Column, Table } from "@components/Table";
import { createEtltablecolumn, deleteEtltablecolumn, editEtltablecolumn, getAllEtltablecolumn } from "@state/etlTableColumnSlice";
import { getAllEtlHdr } from "@state/etlHdrSlice";
import NoDataFound from "@components/no-data-found";

interface EtlTableData {
  etlTableColumnSno: number;
  orderEtlHdrSno: number;
  sourceColumn: string;
  stagingColumn: string;
  dataType: string;
  isRequired: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface EtlTableColumnFormData {
  etlTableColumnSno: number | null;
  orderEtlHdrSno: number | null;
  sourceColumn: string;
  stagingColumn: string;
  dataType: string;
  isRequired: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CountryData {
  countrySno: number;
  name: string;
}

interface StateData {
  stateSno: number;
  countrySno: number;
  name: string;
}

interface CityData {
  citySno: number;
  stateSno: number;
  name: string;
}

interface EtlTableColumnProps {
  isHovered: any;
}
const EtlTableColumn: React.FC<EtlTableColumnProps> = ({ isHovered }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEtlTableColumn, setSelectedEtlTableColumn] =
    React.useState<EtlTableData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isValid, touchedFields },
  } = useForm<EtlTableColumnFormData>({
    defaultValues: {
      etlTableColumnSno: null,
      orderEtlHdrSno: null,
      sourceColumn: "",
      stagingColumn: "",
      dataType: "",
      isRequired: true,
      description: "",
      createdAt: "",
      updatedAt: "",
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { etltablecolumnList } = useSelector((state: RootState) => state.etlTableColumnSlice);
  const { etlHdrList } = useSelector((state: RootState) => state.etlHdrSlice);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllEtltablecolumn({}));
    dispatch(getAllEtlHdr({}));
  }, [dispatch]);

  const columns: Column<EtlTableData>[] = [
    {
      key: 'sno',
      header: 'Sno',
      sortable: true,
    },
    {
      key: 'sourceColumn',
      header: 'Source Column',
      sortable: true,
    },
    {
      key: 'stagingColumn',
      header: 'Staging Column',
      sortable: true,
    },
    {
      key: 'dataType',
      header: 'DataType',
      sortable: true,
    },
    {
      key: 'stagingColumn',
      header: 'Source Column',
      sortable: true,
    },
    {
      key: 'isRequired',
      header: 'Is Required',
      render: (value: EtlTableData) => (
        <span
          className={`px-2 py-1 text-sm font-medium rounded ${value.isRequired ? "text-green-500 bg-green-100" : "text-color low-bg-color"
            }`}
        >
          {value.isRequired ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: EtlTableData) => (
        <div className="flex space-x-8">
          <button onClick={() => handleOpenModal(true, value)}>
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>

          <button onClick={() => handleDeleteModalOpen(value)}>
            <Trash2 className="w-4 h-4 text-color" />
          </button>

        </div>
      ),
    }
  ];
  const handleOpenModal = (editing = false, etlTable: EtlTableData | null = null) => {
    if (editing && etlTable) {
      reset({
        etlTableColumnSno: etlTable.etlTableColumnSno,
        orderEtlHdrSno: etlTable.orderEtlHdrSno,
        sourceColumn: etlTable.sourceColumn,
        stagingColumn: etlTable.stagingColumn,
        dataType: etlTable.dataType,
        isRequired: etlTable.isRequired,
        description: etlTable.description,
        createdAt: etlTable.createdAt,
        updatedAt: etlTable.updatedAt,
      });
      setSelectedEtlTableColumn(etlTable);
    } else {
      reset({
        etlTableColumnSno: null,
        orderEtlHdrSno: null,
        sourceColumn: "",
        stagingColumn: "",
        dataType: "",
        isRequired: true,
        description: "",
        createdAt: "",
        updatedAt: "",
      });
      setSelectedEtlTableColumn(null);
    }
    setIsEditing(editing);
    setIsModalOpen(true);
  };


  const handleFieldChange =
    (
      field: { onChange: (value: any) => void },
      fieldName: keyof EtlTableData
    ) =>
      (value: any) => {
        field.onChange(value);
        clearErrors(fieldName);
      };
  const onSubmit = async (data: EtlTableColumnFormData) => {
    try {
      if (isEditing) {
        await dispatch(
          editEtltablecolumn({
            ...data,
          })
        );
      } else {
        const { etlTableColumnSno, ...newEtlTableColumnData } = data;
        await dispatch(
          createEtltablecolumn({
            ...newEtlTableColumnData,
          })
        );
      }
      dispatch(getAllEtltablecolumn({}));
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  console.log(etltablecolumnList);


  const handleDeleteModalOpen = (etlTable: EtlTableData) => {
    setSelectedEtlTableColumn(etlTable);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setSelectedEtlTableColumn(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async (etlTable: EtlTableData) => {
    if (etlTable) {
      await dispatch(
        deleteEtltablecolumn({ etlTableColumnSno: etlTable.etlTableColumnSno })
      );
      dispatch(getAllEtltablecolumn({}));
      handleDeleteModalClose();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredEtlTableColumn = etltablecolumnList?.filter((area) =>
    area.sourceColumn.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const validationRules = {
    orderEtlHdrSno: {
      required: 'Order EtlHdr Sno is required',
      validate: {
        checkOnBlur: (value: number | null) => {
          if (!value && touchedFields.orderEtlHdrSno) return 'Order EtlHdr Sno is required';
          return true;
        }
      }
    }

  };

  return (
    <div className={`${isHovered ? 'pl-32 pr-14 p-12' : 'pl-16 pr-14 p-12'}`}>
      <CommonHeader
        title="Etl Table Column"
        description="Manage your Etl Table Column"
        onAdd={() => handleOpenModal(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        buttonName="Add Etl Table Column"
        placeholder="Search Etl Table Column..."
        HeaderIcon={TableColumnsSplit}
        AddIcon={Plus}
      />

      <div className="overflow-x-auto  mt-8">
        {filteredEtlTableColumn.length > 0 ? (
          <Table
            columns={columns}
            data={filteredEtlTableColumn.map((etlTable, index) => ({
              sno: index + 1,
              etlTableColumnSno: etlTable.etlTableColumnSno,
              orderEtlHdrSno: etlTable.orderEtlHdrSno,
              sourceColumn: etlTable.sourceColumn,
              stagingColumn: etlTable.stagingColumn,
              dataType: etlTable.dataType,
              isRequired: etlTable.isRequired,
              description: etlTable.description
            }))}
            rowsPerPage={10}
            initialSortKey="Sno"
            onRowClick={(etlTable) => console.log('Order clicked:', etlTable)}
            globalSearch={false}
          />

        ) : (
          <NoDataFound
            icon={<AlertCircle className="mx-auto mb-6 text-color" size={64} />}
            message1="No Data Found"
            message2="No matching Etl Table Column found."
          />
        )}
      </div>

      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title={
          <div>
            <h2 className="text-gray-800 flex items-center gap-2">
              {isEditing ? "Edit Etl Table Column" : "Add Etl Table Column"}
            </h2>
          </div>
        }
        type="default"
        size="xl"
        footer={
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              form="etlTableColumnForm"
              // disabled={!isValid}
              className="bg-color hover:bg-color text-white px-4 py-2 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {isEditing ? "Edit" : "Create"}
            </button>
          </div>
        }
      >
        <form
          id="etlTableColumnForm"
          onSubmit={handleSubmit(onSubmit)}
          className="p-2 space-y-4"
        >
          <div className="space-y-2">
            <Controller
              name="orderEtlHdrSno"
              control={control}
              rules={validationRules.orderEtlHdrSno}
              render={({ field }) => (
                <Select
                  label="Order EtlHdr Sno"
                  {...field}
                  required
                  error={errors.orderEtlHdrSno?.message}
                  onChange={(value) => handleFieldChange(field, 'orderEtlHdrSno')(Number(value))}
                  options={[
                    { label: "Select a Order EtlHdr Sno", value: null }, // Placeholder option
                    ...etlHdrList?.map((delivery) => ({
                      label: delivery.stagingTableName,
                      value: delivery.orderEtlHdrSno, // Use number type directly
                    })),
                  ]}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="sourceColumn"
              control={control}
              // rules={{ required: 'Source Column is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Source Column"
                  label="Source Column"
                  error={errors.sourceColumn?.message}
                />
              )}
            />
          </div>


          <div className="space-y-2 ">
            <Controller
              name="stagingColumn"
              control={control}
              // rules={{ required: 'Staging Column is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Staging Column"
                  label="Staging Column"
                  error={errors.stagingColumn?.message}
                />
              )}
            />
          </div>
          <div className="space-y-2 ">
            <Controller
              name="dataType"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Data Type"
                  label="Data Type"
                  error={errors.dataType?.message}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="isRequired"
              control={control}
              render={({ field }) => (
                <Select
                  label="Is Required"
                  {...field}
                  onChange={(value) =>
                    handleFieldChange(field, "isRequired")(value)
                  }
                  options={[
                    { label: "Yes", value: true.toString() },
                    { label: "No", value: false.toString() },
                  ]}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Description"
                  label="Description"
                  error={errors.description?.message}
                />
              )}
            />
          </div>

        </form>
      </AnimatedModal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        title="Delete"
        type="info"
        size="xl"
        footer={
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={handleDeleteModalClose}
            >
              No
            </button>
            <button
              className="px-4 py-2 bg-color text-white rounded-md"
              onClick={() => handleDelete(selectedEtlTableColumn!)}
            >
              Yes
            </button>
          </div>
        }
      >
        <p>Are you sure you want to delete this Etl Table Column?</p>
      </Modal>
    </div>
  );
}

export default EtlTableColumn;