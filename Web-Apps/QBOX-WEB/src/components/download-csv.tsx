import * as XLSX from 'xlsx';
import { Button } from 'antd';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface DownloadButtonProps {
  data: any[];
  fileName: string;
  buttonText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  exportType?: 'excel' | 'csv';
  columns?: {
    key: string;
    title: string;
    format?: (value: any) => string;
  }[];
}

export const DownloadButton = ({
  data,
  fileName,
  buttonText = 'Export',
  disabled = false,
  isLoading = false,
  exportType = 'excel',
  columns,
}: DownloadButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warning('No data to export');
      return;
    }

    setIsExporting(true);

    try {
      // Prepare data for export
      let exportData;

      if (columns) {
        // Use custom columns configuration if provided
        exportData = data.map(item => {
          const row: Record<string, any> = {};
          columns.forEach(col => {
            row[col.title] = col.format
              ? col.format(item[col.key])
              : item[col.key];
          });
          return row;
        });
      } else {
        // Default to exporting all data fields
        exportData = data;
      }

      if (exportType === 'excel') {
        exportToExcel(exportData, fileName);
      } else {
        exportToCSV(exportData, fileName);
      }
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToCSV = (data: any[], fileName: string) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(fieldName =>
          JSON.stringify(row[fieldName], (_, value) =>
            value === null ? '' : value
          )
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isLoading || isExporting || !data?.length}
      icon={isExporting ? <Loader2 className="animate-spin" /> : <Download size={16} />}
      type="primary"
      className=" bg-color py-5"
    >
      {isExporting ? 'Exporting...' : buttonText}
    </Button>
  );
};