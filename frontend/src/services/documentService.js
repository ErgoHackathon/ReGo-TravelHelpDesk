/**
 * Document Service
 * Handles all document-related API calls including Visa OCR
 * UPDATED: Uses only employee endpoints for document operations
 * UPDATED: Added Visa Form (ID 8) to Status 14 uploads
 */
import api from './apiService';

// ==========================================
// DOCUMENT ID CONSTANTS
// ==========================================
const PASSPORT_DOCUMENT_ID = 1;
const INVITATION_LETTER_DOCUMENT_ID = 2;
const COVER_LETTER_DOCUMENT_ID = 3;
const KT_PLAN_DOCUMENT_ID = 4;
const HOTEL_BOOKING_DOCUMENT_ID = 5;
const FLIGHT_BOOKING_DOCUMENT_ID = 6;
const TRAVEL_INSURANCE_DOCUMENT_ID = 7;
const VISA_FORM_DOCUMENT_ID = 8;
const LETTER_OF_INTENT_DOCUMENT_ID = 9;
const VISA_DOCUMENT_ID = 10;
const INSURANCE_DECLARATION_DOCUMENT_ID = 11;
const VISA_APPOINTMENT_DOCUMENT_ID = 12;

// ==========================================
// DOCUMENT VISIBILITY RULES
// ==========================================

// Documents hidden from employee view (employee cannot see or upload these)
const HIDDEN_FROM_EMPLOYEE = [
  HOTEL_BOOKING_DOCUMENT_ID,      // 5 - Travel Desk uploads
  FLIGHT_BOOKING_DOCUMENT_ID,     // 6 - Travel Desk uploads
  TRAVEL_INSURANCE_DOCUMENT_ID,   // 7 - Travel Desk uploads
  VISA_FORM_DOCUMENT_ID,          // 8 - Travel Desk uploads at Status 14
  VISA_DOCUMENT_ID,               // 10 - Travel Desk uploads
  VISA_APPOINTMENT_DOCUMENT_ID,   // 12 - Travel Desk uploads
];

// Documents employee uploads (Status 13)
const EMPLOYEE_UPLOAD_DOCUMENTS = [
  PASSPORT_DOCUMENT_ID,           // 1
  INVITATION_LETTER_DOCUMENT_ID,  // 2
  COVER_LETTER_DOCUMENT_ID,       // 3
  KT_PLAN_DOCUMENT_ID,            // 4
  LETTER_OF_INTENT_DOCUMENT_ID,   // 9
  INSURANCE_DECLARATION_DOCUMENT_ID, // 11
];

// Documents Travel Desk uploads at Status 14 (Visa Review)
const STATUS_14_UPLOAD_DOCUMENTS = [
  VISA_FORM_DOCUMENT_ID,          // 8 - NEW!
  VISA_DOCUMENT_ID,               // 10
  VISA_APPOINTMENT_DOCUMENT_ID,   // 12
];

// Documents Travel Desk uploads at Status 15 (Booking)
const STATUS_15_UPLOAD_DOCUMENTS = [
  HOTEL_BOOKING_DOCUMENT_ID,      // 5
  FLIGHT_BOOKING_DOCUMENT_ID,     // 6
  TRAVEL_INSURANCE_DOCUMENT_ID,   // 7
];

// Documents visible to employee after Status 14 (read-only)
const VISIBLE_TO_EMPLOYEE_AFTER_STATUS_14 = [
  VISA_FORM_DOCUMENT_ID,          // 8
  VISA_DOCUMENT_ID,               // 10
  VISA_APPOINTMENT_DOCUMENT_ID,   // 12
];

// Documents visible to employee after Status 15 (read-only)
const VISIBLE_TO_EMPLOYEE_AFTER_STATUS_15 = [
  HOTEL_BOOKING_DOCUMENT_ID,      // 5
  FLIGHT_BOOKING_DOCUMENT_ID,     // 6
  TRAVEL_INSURANCE_DOCUMENT_ID,   // 7
];

const documentService = {
  // ==========================================
  // CONSTANTS EXPORT
  // ==========================================
  DOCUMENT_IDS: {
    PASSPORT: PASSPORT_DOCUMENT_ID,
    INVITATION_LETTER: INVITATION_LETTER_DOCUMENT_ID,
    COVER_LETTER: COVER_LETTER_DOCUMENT_ID,
    KT_PLAN: KT_PLAN_DOCUMENT_ID,
    HOTEL_BOOKING: HOTEL_BOOKING_DOCUMENT_ID,
    FLIGHT_BOOKING: FLIGHT_BOOKING_DOCUMENT_ID,
    TRAVEL_INSURANCE: TRAVEL_INSURANCE_DOCUMENT_ID,
    VISA_FORM: VISA_FORM_DOCUMENT_ID,
    LETTER_OF_INTENT: LETTER_OF_INTENT_DOCUMENT_ID,
    VISA: VISA_DOCUMENT_ID,
    INSURANCE_DECLARATION: INSURANCE_DECLARATION_DOCUMENT_ID,
    VISA_APPOINTMENT: VISA_APPOINTMENT_DOCUMENT_ID,
  },

  DOCUMENT_GROUPS: {
    EMPLOYEE_UPLOADS: EMPLOYEE_UPLOAD_DOCUMENTS,
    STATUS_14_UPLOADS: STATUS_14_UPLOAD_DOCUMENTS,
    STATUS_15_UPLOADS: STATUS_15_UPLOAD_DOCUMENTS,
    HIDDEN_FROM_EMPLOYEE: HIDDEN_FROM_EMPLOYEE,
    VISIBLE_AFTER_STATUS_14: VISIBLE_TO_EMPLOYEE_AFTER_STATUS_14,
    VISIBLE_AFTER_STATUS_15: VISIBLE_TO_EMPLOYEE_AFTER_STATUS_15,
  },

  // ==========================================
  // DOCUMENT TYPES
  // ==========================================
  
  /**
   * Get document types for Employee view
   * Filters out documents that employee should not see
   * @param {number} statusId - Current travel request status
   * @param {object} uploadedDocs - Map of uploaded document IDs
   */
  getAllDocumentTypes: async (statusId = null, uploadedDocs = {}) => {
    console.log('📄 Getting all document types (employee view)', { statusId });
    
    const response = await api.getAllDocumentsList();
    
    if (response.status !== 'Success' || !response.result) {
      throw new Error('Failed to fetch document types');
    }
    
    const allDocs = response.result.map(doc => ({
      id: doc.documentID,
      documentID: doc.documentID,
      name: doc.documentName,
      documentName: doc.documentName,
      required: doc.isRequired ?? doc.isMandatory ?? true
    }));
    
    // Filter documents based on status
    const filteredDocs = allDocs.filter(doc => {
      const docId = doc.id;
      
      // Always show employee upload documents
      if (EMPLOYEE_UPLOAD_DOCUMENTS.includes(docId)) {
        return true;
      }
      
      // Status 14+: Show visa-related docs if uploaded (read-only for employee)
      if (statusId >= 14 && VISIBLE_TO_EMPLOYEE_AFTER_STATUS_14.includes(docId)) {
        return !!uploadedDocs[docId]; // Only show if uploaded
      }
      
      // Status 15+: Show booking docs if uploaded (read-only for employee)
      if (statusId >= 15 && VISIBLE_TO_EMPLOYEE_AFTER_STATUS_15.includes(docId)) {
        return !!uploadedDocs[docId]; // Only show if uploaded
      }
      
      // Hide all other documents from employee
      if (HIDDEN_FROM_EMPLOYEE.includes(docId)) {
        return false;
      }
      
      return true;
    });
    
    // Mark which docs employee can edit
    const docsWithPermissions = filteredDocs.map(doc => ({
      ...doc,
      canEdit: EMPLOYEE_UPLOAD_DOCUMENTS.includes(doc.id),
      isReadOnly: !EMPLOYEE_UPLOAD_DOCUMENTS.includes(doc.id)
    }));
    
    return docsWithPermissions;
  },

  /**
   * Get ALL document types for HelpDesk/Travel Desk view
   * Includes all documents
   */
  getAllDocumentTypesForHelpDesk: async () => {
    console.log('📄 Getting all document types (HelpDesk view)');
    
    const response = await api.getAllDocumentsList();
    
    if (response.status !== 'Success' || !response.result) {
      throw new Error('Failed to fetch document types');
    }
    
    const allDocs = response.result.map(doc => ({
      id: doc.documentID,
      documentID: doc.documentID,
      name: doc.documentName,
      documentName: doc.documentName,
      required: doc.isRequired ?? doc.isMandatory ?? true,
      isEmployeeDoc: EMPLOYEE_UPLOAD_DOCUMENTS.includes(doc.documentID),
      isStatus14Doc: STATUS_14_UPLOAD_DOCUMENTS.includes(doc.documentID),
      isStatus15Doc: STATUS_15_UPLOAD_DOCUMENTS.includes(doc.documentID),
      isVisa: doc.documentID === VISA_DOCUMENT_ID,
      isVisaForm: doc.documentID === VISA_FORM_DOCUMENT_ID,
      isVisaAppointment: doc.documentID === VISA_APPOINTMENT_DOCUMENT_ID,
      isHotelBooking: doc.documentID === HOTEL_BOOKING_DOCUMENT_ID,
      isFlightBooking: doc.documentID === FLIGHT_BOOKING_DOCUMENT_ID,
      isTravelInsurance: doc.documentID === TRAVEL_INSURANCE_DOCUMENT_ID
    }));
    
    console.log(`📄 Returning ${allDocs.length} documents for HelpDesk`);
    return allDocs;
  },

  /**
   * Check if a document should be visible based on status and role
   */
  isDocumentVisible: (docId, statusId, isHelpDesk = false) => {
    // HelpDesk can see all documents
    if (isHelpDesk) return true;
    
    // Employee view
    if (EMPLOYEE_UPLOAD_DOCUMENTS.includes(docId)) return true;
    
    // After Status 14: Visa docs visible to employee
    if (statusId >= 14 && VISIBLE_TO_EMPLOYEE_AFTER_STATUS_14.includes(docId)) return true;
    
    // After Status 15: Booking docs visible to employee
    if (statusId >= 15 && VISIBLE_TO_EMPLOYEE_AFTER_STATUS_15.includes(docId)) return true;
    
    return false;
  },

  /**
   * Check if employee can edit a document
   */
  canEmployeeEdit: (docId, statusId) => {
    // Employee can only edit their own upload documents
    if (!EMPLOYEE_UPLOAD_DOCUMENTS.includes(docId)) return false;
    
    // Can only edit at Status 13
    if (statusId !== 13) return false;
    
    return true;
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
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!file) return { valid: false, error: 'No file provided' };
    if (!allowedTypes.includes(file.type)) return { valid: false, error: 'Only PNG, JPG, and PDF files are allowed' };
    if (file.size > maxSize) return { valid: false, error: 'File size must be less than 5MB' };
    
    return { valid: true, error: null };
  },

  // ==========================================
  // DOCUMENT CRUD (Using Employee Endpoints)
  // ==========================================

  addDocument: async (empId, documentId, file) => {
    console.log('📄 Adding document:', { empId, documentId, fileName: file.name });
    
    const validation = documentService.validateFile(file);
    if (!validation.valid) throw new Error(validation.error);
    
    const fileBase64 = await documentService.fileToBase64(file);
    
    // ❌ OLD: await api.addDocumentWithMetadata(...) -> Caused 404
    // ✅ NEW: Use the endpoint that actually exists in Swagger
    const response = await api.addDocument(
      empId, 
      documentId, 
      fileBase64
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

  /**
   * Get all uploaded documents for an employee
   * Uses /api/employee/GetUploadedDocuments
   */
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

  /**
   * Get document with content (base64)
   * Uses /api/employee/GetDocumentFile
   */
  getDocumentWithContent: async (empId, documentId) => {
    console.log('📄 Getting document content:', { empId, documentId });
    
    try {
      const response = await api.getDocumentFile(empId, documentId);
      
      console.log('📄 RAW API RESPONSE:', response); // <--- Look at this in console

      if (response.status !== 'Success' || !response.result) {
        console.warn('❌ API status not success or no result');
        return null;
      }
      
      // Handle if result is an Array
      let docData = response.result;
      if (Array.isArray(docData)) {
        docData = docData[0];
      }

      if (!docData) {
        console.warn('❌ docData is null/undefined after array check');
        return null;
      }

      // 🔍 DEBUG: Print all keys available in the response object
      console.log('🔍 AVAILABLE KEYS:', Object.keys(docData));
      console.log('🔍 docData Object:', docData);

      // Try to find the base64 string in various common property names
      const content = docData.base64String 
                   || docData.Document 
                   || docData.document 
                   || docData.FileContent 
                   || docData.fileContent
                   || docData.PdfContent; // Seen in your SQL earlier

      if (!content) {
        console.error('❌ Could not find file content in response object!');
      }

      return {
        empDocId: docData.empDocId,
        fileName: docData.fileName || `Document_${documentId}`,
        fileType: docData.fileType || 'application/octet-stream',
        fileSize: docData.fileSize || 0,
        base64String: content, // The found content
        createdOn: docData.createdOn
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

  /**
   * Submit documents (Status 13 → 14)
   */
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
  // PASSPORT OCR
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
  // VISA OCR
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
  // (Using Employee Endpoints Directly)
  // ==========================================

  /**
   * Get employee documents for HelpDesk view
   * Uses /api/employee/GetUploadedDocuments directly
   */
  getHelpDeskEmployeeDocuments: async (empId) => {
    console.log('📄 [HelpDesk] Getting documents for:', empId);
    
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
   * Get document content for HelpDesk view
   * Uses /api/employee/GetDocumentFile directly
   */
  getHelpDeskDocumentWithContent: async (empId, documentId) => {
    console.log('📄 [HelpDesk] Getting document content:', { empId, documentId });
    
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
      console.error('📄 [HelpDesk] Error fetching document content:', error);
      throw error;
    }
  },

  /**
   * Upload any document (HelpDesk/Travel Desk)
   */
  helpDeskUploadDocument: async (empId, documentId, file) => {
    console.log('📄 [HelpDesk] Uploading document:', { empId, documentId, fileName: file.name });
    
    const validation = documentService.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    const fileBase64 = await documentService.fileToBase64(file);
    
    try {
      // ❌ OLD: await api.addDocumentWithMetadata(...)
      // ✅ NEW: Use api.addDocument
      const response = await api.addDocument(
        empId, 
        documentId, 
        fileBase64
      );
      
      if (response.status !== 'Success') {
        throw new Error(response.result || 'Failed to upload document');
      }
      
      console.log('📄 [HelpDesk] Document uploaded successfully:', documentId);
      return response.result;
    } catch (error) {
      console.error('📄 [HelpDesk] Upload error:', error);
      throw error;
    }
  },


  // Convenience methods for specific documents
  helpDeskUploadVisa: async (empId, file) => {
    return documentService.helpDeskUploadDocument(empId, VISA_DOCUMENT_ID, file);
  },

  helpDeskUploadVisaForm: async (empId, file) => {
    return documentService.helpDeskUploadDocument(empId, VISA_FORM_DOCUMENT_ID, file);
  },

  helpDeskUploadVisaAppointment: async (empId, file) => {
    return documentService.helpDeskUploadDocument(empId, VISA_APPOINTMENT_DOCUMENT_ID, file);
  },

  helpDeskUploadHotelBooking: async (empId, file) => {
    return documentService.helpDeskUploadDocument(empId, HOTEL_BOOKING_DOCUMENT_ID, file);
  },

  helpDeskUploadFlightBooking: async (empId, file) => {
    return documentService.helpDeskUploadDocument(empId, FLIGHT_BOOKING_DOCUMENT_ID, file);
  },

  helpDeskUploadTravelInsurance: async (empId, file) => {
    return documentService.helpDeskUploadDocument(empId, TRAVEL_INSURANCE_DOCUMENT_ID, file);
  }
};

export default documentService;