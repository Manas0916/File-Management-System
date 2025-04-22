import axios from 'axios';
import qs from 'qs';
import { File as FileType, Filters } from '../types/file';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const fileService = {
  async uploadFile(file: File): Promise<FileType> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/files/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getFiles(filters: Partial<Filters> = {}): Promise<FileType[]> {
    const queryParams = qs.stringify(
      {
        file_type: filters.fileType,
        start_date: filters.dateRange?.startDate,
        end_date: filters.dateRange?.endDate,
        file_size: filters.fileSize,
        file_name: filters.fileName,
      },{ skipNulls: true, encodeValuesOnly: true, strictNullHandling: true }
    );
    const response = await axios.get(`${API_URL}/files/?${queryParams}`);
    return response.data;
  },

  async deleteFile(id: string): Promise<void> {
    await axios.delete(`${API_URL}/files/${id}/`);
  },

  async downloadFile(fileUrl: string, filename: string): Promise<void> {
    try {
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download file');
    }
  },
}; 