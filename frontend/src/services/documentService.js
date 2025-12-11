/**
 * Document Service
 * Handles all document-related API calls
 */

import api from './apiService';

const documentService = {
  /**
   * Get all document types
   * API: GET /api/GetAllDocumentsList
   */
 /**
 * Get all document types
 * API: GET /api/GetAllDocumentsList
 */
getAllDocumentTypes: async () => {
  console.log('📄 Getting all document types');

  const response = await api.getAllDocumentsList();

  if (response.status !== 'Success' || !response.result) {
    throw new Error('Failed to fetch document types');
  }

  // Transform to frontend format
  // Check for isRequired, isMandatory, or required field from backend
  return response.result.map(doc => ({
    id: doc.documentID,
    name: doc.documentName,
    // Check multiple possible field names from backend
    required: doc.isRequired ?? doc.isMandatory ?? doc.required ?? doc.IsRequired ?? true
  }));
},

  /**
   * Convert file to Base64 string
   * @param {File} file - File object
   * @returns {Promise<string>} - Base64 encoded string
   */
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * Validate file type and size
   * @param {File} file - File object
   * @returns {object} - { valid: boolean, error: string | null }
   */
  validateFile: (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PNG, JPG, and PDF files are allowed' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    return { valid: true, error: null };
  },

  /**
   * Add document for employee WITH metadata
   * API: POST /api/employee/AddDocumentWithMetadata
   */
  addDocument: async (empId, documentId, file) => {
    console.log('📄 Adding document:', { empId, documentId, fileName: file.name });

    // Validate file using the method reference
    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const fileBase64 = await documentService.fileToBase64(file);
    console.log('📄 File converted to Base64, length:', fileBase64.length);

    const response = await api.addDocumentWithMetadata(
      empId,
      documentId,
      fileBase64,
      file.type,
      file.name,
      file.size
    );

    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to upload document');
    }

    return response.result;
  },

  /**
   * Update document for employee
   */
  updateDocument: async (empId, documentId, file) => {
    console.log('📄 Updating document:', { empId, documentId, fileName: file.name });
    return documentService.addDocument(empId, documentId, file);
  },

  /**
   * Upload or update document (auto-detect)
   */
  uploadDocument: async (empId, documentId, file, isUpdate = false) => {
    if (isUpdate) {
      return documentService.updateDocument(empId, documentId, file);
    }
    return documentService.addDocument(empId, documentId, file);
  },

  /**
   * Get all uploaded documents for an employee
   */
  getEmployeeUploadedDocuments: async (empId) => {
    console.log('📄 Getting all uploaded documents for:', empId);

    try {
      const response = await api.getEmployeeAllDocuments(empId);

      if (response.status !== 'Success') {
        console.log('📄 No documents found or API error');
        return {};
      }

      const documentsMap = {};
      if (response.result && Array.isArray(response.result)) {
        response.result.forEach(doc => {
          documentsMap[doc.documentID] = {
            empDocId: doc.empDocId,
            fileName: doc.fileName || `Document_${doc.documentID}`,
            fileType: doc.fileType || 'application/octet-stream',
            fileSize: doc.fileSize || 0,
            uploadedAt: doc.createdOn,
            updatedAt: doc.updatedOn
          };
        });
      }

      console.log('📄 Uploaded documents map:', documentsMap);
      return documentsMap;
    } catch (error) {
      console.error('📄 Error fetching uploaded documents:', error);
      return {};
    }
  },

  /**
   * Get document with base64 content (for preview)
   */
  getDocumentWithContent: async (empId, documentId) => {
    console.log('📄 Getting document with content:', { empId, documentId });

    try {
      const response = await api.getDocumentFile(empId, documentId);

      if (response.status !== 'Success' || !response.result) {
        console.log('📄 Document not found');
        return null;
      }

      return {
        empDocId: response.result.empDocId,
        fileName: response.result.fileName || `Document_${documentId}`,
        fileType: response.result.fileType || 'application/octet-stream',
        fileSize: response.result.fileSize || 0,
        base64String: response.result.base64String,
        createdOn: response.result.createdOn
      };
    } catch (error) {
      console.error('📄 Error fetching document content:', error);
      throw error;
    }
  },

  /**
   * Delete document
   */
  deleteDocument: async (empId, documentId) => {
    console.log('📄 Deleting document:', { empId, documentId });

    const response = await api.deleteDocument(empId, documentId);

    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to delete document');
    }

    return response.result;
  },

  /**
   * Submit all documents for a travel request
   * Changes status from 13 → 14
   */
  submitDocuments: async (tId, empId) => {
    console.log('📄 Submitting documents:', { tId, empId });

    try {
      const NEW_STATUS = 14;
      
      // Try dedicated endpoint first
      if (api.submitDocuments) {
        const response = await api.submitDocuments(tId, empId);
        
        if (response.status === 'Success') {
          return {
            status: 'Success',
            result: {
              tId: tId,
              previousStatus: 13,
              newStatus: NEW_STATUS,
              statusLabel: 'Documents Under Review',
              message: 'Documents submitted successfully'
            }
          };
        }
      }

      // Fallback: Update status directly
      const response = await api.updateTravelStatus(tId, NEW_STATUS);
      
      if (response.status !== 'Success') {
        throw new Error(response.result || 'Failed to submit documents');
      }

      return {
        status: 'Success',
        result: {
          tId: tId,
          previousStatus: 13,
          newStatus: NEW_STATUS,
          statusLabel: 'Documents Under Review',
          message: 'Documents submitted successfully'
        }
      };
    } catch (error) {
      console.error('📄 Error submitting documents:', error);
      throw error;
    }
  },

  /**
   * Check if all required documents are uploaded
   */
  checkRequiredDocuments: (documentTypes, uploadedDocuments) => {
    const requiredDocs = documentTypes.filter(d => d.required !== false);
    const uploadedIds = Object.keys(uploadedDocuments).map(id => parseInt(id, 10));
    
    const missing = requiredDocs.filter(doc => !uploadedIds.includes(doc.id));
    const uploaded = requiredDocs.filter(doc => uploadedIds.includes(doc.id));

    return {
      allUploaded: missing.length === 0,
      missing,
      uploaded,
      stats: {
        required: requiredDocs.length,
        uploaded: uploaded.length,
        missing: missing.length,
        percentage: requiredDocs.length > 0 
          ? Math.round((uploaded.length / requiredDocs.length) * 100) 
          : 100
      }
    };
  },

  /**
   * Get all uploaded documents for an employee (HelpDesk view)
   */
  getHelpDeskEmployeeDocuments: async (empId) => {
    console.log('📄 [HelpDesk] Getting all uploaded documents for:', empId);

    try {
      const response = await api.getHelpDeskEmployeeDocuments(empId);

      if (response.status !== 'Success') {
        return {};
      }

      const documentsMap = {};
      if (response.result && Array.isArray(response.result)) {
        response.result.forEach(doc => {
          documentsMap[doc.documentID] = {
            empDocId: doc.empDocId,
            fileName: doc.fileName || `Document_${doc.documentID}`,
            fileType: doc.fileType || 'application/octet-stream',
            fileSize: doc.fileSize || 0,
            uploadedAt: doc.createdOn
          };
        });
      }

      return documentsMap;
    } catch (error) {
      console.error('📄 [HelpDesk] Error fetching documents:', error);
      return {};
    }
  },

  /**
   * Get document with base64 content (for HelpDesk preview/download)
   */
  getHelpDeskDocumentWithContent: async (empId, documentId) => {
    console.log('📄 [HelpDesk] Getting document with content:', { empId, documentId });

    try {
      const response = await api.getHelpDeskDocumentFile(empId, documentId);

      if (response.status !== 'Success' || !response.result) {
        return null;
      }

      return {
        empDocId: response.result.empDocId,
        fileName: response.result.fileName || `Document_${documentId}`,
        fileType: response.result.fileType || 'application/octet-stream',
        fileSize: response.result.fileSize || 0,
        base64String: response.result.base64String,
        createdOn: response.result.createdOn
      };
    } catch (error) {
      console.error('📄 [HelpDesk] Error fetching document content:', error);
      throw error;
    }
  }
};

export default documentService;