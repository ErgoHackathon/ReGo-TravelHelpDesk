/**
 * Document Service
 * Handles all document-related API calls including Visa OCR
 */
import api from './apiService';

// Document IDs
const HIDDEN_DOCUMENT_IDS = [10]; // Visa - hidden from employee
const HIDDEN_DOCUMENT_NAMES = ['visa'];
const VISA_DOCUMENT_ID = 10;

const documentService = {
  // ==========================================
  // DOCUMENT TYPES
  // ==========================================
  
  getAllDocumentTypes: async () => {
    console.log('📄 Getting all document types (employee view)');
    
    const response = await api.getAllDocumentsList();
    
    if (response.status !== 'Success' || !response.result) {
      throw new Error('Failed to fetch document types');
    }
    
    const allDocs = response.result.map(doc => ({
      id: doc.documentID,
      name: doc.documentName,
      required: doc.isRequired ?? doc.isMandatory ?? true
    }));
    
    // Filter out Visa for employee view
    const filteredDocs = allDocs.filter(doc => {
      if (HIDDEN_DOCUMENT_IDS.includes(doc.id)) return false;
      if (HIDDEN_DOCUMENT_NAMES.some(name => 
        doc.name.toLowerCase().trim() === name.toLowerCase().trim()
      )) return false;
      return true;
    });
    
    return filteredDocs;
  },

  getAllDocumentTypesForHelpDesk: async () => {
    console.log('📄 Getting all document types (HelpDesk view - includes Visa)');
    
    const response = await api.getAllDocumentsList();
    
    if (response.status !== 'Success' || !response.result) {
      throw new Error('Failed to fetch document types');
    }
    
    const allDocs = response.result.map(doc => ({
      id: doc.documentID,
      name: doc.documentName,
      required: doc.isRequired ?? doc.isMandatory ?? true,
      canUpload: doc.documentID === VISA_DOCUMENT_ID,
      isVisa: doc.documentID === VISA_DOCUMENT_ID
    }));
    
    console.log(`📄 Returning ${allDocs.length} documents for HelpDesk`);
    return allDocs;
  },

  // ==========================================
  // FILE UTILITIES
  // ==========================================

  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  validateFile: (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!file) return { valid: false, error: 'No file provided' };
    if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Only PNG, JPG, and PDF files are allowed' };
    if (file.size > maxSize) return { valid: false, error: 'File size must be less than 5MB' };
    
    return { valid: true, error: null };
  },

  // ==========================================
  // DOCUMENT CRUD
  // ==========================================

  addDocument: async (empId, documentId, file) => {
    console.log('📄 Adding document:', { empId, documentId, fileName: file.name });
    
    const validation = documentService.validateFile(file);
    if (!validation.valid) throw new Error(validation.error);
    
    const fileBase64 = await documentService.fileToBase64(file);
    console.log("fileBase64Visa:::",fileBase64);
    
    const response = await api.addDocumentWithMetadata(
      empId, documentId, fileBase64, file.type, file.name, file.size
    );
    
    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to upload document');
    }
    
    return response.result;
  },

  updateDocument: async (empId, documentId, file) => {
    return documentService.addDocument(empId, documentId, file);
  },

  uploadDocument: async (empId, documentId, file, isUpdate = false) => {
    if (isUpdate) return documentService.updateDocument(empId, documentId, file);
    return documentService.addDocument(empId, documentId, file);
  },

  getEmployeeUploadedDocuments: async (empId) => {
    console.log('📄 Getting uploaded documents for:', empId);
    
    try {
      const response = await api.getEmployeeAllDocuments(empId);
      
      if (response.status !== 'Success') return {};
      
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
      
      return documentsMap;
    } catch (error) {
      console.error('📄 Error fetching documents:', error);
      return {};
    }
  },

  getDocumentWithContent: async (empId, documentId) => {
    console.log('📄 Getting document content:', { empId, documentId });
    
    try {
      const response = await api.getDocumentFile(empId, documentId);
      
      if (response.status !== 'Success' || !response.result) return null;
      
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

  deleteDocument: async (empId, documentId) => {
    console.log('📄 Deleting document:', { empId, documentId });
    
    const response = await api.deleteDocument(empId, documentId);
    
    if (response.status !== 'Success') {
      throw new Error(response.result || 'Failed to delete document');
    }
    
    return response.result;
  },

  submitDocuments: async (tId, empId) => {
    console.log('📄 Submitting documents:', { tId, empId });
    try {
      const response = await api.updateTravelStatus(tId, 14, empId, 'Documents submitted by employee');
      
      if (response.status !== 'Success') {
        throw new Error(response.result || 'Failed to submit documents');
      }
      
      return {
        status: 'Success',
        result: {
          tId,
          previousStatus: 13,
          newStatus: 14,
          statusLabel: 'Documents Under Review',
          message: 'Documents submitted successfully'
        }
      };
    } catch (error) {
      console.error('📄 Error submitting documents:', error);
      throw error;
    }
  },

  // ==========================================
  // PASSPORT OCR (Employee Dashboard)
  // ==========================================

  getPassportOCRInfo: async (empId) => {
    console.log('🛂 Getting passport OCR info for:', empId);
    try {
      const response = await api.getPassportInfo(empId);
      return response;
    } catch (error) {
      console.error('❌ Error fetching passport OCR info:', error);
      throw error;
    }
  },

  updatePassportOCRInfo: async (empId, passportData) => {
    console.log('🛂 Updating passport OCR info for:', empId);
    
    try {
      const apiData = {
        issuer: passportData.issuer || passportData.Issuer || '',
        fullName: passportData.fullName || passportData.FullName || '',
        passportNumber: passportData.passportNumber || passportData.PassportNumber || '',
        nationality: passportData.nationality || passportData.Nationality || '',
        dateOfBirth: passportData.dateOfBirth || passportData.DateOfBirth || '',
        sex: passportData.sex || passportData.Sex || '',
        expiryDate: passportData.expiryDate || passportData.ExpiryDate || '',
        compositeCheck: passportData.compositeCheck ?? passportData.CompositeCheck ?? true
      };
      
      const response = await api.updatePassportInfo(empId, apiData);
      return response;
    } catch (error) {
      console.error('❌ Error updating passport OCR info:', error);
      throw error;
    }
  },

  // ==========================================
  // VISA OCR (TravelDesk Only)
  // ==========================================

  getVisaOCRInfo: async (empId) => {
    console.log('🎫 Getting visa OCR info for:', empId);
    try {
      const response = await api.getVisaInfo(empId);
      
      if (response?.fallbackRequired || response?.status === 'NotFound') {
        console.log('🎫 Visa OCR data not available yet');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching visa OCR info:', error);
      return null;
    }
  },

  updateVisaOCRInfo: async (empId, visaData) => {
    console.log('🎫 Updating visa OCR info for:', empId);
    
    try {
      const apiData = {
        issuer: visaData.issuer || visaData.Issuer || '',
        fullName: visaData.fullName || visaData.FullName || '',
        visaNumber: visaData.visaNumber || visaData.VisaNumber || '',
        nationality: visaData.nationality || visaData.Nationality || '',
        dateOfBirth: visaData.dateOfBirth || visaData.DateOfBirth || '',
        sex: visaData.sex || visaData.Sex || '',
        expiryDate: visaData.expiryDate || visaData.ExpiryDate || '',
        compositeCheck: visaData.compositeCheck ?? visaData.CompositeCheck ?? true
      };
      
      const response = await api.updateVisaInfo(empId, apiData);
      return response;
    } catch (error) {
      console.error('❌ Error updating visa OCR info:', error);
      throw error;
    }
  },

  // ==========================================
  // HELPDESK / TRAVEL DESK METHODS
  // ==========================================

  _needsFallback: (response) => {
    return response?.fallbackRequired === true || response?.status === 'NotFound';
  },

  getHelpDeskEmployeeDocuments: async (empId) => {
    console.log('📄 [HelpDesk] Getting documents for:', empId);
    
    try {
      let response = await api.getEmployeeAllDocuments(empId);
      
      if (documentService._needsFallback(response)) {
        console.log('📄 [HelpDesk] Using employee endpoint as fallback');
        response = await api.getEmployeeAllDocuments(empId);
      }
      
      if (response.status !== 'Success') return {};
      
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

  getHelpDeskDocumentWithContent: async (empId, documentId) => {
    console.log('📄 [HelpDesk] Getting document content:', { empId, documentId });
    
    try {
      let response = await api.getHelpDeskDocumentFile(empId, documentId);
      
      if (documentService._needsFallback(response)) {
        console.log('📄 [HelpDesk] Using employee endpoint as fallback');
        response = await api.getDocumentFile(empId, documentId);
      }
      
      if (response.status !== 'Success' || !response.result) return null;
      
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
  },

  helpDeskUploadVisa: async (empId, file) => {
    console.log('📄 [HelpDesk] Uploading visa for:', empId);
    return documentService.addDocument(empId, VISA_DOCUMENT_ID, file);
  }
};

export default documentService;