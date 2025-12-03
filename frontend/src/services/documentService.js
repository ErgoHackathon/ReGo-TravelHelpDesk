/**
 * Document Service
 * Handles all document-related API calls
 * Matches ReGo_Backend_API_and_DB_Spec_v1.md
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';

/**
 * Upload documents for a travel request
 * @param {number} requestId - Request ID
 * @param {File|Array<File>} files - File(s) to upload
 * @returns {Promise<object>} - { documentId, fileUrl }
 */
export const uploadDocuments = async (requestId, files) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for uploadDocuments');
        return {
            documentId: Math.floor(Math.random() * 1000) + 50,
            fileUrl: `https://rego-docs/${requestId}/document.pdf`
        };
    }

    console.log('🟢 Using REAL API for uploadDocuments');

    const formData = new FormData();
    formData.append('requestId', requestId);

    // Handle single file or array of files
    if (Array.isArray(files)) {
        files.forEach(file => formData.append('file', file));
    } else {
        formData.append('file', files);
    }

    const response = await apiClient.post(ENDPOINTS.DOCUMENTS_UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
};

/**
 * Get documents by request ID
 * @param {number} requestId - Request ID
 * @returns {Promise<Array>} - Array of document objects
 */
export const getDocumentsByRequest = async (requestId) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for getDocumentsByRequest');
        return [
            {
                documentId: 55,
                requestId: requestId,
                fileName: 'passport.pdf',
                fileUrl: `https://rego-docs/${requestId}/passport.pdf`,
                uploadedAt: '2025-12-01T10:00:00Z'
            }
        ];
    }

    console.log('🟢 Using REAL API for getDocumentsByRequest');
    const response = await apiClient.get(`${ENDPOINTS.DOCUMENTS_BY_REQUEST}/${requestId}`);
    return response.data;
};

const documentService = {
    uploadDocuments,
    getDocumentsByRequest
};

export default documentService;
