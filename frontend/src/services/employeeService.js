/**
 * Employee Service
 * Clean service - uses apiService for data
 */

import api from './apiService';
import { getStatusLabel } from '../utils/statusMapper';

// Use StatusMapper.getStatusLabel() - single source of truth
const getTravelStatusLabel = (travelStatus) => {
  return getStatusLabel(travelStatus);
};


const employeeService = {
  /**
   * Get employee profile
   */
  getEmployeeProfile: async (idOrEmail) => {
    const response = await api.getEmployeeData(idOrEmail);

    if (response.status !== 'Success' || !response.result) {
      throw new Error('Failed to fetch employee profile');
    }

    const data = response.result;

    return {
      empId: data.empId,
      empName: data.name,
      email: data.email,
      rptEmpId: data.rptEmpId,
      refRoleId: data.refRoleId || 101,
    };
  },

  /**
   * Get employee travel
   */
 // employeeService.js - getEmployeeTravel function

getEmployeeTravel: async (empId) => {
  if (!empId) return [];

  const response = await api.getTravelDetailByEmpId(empId);

  // ✅ ADD THIS DEBUG LOG
  console.log('🔍 DEBUG - Raw API response:', response);

  if (response.status === 'Functional Failure' || !response.result) {
    return [];
  }

  const result = response.result;
  
  // ✅ ADD THIS DEBUG LOG
  console.log('🔍 DEBUG - result:', result);
  console.log('🔍 DEBUG - First item raw:', Array.isArray(result) ? result[0] : result);

  const travels = Array.isArray(result) ? result : [result];

  const mapped = travels.map((travel, index) => {
    // ✅ ADD THIS DEBUG LOG
    console.log('🔍 DEBUG - Mapping travel item:', travel);
    
    return {
      id: `${travel.empId}-${index}`,
      travelId: travel.tId,        // ✅ Check: is it tId or TId?
      tId: travel.tId,             // ✅ Add both versions
      empId: travel.empId,
      country: travel.country,
      city: travel.city,
      destination: `${travel.city}, ${travel.country}`,
      purpose: travel.remark,
      departureDate: travel.travelStartDate,
      returnDate: travel.travelEndDate,
      status: travel.status,
      statusId: travel.status,     // ✅ Add statusId
      statusLabel: getTravelStatusLabel(travel.status) || 'Unknown',
      rptEmpId: travel.rptEmpId
    };
  });

  // ✅ ADD THIS DEBUG LOG
  console.log('🔍 DEBUG - Mapped travels:', mapped);

  return mapped;
},

getEmployeeTravelByTid: async (TiD) => {
  if (!TiD) return [];

  const response = await api.getTravelDetailByTId(TiD);

  if (response.status === 'Functional Failure' || !response.result) {
    return [];
  }

  const result = response.result;
  const travels = Array.isArray(result) ? result : [result];

  return travels.map((travel, index) => ({
    id: `${travel.empId}-${index}`,
    travelId: travel.tId,
    
    // ✅ Employee Info - directly from API
    empId: travel.empId,
    empName: travel.empName,  // "Abhishek kumar"
    position: travel.position, // "Developer"
    
    // ✅ Asset Info - FLATTEN the object (don't keep as object!)
    assetName: travel.asset?.assetName || '',      // "Easy"
    tower: travel.asset?.tower || '',              // "Germany"
    subTower: travel.asset?.subTower || '',        // "Broker & Sales"
    
    // ✅ Convenience display string for asset
    assetDisplay: travel.asset?.assetName 
      ? `${travel.asset.assetName}${travel.asset.tower ? ` (${travel.asset.tower})` : ''}`
      : 'N/A',
    
    // Destination
    country: travel.country,
    city: travel.city,
    destination: [travel.city, travel.country].filter(Boolean).join(', '),
    
    // Other fields
    purpose: travel.remark,
    departureDate: travel.travelStartDate,
    returnDate: travel.travelEndDate,
    status: travel.status,
    statusLabel: getTravelStatusLabel(travel.status) || 'Unknown',
    rptEmpId: travel.rptEmpId,
    history: travel.statusHistory,
    finalStartDate: travel.finalStartDate,
    finalEndDate: travel.finalEndDate,
    suggestedDate: travel.suggestedDate
  }));
},

  /**
   * Add document
   */
  addDocument: async (empId, documentId, document) => {
    const response = await api.addDocument(empId, documentId, document);

    if (response.status !== 'Success') {
      throw new Error('Failed to add document');
    }

    return response.result;
  },

  /**
   * Update document
   */
  updateDocument: async (empId, documentId, document) => {
    const response = await api.updateDocument(empId, documentId, document);

    if (response.status !== 'Success') {
      throw new Error('Failed to update document');
    }
    else {

    }

    return response.result;
  },

  /**
   * Delete document
   * API: DELETE /api/employee/DeleteDocument
   */
  deleteDocument: async (empId, documentId) => {
    const response = await api.deleteDocument(empId, documentId);

    if (response.status !== 'Success') {
      throw new Error('Failed to delete document');
    }

    return response.result;
  },

  /**
   * Update passport information
   * API: POST /api/employee/UpdatePassportInfo
   */
  updatePassportInfo: async (empId, passportData) => {
    const response = await api.updatePassportInfo(empId, passportData);

    if (response.status !== 'Success') {
      throw new Error('Failed to update passport info');
    }

    return response.result;
  },

  /**
   * Get uploaded documents for employee
   * API: GET /api/employee/GetUploadedDocuments
   */
  getUploadedDocuments: async (empId) => {
    const response = await api.getEmployeeAllDocuments(empId);

    if (response.status === 'Functional Failure' || !response.result) {
      return [];
    }

    return response.result;
  }
};

export default employeeService;