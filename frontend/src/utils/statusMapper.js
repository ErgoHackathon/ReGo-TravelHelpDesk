/**
 * Status Mapper Utility
 * Maps numeric status codes from backend to frontend-friendly status objects
 * Based on TMS_TravelMaster.Status database schema
 * 
 * Updated with actual backend status codes
 */

/**
 * Status Code Constants - Based on Backend API
 */
export const STATUS_CODES = {
    // Initial Initiated (1-3)
    INITIAL_MANAGER_INITIATED: 1,
    INITIAL_AVP_DVP_INITIATED: 2,
    INITIAL_SVP_INITIATED: 3,
    
    // Initial Approved (4-6)
    INITIAL_MANAGER_APPROVED: 4,
    INITIAL_AVP_DVP_APPROVED: 5,
    INITIAL_SVP_APPROVED: 6,
    
    // Final Initiated (7-9)
    MANAGER_FINAL_INITIATED: 7,
    AVP_DVP_FINAL_INITIATED: 8,
    SVP_FINAL_INITIATED: 9,
    
    // Final Approved (10-12)
    FINAL_MANAGER_APPROVED: 10,
    FINAL_AVP_DVP_APPROVED: 11,
    FINAL_SVP_APPROVED: 12,
    
    // Document & Booking Flow (13-17)
    DOCUMENT_PENDING_FROM_EMPLOYEE: 13,           // Employee needs to upload documents
    DOCUMENT_REVIEW_PENDING_FROM_HELPDESK: 14,    // Documents submitted, Helpdesk reviewing
    PENDING_TICKETS_FROM_HELPDESK: 15,            // Helpdesk booking flights/hotels
    TICKETS_UPLOADED_FROM_HELPDESK: 16,           // Tickets uploaded by Helpdesk
    EMPLOYEE_TRAVEL_COMPLETED: 17,
    VISA_REJECTED: 18,                 // Travel completed
    
    // Travel Desk Workflow (String based - for extended workflow)
    TD_RECEIVED_FAKE_DATES: 'TD_RECEIVED_FAKE_DATES',
    TD_REQUESTED_REAL_DATES: 'TD_REQUESTED_REAL_DATES',
    SVP_PROVIDED_REAL_DATES: 'SVP_PROVIDED_REAL_DATES',
    TD_REQUESTED_DOCUMENTS: 'TD_REQUESTED_DOCUMENTS',
    TD_DOCUMENTS_RECEIVED: 'TD_DOCUMENTS_RECEIVED',
    TD_OCR_IN_PROGRESS: 'TD_OCR_IN_PROGRESS',
    TD_OCR_VERIFIED: 'TD_OCR_VERIFIED',
    TD_OCR_FAILED: 'TD_OCR_FAILED',
    TD_BOOKING_IN_PROGRESS: 'TD_BOOKING_IN_PROGRESS',
    TD_BOOKED: 'TD_BOOKED'
};

/**
 * Role ID mapping
 */
export const ROLE_IDS = {
    EMPLOYEE: 101,
    MANAGER: 102,
    HELPDESK: 103,
    AVP_DVP: 104,
    SVP: 105
};

/**
 * Convert numeric/string status code to status object for UI display
 * @param {number|string} code - Status code from backend
 * @returns {object} - Status object with key, label, color, bgColor, and description
 */
export const statusToChip = (code) => {
    // Handle numeric codes
    if (typeof code === 'number') {
        switch (code) {
            // ==========================================
            // INITIAL INITIATED (1-3)
            // ==========================================
            case 1:
                return {
                    key: 'INITIAL_MANAGER_INITIATED',
                    label: 'Pending Manager Approval',
                    shortLabel: 'Manager Initiated',
                    color: 'warning',
                    bgColor: '#fff3e0',
                    description: 'Initial Manager initiated',
                    roleId: 102,
                    stage: 'approval'
                };
            case 2:
                return {
                    key: 'INITIAL_AVP_DVP_INITIATED',
                    label: 'Pending AVP/DVP Approval',
                    shortLabel: 'AVP/DVP Initiated',
                    color: 'warning',
                    bgColor: '#fff3e0',
                    description: 'Initial AVP/DVP initiated',
                    roleId: 104,
                    stage: 'approval'
                };
            case 3:
                return {
                    key: 'INITIAL_SVP_INITIATED',
                    label: 'Pending SVP Approval',
                    shortLabel: 'SVP Initiated',
                    color: 'warning',
                    bgColor: '#fff3e0',
                    description: 'Initial SVP initiated',
                    roleId: 105,
                    stage: 'approval'
                };
                
            // ==========================================
            // INITIAL APPROVED (4-6)
            // ==========================================
            case 4:
                return {
                    key: 'INITIAL_MANAGER_APPROVED',
                    label: 'Manager Approved',
                    shortLabel: 'Manager Approved',
                    color: 'success',
                    bgColor: '#e8f5e9',
                    description: 'Initial Manager Approved',
                    roleId: 102,
                    stage: 'approved'
                };
            case 5:
                return {
                    key: 'INITIAL_AVP_DVP_APPROVED',
                    label: 'AVP/DVP Approved',
                    shortLabel: 'AVP/DVP Approved',
                    color: 'success',
                    bgColor: '#e8f5e9',
                    description: 'Initial AVP/DVP Approved',
                    roleId: 104,
                    stage: 'approved'
                };
            case 6:
                return {
                    key: 'INITIAL_SVP_APPROVED',
                    label: 'SVP Approved',
                    shortLabel: 'SVP Approved',
                    color: 'success',
                    bgColor: '#e8f5e9',
                    description: 'Initial SVP Approved',
                    roleId: 105,
                    stage: 'approved'
                };
                
            // ==========================================
            // FINAL INITIATED (7-9)
            // ==========================================
            case 7:
                return {
                    key: 'FINAL_MANAGER_INITIATED',
                    label: 'Final Manager Review',
                    shortLabel: 'Final - Manager',
                    color: 'info',
                    bgColor: '#e3f2fd',
                    description: 'Manager final initiated',
                    roleId: 102,
                    stage: 'final_approval'
                };
            case 8:
                return {
                    key: 'FINAL_AVP_DVP_INITIATED',
                    label: 'Final AVP/DVP Review',
                    shortLabel: 'Final - AVP/DVP',
                    color: 'info',
                    bgColor: '#e3f2fd',
                    description: 'AVP/DVP final initiated',
                    roleId: 104,
                    stage: 'final_approval'
                };
            case 9:
                return {
                    key: 'FINAL_SVP_INITIATED',
                    label: 'Final SVP Review',
                    shortLabel: 'Final - SVP',
                    color: 'info',
                    bgColor: '#e3f2fd',
                    description: 'SVP final initiated',
                    roleId: 105,
                    stage: 'final_approval'
                };
                
            // ==========================================
            // FINAL APPROVED (10-12)
            // ==========================================
            case 10:
                return {
                    key: 'FINAL_MANAGER_APPROVED',
                    label: 'Final Manager Approved',
                    shortLabel: 'Final Approved',
                    color: 'success',
                    bgColor: '#c8e6c9',
                    description: 'Manager final Approved',
                    roleId: 102,
                    stage: 'final_approved'
                };
            case 11:
                return {
                    key: 'FINAL_AVP_DVP_APPROVED',
                    label: 'Final AVP/DVP Approved',
                    shortLabel: 'Final Approved',
                    color: 'success',
                    bgColor: '#c8e6c9',
                    description: 'AVP/DVP final Approved',
                    roleId: 104,
                    stage: 'final_approved'
                };
            case 12:
                return {
                    key: 'FINAL_SVP_APPROVED',
                    label: 'Final SVP Approved',
                    shortLabel: 'Final Approved',
                    color: 'success',
                    bgColor: '#c8e6c9',
                    description: 'SVP final Approved',
                    roleId: 105,
                    stage: 'final_approved'
                };
                
            // ==========================================
            // DOCUMENT & BOOKING FLOW (13-17)
            // ==========================================
            case 13:
                return {
                    key: 'DOCUMENT_PENDING',
                    label: 'Documents Required',
                    shortLabel: 'Upload Docs',
                    color: 'error',
                    bgColor: '#ffebee',
                    description: 'Document Pending From Employee',
                    roleId: 101,
                    stage: 'documents',
                    actionRequired: true,
                    actionBy: 'employee'
                };
            case 14:
                return {
                    key: 'DOCUMENT_REVIEW_PENDING',
                    label: 'Documents Under Review',
                    shortLabel: 'Docs Submitted',
                    color: 'info',
                    bgColor: '#e1f5fe',
                    description: 'Review Pending From Helpdesk',
                    roleId: 103,
                    stage: 'documents',
                    actionRequired: true,
                    actionBy: 'helpdesk'
                };
            case 15:
                return {
                    key: 'PENDING_TICKETS',
                    label: 'Pending Flight/Hotel',
                    shortLabel: 'Booking...',
                    color: 'warning',
                    bgColor: '#fff8e1',
                    description: 'Pending Ticket From Helpdesk',
                    roleId: 103,
                    stage: 'booking',
                    actionRequired: true,
                    actionBy: 'helpdesk'
                };
            case 16:
                return {
                    key: 'TICKETS_UPLOADED',
                    label: 'Tickets Uploaded',
                    shortLabel: 'Booked',
                    color: 'success',
                    bgColor: '#c8e6c9',
                    description: 'Ticket uploaded From Helpdesk',
                    roleId: 103,
                    stage: 'booked'
                };
            case 17:
                return {
                    key: 'COMPLETED',
                    label: 'Travel Completed',
                    shortLabel: 'Completed',
                    color: 'success',
                    bgColor: '#a5d6a7',
                    description: 'Employee Travel Completed',
                    roleId: 101,
                    stage: 'completed'
                };
                
            default:
                return {
                    key: 'UNKNOWN',
                    label: `Status ${code}`,
                    shortLabel: `Status ${code}`,
                    color: 'default',
                    bgColor: '#f5f5f5',
                    description: 'Unknown status',
                    stage: 'unknown'
                };
        }
    }
    
    // Handle string codes (Travel Desk extended workflow)
    if (typeof code === 'string') {
        switch (code) {
            case 'TD_RECEIVED_FAKE_DATES':
                return {
                    key: 'TD_RECEIVED_FAKE_DATES',
                    label: 'Fake Dates Received',
                    shortLabel: 'Fake Dates',
                    color: 'warning',
                    bgColor: '#fff3e0',
                    description: 'Travel Desk received initial dates from SVP',
                    stage: 'dates'
                };
            case 'TD_REQUESTED_REAL_DATES':
                return {
                    key: 'TD_REQUESTED_REAL_DATES',
                    label: 'Awaiting Real Dates',
                    shortLabel: 'Need Dates',
                    color: 'warning',
                    bgColor: '#fff8e1',
                    description: 'Waiting for SVP to confirm actual dates',
                    stage: 'dates'
                };
            case 'SVP_PROVIDED_REAL_DATES':
                return {
                    key: 'SVP_PROVIDED_REAL_DATES',
                    label: 'Real Dates Confirmed',
                    shortLabel: 'Dates OK',
                    color: 'info',
                    bgColor: '#e3f2fd',
                    description: 'SVP confirmed actual travel dates',
                    stage: 'dates'
                };
            case 'TD_REQUESTED_DOCUMENTS':
                return {
                    key: 'TD_REQUESTED_DOCUMENTS',
                    label: 'Documents Requested',
                    shortLabel: 'Need Docs',
                    color: 'error',
                    bgColor: '#ffebee',
                    description: 'Upload Passport, PAN, Aadhaar',
                    stage: 'documents'
                };
            case 'TD_DOCUMENTS_RECEIVED':
                return {
                    key: 'TD_DOCUMENTS_RECEIVED',
                    label: 'Documents Received',
                    shortLabel: 'Docs Received',
                    color: 'info',
                    bgColor: '#e1f5fe',
                    description: 'Documents received, pending verification',
                    stage: 'documents'
                };
            case 'TD_OCR_IN_PROGRESS':
                return {
                    key: 'TD_OCR_IN_PROGRESS',
                    label: 'OCR In Progress',
                    shortLabel: 'Verifying...',
                    color: 'secondary',
                    bgColor: '#f3e5f5',
                    description: 'Verifying documents using OCR',
                    stage: 'verification'
                };
            case 'TD_OCR_VERIFIED':
                return {
                    key: 'TD_OCR_VERIFIED',
                    label: 'OCR Verified',
                    shortLabel: 'Verified',
                    color: 'success',
                    bgColor: '#e8f5e9',
                    description: 'Documents verified successfully',
                    stage: 'verification'
                };
            case 'TD_OCR_FAILED':
                return {
                    key: 'TD_OCR_FAILED',
                    label: 'OCR Failed',
                    shortLabel: 'Failed',
                    color: 'error',
                    bgColor: '#ffcdd2',
                    description: 'Document verification failed',
                    stage: 'verification'
                };
            case 'TD_BOOKING_IN_PROGRESS':
                return {
                    key: 'TD_BOOKING_IN_PROGRESS',
                    label: 'Booking In Progress',
                    shortLabel: 'Booking...',
                    color: 'info',
                    bgColor: '#b3e5fc',
                    description: 'Travel Desk is booking flights/hotels',
                    stage: 'booking'
                };
            case 'TD_BOOKED':
                return {
                    key: 'TD_BOOKED',
                    label: 'Booked',
                    shortLabel: 'Booked',
                    color: 'success',
                    bgColor: '#c8e6c9',
                    description: 'All bookings confirmed',
                    stage: 'booked'
                };
            default:
                return {
                    key: code,
                    label: code.replace(/_/g, ' '),
                    shortLabel: code.replace(/_/g, ' '),
                    color: 'default',
                    bgColor: '#f5f5f5',
                    description: '',
                    stage: 'unknown'
                };
        }
    }
    
    // Fallback
    return {
        key: 'UNKNOWN',
        label: 'Unknown',
        shortLabel: 'Unknown',
        color: 'default',
        bgColor: '#f5f5f5',
        description: '',
        stage: 'unknown'
    };
};

/**
 * Get status key from code
 */
export const getStatusKey = (code) => statusToChip(code).key;

/**
 * Get status label from code
 */
export const getStatusLabel = (code) => statusToChip(code).label;

/**
 * Get short status label from code
 */
export const getStatusShortLabel = (code) => statusToChip(code).shortLabel;

/**
 * Get status color from code
 */
export const getStatusColor = (code) => statusToChip(code).color;

/**
 * Get status background color from code
 */
export const getStatusBgColor = (code) => statusToChip(code).bgColor;

/**
 * Get status description from code
 */
export const getStatusDescription = (code) => statusToChip(code).description;

/**
 * Check if status requires action from employee
 */
export const requiresEmployeeAction = (code) => {
    const status = statusToChip(code);
    return status.actionRequired && status.actionBy === 'employee';
};

/**
 * Check if status requires action from helpdesk
 */
export const requiresHelpdeskAction = (code) => {
    const status = statusToChip(code);
    return status.actionRequired && status.actionBy === 'helpdesk';
};

/**
 * Check if employee can upload documents (status 13)
 */
export const canUploadDocuments = (code) => {
    return code === 13 || code === STATUS_CODES.DOCUMENT_PENDING;
};

/**
 * Check if documents have been submitted (status 14)
 */
export const areDocumentsSubmitted = (code) => {
    return code === 14 || code === STATUS_CODES.DOCUMENT_REVIEW_PENDING;
};

/**
 * Check if request is in booking phase
 */
export const isInBookingPhase = (code) => {
    return code === 15 || code === 16;
};

/**
 * Check if request is completed
 */
export const isCompleted = (code) => {
    return code === 17 || code === STATUS_CODES.COMPLETED;
};

/**
 * Map status key to numeric code (reverse mapping)
 */
export const statusKeyToCode = (key) => {
    const mapping = {
        'INITIAL_MANAGER_INITIATED': 1,
        'INITIAL_AVP_DVP_INITIATED': 2,
        'INITIAL_SVP_INITIATED': 3,
        'INITIAL_MANAGER_APPROVED': 4,
        'INITIAL_AVP_DVP_APPROVED': 5,
        'INITIAL_SVP_APPROVED': 6,
        'FINAL_MANAGER_INITIATED': 7,
        'FINAL_AVP_DVP_INITIATED': 8,
        'FINAL_SVP_INITIATED': 9,
        'FINAL_MANAGER_APPROVED': 10,
        'FINAL_AVP_DVP_APPROVED': 11,
        'FINAL_SVP_APPROVED': 12,
        'DOCUMENT_PENDING': 13,
        'DOCUMENT_REVIEW_PENDING': 14,
        'PENDING_TICKETS': 15,
        'TICKETS_UPLOADED': 16,
        'COMPLETED': 17
    };
    return mapping[key] || 0;
};

/**
 * Status Groups for filtering
 */
export const STATUS_GROUPS = {
    // Initial approval flow
    INITIAL_PENDING: [1, 2, 3],
    INITIAL_APPROVED: [4, 5, 6],
    
    // Final approval flow
    FINAL_PENDING: [7, 8, 9],
    FINAL_APPROVED: [10, 11, 12],
    
    // Document & Booking flow
    DOCUMENTS: [13, 14],
    BOOKING: [15, 16],
    COMPLETED: [17],
    
    // Helpdesk action required
    HELPDESK_ACTION: [14, 15],
    
    // Employee action required
    EMPLOYEE_ACTION: [13]
};

/**
 * Travel Desk Status Groups (for filtering in portal)
 */
export const TD_STATUS_GROUPS = {
    // Requests waiting for documents from employee
    AWAITING_DOCUMENTS: [13],
    
    // Documents submitted, pending helpdesk review
    DOCUMENTS_SUBMITTED: [14],
    
    // Booking phase
    BOOKING: [15, 16],
    
    // Completed
    COMPLETED: [17],
    
    // All pending (for helpdesk to work on)
    PENDING: [14, 15],
    
    // All completed
    DONE: [16, 17]
};

/**
 * Check if status belongs to a specific group
 */
export const isInStatusGroup = (status, groupName) => {
    const group = STATUS_GROUPS[groupName] || TD_STATUS_GROUPS[groupName];
    if (!group) return false;
    return group.includes(status);
};

/**
 * Get next status in workflow
 */
export const getNextStatus = (currentStatus) => {
    const flow = {
        13: 14, // DOCUMENT_PENDING → DOCUMENT_REVIEW_PENDING
        14: 15, // DOCUMENT_REVIEW_PENDING → PENDING_TICKETS
        15: 16, // PENDING_TICKETS → TICKETS_UPLOADED
        16: 17  // TICKETS_UPLOADED → COMPLETED
    };
    return flow[currentStatus] || null;
};

/**
 * Get available actions for a status
 */
export const getAvailableActions = (status) => {
    const actions = {
        13: [
            { key: 'UPLOAD_DOCUMENTS', label: 'Upload Documents', role: 'employee' }
        ],
        14: [
            { key: 'REVIEW_DOCUMENTS', label: 'Review Documents', role: 'helpdesk' },
            { key: 'START_BOOKING', label: 'Start Booking', role: 'helpdesk' }
        ],
        15: [
            { key: 'UPLOAD_TICKETS', label: 'Upload Tickets', role: 'helpdesk' }
        ],
        16: [
            { key: 'MARK_COMPLETED', label: 'Mark Completed', role: 'helpdesk' }
        ]
    };
    
    return actions[status] || [];
};

/**
 * Get stepper configuration for employee dashboard
 */
export const getStepperConfig = (currentStatus) => {
    const steps = [
        { label: 'Submitted', statuses: [1, 2, 3] },
        { label: 'Manager Approval', statuses: [4, 5, 6, 7, 8, 9, 10, 11, 12] },
        { label: 'Documents Upload', statuses: [13] },
        { label: 'Documents Review', statuses: [14] },
        { label: 'Booking', statuses: [15, 16] },
        { label: 'Completed', statuses: [17] }
    ];
    
    let activeStep = 0;
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].statuses.includes(currentStatus)) {
            activeStep = i;
            break;
        }
    }
    
    return {
        steps: steps.map(s => s.label),
        activeStep,
        completed: steps.map((_, index) => index < activeStep)
    };
};

// Default export
const statusMapper = {
    STATUS_CODES,
    ROLE_IDS,
    STATUS_GROUPS,
    TD_STATUS_GROUPS,
    statusToChip,
    getStatusKey,
    getStatusLabel,
    getStatusShortLabel,
    getStatusColor,
    getStatusBgColor,
    getStatusDescription,
    statusKeyToCode,
    requiresEmployeeAction,
    requiresHelpdeskAction,
    canUploadDocuments,
    areDocumentsSubmitted,
    isInBookingPhase,
    isCompleted,
    isInStatusGroup,
    getNextStatus,
    getAvailableActions,
    getStepperConfig
};

export default statusMapper;