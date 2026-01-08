/**
 * Status Mapper Utility - SINGLE SOURCE OF TRUTH
 * 
 * All status-related configuration centralized here.
 * UI components query this module for:
 * - Status labels, colors, descriptions
 * - Allowed actions per role
 * - Next possible statuses
 * - Document requirements
 * - Timeline/stepper configuration
 */

// ============================================
// DOCUMENT IDS (Backend-aligned)
// ============================================
export const DOCUMENT_IDS = {
    PASSPORT: 1,
    INVITATION_LETTER: 2,
    COVER_LETTER: 3,
    KT_PLAN: 4,
    HOTEL_BOOKING: 5,
    FLIGHT_BOOKING: 6,
    TRAVEL_INSURANCE: 7,
    VISA_FORM: 8,
    LETTER_OF_INTENT: 9,
    VISA: 10,
    INSURANCE_DECLARATION: 11,
    VISA_APPOINTMENT: 12,
};

// ============================================
// STATUS CODES (Backend-aligned)
// ============================================
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
    DOCUMENT_PENDING_FROM_EMPLOYEE: 13,
    DOCUMENT_REVIEW_PENDING_FROM_HELPDESK: 14,
    PENDING_TICKETS_FROM_HELPDESK: 15,
    TICKETS_UPLOADED_FROM_HELPDESK: 16,
    EMPLOYEE_TRAVEL_COMPLETED: 17,

    // Rejection
    VISA_REJECTED: 18,
};

// ============================================
// ROLE IDS (Backend-aligned)
// ============================================
export const ROLE_IDS = {
    EMPLOYEE: 1,    // Changed from 101
    MANAGER: 2,     // Changed from 102
    HELPDESK: 3,    // Changed from 103 (Matches your DB now!)
    AVP_DVP: 4,     // Changed from 104
    SVP: 5,         // Changed from 105
};

// ============================================
// DOCUMENT GROUPS
// ============================================
export const DOCUMENT_GROUPS = {
    // Documents employee uploads (Status 13)
    EMPLOYEE_UPLOADS: [
        DOCUMENT_IDS.PASSPORT,
        DOCUMENT_IDS.INVITATION_LETTER,
        DOCUMENT_IDS.COVER_LETTER,
        DOCUMENT_IDS.KT_PLAN,
        DOCUMENT_IDS.VISA_FORM,
        DOCUMENT_IDS.LETTER_OF_INTENT,
        DOCUMENT_IDS.INSURANCE_DECLARATION,
    ],

    // Documents Travel Desk uploads at Status 14 (Visa Review)
    TD_VISA_REVIEW: [
        DOCUMENT_IDS.VISA,
        DOCUMENT_IDS.VISA_APPOINTMENT,
    ],

    // Documents Travel Desk uploads at Status 15 (Booking)
    TD_BOOKING: [
        DOCUMENT_IDS.HOTEL_BOOKING,
        DOCUMENT_IDS.FLIGHT_BOOKING,
        DOCUMENT_IDS.TRAVEL_INSURANCE,
    ],

    // All Travel Desk documents
    TD_ALL: [
        DOCUMENT_IDS.VISA,
        DOCUMENT_IDS.VISA_APPOINTMENT,
        DOCUMENT_IDS.HOTEL_BOOKING,
        DOCUMENT_IDS.FLIGHT_BOOKING,
        DOCUMENT_IDS.TRAVEL_INSURANCE,
    ],
};

// ============================================
// ACTION TYPES
// ============================================
export const ACTIONS = {
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    REQUEST_DOCUMENTS: 'REQUEST_DOCUMENTS',
    UPLOAD_DOCUMENTS: 'UPLOAD_DOCUMENTS',
    SUBMIT_DOCUMENTS: 'SUBMIT_DOCUMENTS',
    REVIEW_DOCUMENTS: 'REVIEW_DOCUMENTS',
    UPLOAD_VISA: 'UPLOAD_VISA',
    SUBMIT_TO_MANAGER: 'SUBMIT_TO_MANAGER',
    PROVIDE_DATES: 'PROVIDE_DATES',
    START_BOOKING: 'START_BOOKING',
    UPLOAD_TICKETS: 'UPLOAD_TICKETS',
    MARK_COMPLETED: 'MARK_COMPLETED',
    REJECT_VISA: 'REJECT_VISA',
    VIEW_DETAILS: 'VIEW_DETAILS',
};

// ============================================
// STATUS CONFIGURATION - SINGLE SOURCE OF TRUTH
// ============================================
const STATUS_CONFIG = {
    // ========== INITIAL INITIATED (1-3) ==========
    1: {
        key: 'INITIAL_MANAGER_INITIATED',
        label: 'Pending Manager Approval',
        shortLabel: 'Manager Initiated',
        color: '#d97706',
        bgColor: '#fff3e0',
        muiColor: 'warning',
        description: 'Request initiated, awaiting manager approval',
        stage: 'initial_approval',
        stepNumber: 1,
        ownerRoleId: ROLE_IDS.MANAGER,
        actions: {
            [ROLE_IDS.MANAGER]: [ACTIONS.APPROVE, ACTIONS.REJECT],
        },
        nextStatuses: {
            [ACTIONS.APPROVE]: 4,
            [ACTIONS.REJECT]: null,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: null,
    },
    2: {
        key: 'INITIAL_AVP_DVP_INITIATED',
        label: 'Pending AVP/DVP Approval',
        shortLabel: 'AVP/DVP Initiated',
        color: '#d97706',
        bgColor: '#fff3e0',
        muiColor: 'warning',
        description: 'Request initiated, awaiting AVP/DVP approval',
        stage: 'initial_approval',
        stepNumber: 1,
        ownerRoleId: ROLE_IDS.AVP_DVP,
        actions: {
            [ROLE_IDS.AVP_DVP]: [ACTIONS.APPROVE, ACTIONS.REJECT],
        },
        nextStatuses: {
            [ACTIONS.APPROVE]: 5,
            [ACTIONS.REJECT]: null,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: null,
    },
    3: {
        key: 'INITIAL_SVP_INITIATED',
        label: 'Pending SVP Approval',
        shortLabel: 'SVP Initiated',
        color: '#d97706',
        bgColor: '#fff3e0',
        muiColor: 'warning',
        description: 'Request initiated, awaiting SVP approval',
        stage: 'initial_approval',
        stepNumber: 1,
        ownerRoleId: ROLE_IDS.SVP,
        actions: {
            [ROLE_IDS.SVP]: [ACTIONS.APPROVE, ACTIONS.REJECT],
        },
        nextStatuses: {
            [ACTIONS.APPROVE]: 6,
            [ACTIONS.REJECT]: null,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: null,
    },

    // ========== INITIAL APPROVED (4-6) ==========
    4: {
        key: 'INITIAL_MANAGER_APPROVED',
        label: 'Manager Approved',
        shortLabel: 'Manager Approved',
        color: '#16a34a',
        bgColor: '#e8f5e9',
        muiColor: 'success',
        description: 'Initial approval by manager complete',
        stage: 'initial_approved',
        stepNumber: 2,
        ownerRoleId: ROLE_IDS.MANAGER,
        actions: {},
        nextStatuses: {},
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: null,
    },
    5: {
        key: 'INITIAL_AVP_DVP_APPROVED',
        label: 'AVP/DVP Approved',
        shortLabel: 'AVP/DVP Approved',
        color: '#16a34a',
        bgColor: '#e8f5e9',
        muiColor: 'success',
        description: 'Initial approval by AVP/DVP complete',
        stage: 'initial_approved',
        stepNumber: 2,
        ownerRoleId: ROLE_IDS.AVP_DVP,
        actions: {},
        nextStatuses: {},
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: null,
    },
    6: {
        key: 'INITIAL_SVP_APPROVED',
        label: 'SVP Approved (Tentative Dates)',
        shortLabel: 'SVP Approved',
        color: '#16a34a',
        bgColor: '#e8f5e9',
        muiColor: 'success',
        description: 'SVP approved with tentative travel dates',
        stage: 'initial_approved',
        stepNumber: 2,
        ownerRoleId: ROLE_IDS.SVP,
        actions: {
            [ROLE_IDS.HELPDESK]: [ACTIONS.REQUEST_DOCUMENTS, ACTIONS.VIEW_DETAILS],
        },
        nextStatuses: {
            [ACTIONS.REQUEST_DOCUMENTS]: 13,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'FlightTakeoff', label: 'New Request', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
    },

    // ========== FINAL INITIATED (7-9) - Waiting for final dates ==========
    7: {
        key: 'MANAGER_FINAL_INITIATED',
        label: 'Final Manager Review',
        shortLabel: 'Final - Manager',
        color: '#0284c7',
        bgColor: '#e3f2fd',
        muiColor: 'info',
        description: 'Waiting for manager to provide final travel dates',
        stage: 'final_approval',
        stepNumber: 4,
        ownerRoleId: ROLE_IDS.MANAGER,
        actions: {
            [ROLE_IDS.MANAGER]: [ACTIONS.PROVIDE_DATES, ACTIONS.REJECT],
        },
        nextStatuses: {
            [ACTIONS.PROVIDE_DATES]: 10,
            [ACTIONS.REJECT]: null,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'CalendarToday', label: 'Manager: New Dates', bg: '#e0e7ff', color: '#3730a3', border: '#6366f1' },
    },
    8: {
        key: 'AVP_DVP_FINAL_INITIATED',
        label: 'Final AVP/DVP Review',
        shortLabel: 'Final - AVP/DVP',
        color: '#0284c7',
        bgColor: '#e3f2fd',
        muiColor: 'info',
        description: 'Waiting for AVP/DVP to provide final travel dates',
        stage: 'final_approval',
        stepNumber: 4,
        ownerRoleId: ROLE_IDS.AVP_DVP,
        actions: {
            [ROLE_IDS.AVP_DVP]: [ACTIONS.PROVIDE_DATES, ACTIONS.REJECT],
        },
        nextStatuses: {
            [ACTIONS.PROVIDE_DATES]: 11,
            [ACTIONS.REJECT]: null,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'CalendarToday', label: 'AVP: New Dates', bg: '#e0e7ff', color: '#3730a3', border: '#6366f1' },
    },
    9: {
        key: 'SVP_FINAL_INITIATED',
        label: 'Final SVP Review',
        shortLabel: 'Final - SVP',
        color: '#0284c7',
        bgColor: '#e3f2fd',
        muiColor: 'info',
        description: 'Waiting for SVP to provide final travel dates',
        stage: 'final_approval',
        stepNumber: 4,
        ownerRoleId: ROLE_IDS.SVP,
        actions: {
            [ROLE_IDS.SVP]: [ACTIONS.PROVIDE_DATES, ACTIONS.REJECT],
        },
        nextStatuses: {
            [ACTIONS.PROVIDE_DATES]: 12,
            [ACTIONS.REJECT]: null,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'CalendarToday', label: 'SVP: New Dates', bg: '#e0e7ff', color: '#3730a3', border: '#6366f1' },
    },

    // ========== FINAL APPROVED (10-12) ==========
    10: {
        key: 'FINAL_MANAGER_APPROVED',
        label: 'Final Manager Approved',
        shortLabel: 'Final Approved',
        color: '#16a34a',
        bgColor: '#c8e6c9',
        muiColor: 'success',
        description: 'Manager provided final dates, ready for booking',
        stage: 'final_approved',
        stepNumber: 5,
        ownerRoleId: ROLE_IDS.MANAGER,
        actions: {
            [ROLE_IDS.HELPDESK]: [ACTIONS.START_BOOKING],
        },
        nextStatuses: {
            [ACTIONS.START_BOOKING]: 15,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'Flight', label: 'Ready for Booking', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
    },
    11: {
        key: 'FINAL_AVP_DVP_APPROVED',
        label: 'Final AVP/DVP Approved',
        shortLabel: 'Final Approved',
        color: '#16a34a',
        bgColor: '#c8e6c9',
        muiColor: 'success',
        description: 'AVP/DVP provided final dates, ready for booking',
        stage: 'final_approved',
        stepNumber: 5,
        ownerRoleId: ROLE_IDS.AVP_DVP,
        actions: {
            [ROLE_IDS.HELPDESK]: [ACTIONS.START_BOOKING],
        },
        nextStatuses: {
            [ACTIONS.START_BOOKING]: 15,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'Flight', label: 'Ready for Booking', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
    },
    12: {
        key: 'FINAL_SVP_APPROVED',
        label: 'Final SVP Approved',
        shortLabel: 'Final Approved',
        color: '#16a34a',
        bgColor: '#c8e6c9',
        muiColor: 'success',
        description: 'SVP provided final dates, ready for booking',
        stage: 'final_approved',
        stepNumber: 5,
        ownerRoleId: ROLE_IDS.SVP,
        actions: {
            [ROLE_IDS.HELPDESK]: [ACTIONS.START_BOOKING],
        },
        nextStatuses: {
            [ACTIONS.START_BOOKING]: 15,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'Flight', label: 'Ready for Booking', bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
    },

    // ========== DOCUMENT FLOW (13-14) ==========
    13: {
        key: 'DOCUMENT_PENDING_FROM_EMPLOYEE',
        label: 'Documents Required',
        shortLabel: 'Upload Docs',
        color: '#dc2626',
        bgColor: '#ffebee',
        muiColor: 'error',
        description: 'Employee must upload required documents',
        stage: 'documents',
        stepNumber: 3,
        ownerRoleId: ROLE_IDS.EMPLOYEE,
        actions: {
            [ROLE_IDS.EMPLOYEE]: [ACTIONS.UPLOAD_DOCUMENTS, ACTIONS.SUBMIT_DOCUMENTS],
        },
        nextStatuses: {
            [ACTIONS.SUBMIT_DOCUMENTS]: 14,
        },
        canEmployeeView: true,
        canEmployeeUpload: true,  // <-- ONLY status where employee can upload
        requiresDocuments: true,
        requiredDocuments: DOCUMENT_GROUPS.EMPLOYEE_UPLOADS,
        priorityBadge: { icon: 'Schedule', label: 'Awaiting Docs', bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' },
    },
    14: {
        key: 'DOCUMENT_REVIEW_PENDING_FROM_HELPDESK',
        label: 'Documents Under Review',
        shortLabel: 'Docs Submitted',
        color: '#0284c7',
        bgColor: '#e1f5fe',
        muiColor: 'info',
        description: 'Travel Desk reviewing documents, processing visa',
        stage: 'documents',
        stepNumber: 3,
        ownerRoleId: ROLE_IDS.HELPDESK,
        actions: {
            [ROLE_IDS.HELPDESK]: [ACTIONS.REVIEW_DOCUMENTS, ACTIONS.UPLOAD_VISA, ACTIONS.SUBMIT_TO_MANAGER, ACTIONS.REJECT_VISA],
        },
        nextStatuses: {
            [ACTIONS.SUBMIT_TO_MANAGER]: 7, // Goes back to manager for final dates
            [ACTIONS.REJECT_VISA]: 18,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        tdUploadDocuments: DOCUMENT_GROUPS.TD_VISA_REVIEW,
        priorityBadge: { icon: 'Description', label: 'Upload Visa & Appointment', bg: '#fef3c7', color: '#92400e', border: '#fbbf24' },
    },

    // ========== BOOKING FLOW (15-16) ==========
    15: {
        key: 'PENDING_TICKETS_FROM_HELPDESK',
        label: 'Pending Flight/Hotel',
        shortLabel: 'Booking...',
        color: '#d97706',
        bgColor: '#fff8e1',
        muiColor: 'warning',
        description: 'Travel Desk booking flights and hotels',
        stage: 'booking',
        stepNumber: 5,
        ownerRoleId: ROLE_IDS.HELPDESK,
        actions: {
            [ROLE_IDS.HELPDESK]: [ACTIONS.UPLOAD_TICKETS],
        },
        nextStatuses: {
            [ACTIONS.UPLOAD_TICKETS]: 16,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        tdUploadDocuments: DOCUMENT_GROUPS.TD_BOOKING,
        priorityBadge: { icon: 'Hotel', label: 'Upload Bookings', bg: '#f5f3ff', color: '#7c3aed', border: '#8b5cf6' },
    },
    16: {
        key: 'TICKETS_UPLOADED_FROM_HELPDESK',
        label: 'Tickets Uploaded',
        shortLabel: 'Booked',
        color: '#16a34a',
        bgColor: '#c8e6c9',
        muiColor: 'success',
        description: 'All bookings complete, tickets uploaded',
        stage: 'booked',
        stepNumber: 6,
        ownerRoleId: ROLE_IDS.HELPDESK,
        actions: {
            [ROLE_IDS.HELPDESK]: [ACTIONS.MARK_COMPLETED],
            [ROLE_IDS.EMPLOYEE]: [ACTIONS.VIEW_DETAILS],
        },
        nextStatuses: {
            [ACTIONS.MARK_COMPLETED]: 17,
        },
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'CheckCircle', label: 'Sent to Employee', bg: '#dcfce7', color: '#16a34a', border: '#22c55e' },
    },

    // ========== COMPLETED (17) ==========
    17: {
        key: 'EMPLOYEE_TRAVEL_COMPLETED',
        label: 'Travel Completed',
        shortLabel: 'Completed',
        color: '#16a34a',
        bgColor: '#a5d6a7',
        muiColor: 'success',
        description: 'Travel completed successfully',
        stage: 'completed',
        stepNumber: 7,
        ownerRoleId: null,
        actions: {},
        nextStatuses: {},
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'Done', label: 'Completed', bg: '#bbf7d0', color: '#15803d', border: '#16a34a' },
    },

    // ========== REJECTED (18) ==========
    18: {
        key: 'VISA_REJECTED',
        label: 'Visa Rejected',
        shortLabel: 'Visa Rejected',
        color: '#dc2626',
        bgColor: '#fee2e2',
        muiColor: 'error',
        description: 'Visa was rejected',
        stage: 'rejected',
        stepNumber: -1,
        ownerRoleId: ROLE_IDS.HELPDESK,
        actions: {},
        nextStatuses: {},
        canEmployeeView: true,
        canEmployeeUpload: false,
        requiresDocuments: false,
        priorityBadge: { icon: 'Cancel', label: 'Visa Rejected', bg: '#fee2e2', color: '#dc2626', border: '#ef4444' },
    },
};

// Unknown status fallback
const UNKNOWN_STATUS = {
    key: 'UNKNOWN',
    label: 'Unknown Status',
    shortLabel: 'Unknown',
    color: '#64748b',
    bgColor: '#f5f5f5',
    muiColor: 'default',
    description: 'Unknown status',
    stage: 'unknown',
    stepNumber: 0,
    ownerRoleId: null,
    actions: {},
    nextStatuses: {},
    canEmployeeView: true,
    canEmployeeUpload: false,
    requiresDocuments: false,
    priorityBadge: null,
};

// ============================================
// CORE API FUNCTIONS
// ============================================

/**
 * Get complete configuration for a status
 * @param {number} statusId - Status code from backend
 * @returns {object} - Complete status configuration
 */
export const getStatusConfig = (statusId) => {
    return STATUS_CONFIG[statusId] || UNKNOWN_STATUS;
};

/**
 * Get actions available for a role at a specific status
 * @param {number} statusId - Status code
 * @param {number} roleId - Role ID (101-105)
 * @returns {string[]} - Array of action keys
 */
export const getRoleActions = (statusId, roleId) => {
    const config = STATUS_CONFIG[statusId];
    return config?.actions?.[roleId] || [];
};

/**
 * Check if role can perform a specific action at a status
 * @param {number} statusId - Status code
 * @param {number} roleId - Role ID
 * @param {string} action - Action key
 * @returns {boolean}
 */
export const canPerformAction = (statusId, roleId, action) => {
    const actions = getRoleActions(statusId, roleId);
    return actions.includes(action);
};

/**
 * Get next status after performing an action
 * @param {number} statusId - Current status
 * @param {string} action - Action being performed
 * @returns {number|null} - Next status code or null
 */
export const getNextStatusForAction = (statusId, action) => {
    const config = STATUS_CONFIG[statusId];
    return config?.nextStatuses?.[action] ?? null;
};

/**
 * Check if employee can upload documents at this status
 * @param {number} statusId - Status code
 * @returns {boolean}
 */
export const canEmployeeUploadDocuments = (statusId) => {
    return STATUS_CONFIG[statusId]?.canEmployeeUpload === true;
};

/**
 * Get required document IDs for a status
 * @param {number} statusId - Status code
 * @returns {number[]} - Array of document IDs
 */
export const getRequiredDocuments = (statusId) => {
    return STATUS_CONFIG[statusId]?.requiredDocuments || [];
};

/**
 * Get Travel Desk upload documents for a status
 * @param {number} statusId - Status code
 * @returns {number[]} - Array of document IDs
 */
export const getTDUploadDocuments = (statusId) => {
    return STATUS_CONFIG[statusId]?.tdUploadDocuments || [];
};

/**
 * Get priority badge configuration for Travel Desk
 * @param {number} statusId - Status code
 * @returns {object|null} - Badge config or null
 */
export const getPriorityBadge = (statusId) => {
    return STATUS_CONFIG[statusId]?.priorityBadge || null;
};

// ============================================
// LEGACY COMPATIBILITY FUNCTIONS
// (Kept for backward compatibility with existing components)
// ============================================

/**
 * Convert status code to chip display object
 * @param {number|string} code - Status code
 * @returns {object} - Chip display object
 */
export const statusToChip = (code) => {
    // Handle string codes (legacy)
    if (typeof code === 'string') {
        const numCode = Object.entries(STATUS_CODES).find(([k]) => k === code)?.[1];
        if (numCode) code = numCode;
    }

    const config = getStatusConfig(code);

    return {
        key: config.key,
        label: config.label,
        shortLabel: config.shortLabel,
        color: config.muiColor,
        bgColor: config.bgColor,
        description: config.description,
        roleId: config.ownerRoleId,
        stage: config.stage,
        actionRequired: config.canEmployeeUpload || Object.keys(config.actions).length > 0,
        actionBy: config.canEmployeeUpload ? 'employee' : 'helpdesk',
    };
};

export const getStatusKey = (code) => getStatusConfig(code).key;
export const getStatusLabel = (code) => getStatusConfig(code).label;
export const getStatusShortLabel = (code) => getStatusConfig(code).shortLabel;
export const getStatusColor = (code) => getStatusConfig(code).color;
export const getStatusBgColor = (code) => getStatusConfig(code).bgColor;
export const getStatusDescription = (code) => getStatusConfig(code).description;

/**
 * Check if status requires employee action (legacy)
 */
export const requiresEmployeeAction = (code) => {
    const config = getStatusConfig(code);
    return config.canEmployeeUpload || (config.actions[ROLE_IDS.EMPLOYEE]?.length > 0);
};

/**
 * Check if status requires helpdesk action (legacy)
 */
export const requiresHelpdeskAction = (code) => {
    const config = getStatusConfig(code);
    return config.actions[ROLE_IDS.HELPDESK]?.length > 0;
};

/**
 * Check if employee can upload documents (legacy - now calls canEmployeeUploadDocuments)
 */
export const canUploadDocuments = (code) => {
    return canEmployeeUploadDocuments(code);
};

/**
 * Check if documents have been submitted (status 14+)
 */
export const areDocumentsSubmitted = (code) => {
    return code >= 14;
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
    return code === 17;
};

/**
 * Map status key to numeric code (reverse mapping)
 */
export const statusKeyToCode = (key) => {
    return STATUS_CODES[key] || 0;
};

// ============================================
// STATUS GROUPS
// ============================================
export const STATUS_GROUPS = {
    INITIAL_PENDING: [1, 2, 3],
    INITIAL_APPROVED: [4, 5, 6],
    FINAL_PENDING: [7, 8, 9],
    FINAL_APPROVED: [10, 11, 12],
    DOCUMENTS: [13, 14],
    BOOKING: [15, 16],
    COMPLETED: [17],
    REJECTED: [18],
    HELPDESK_ACTION: [6, 14, 15],
    EMPLOYEE_ACTION: [13],
    ALL_PENDING: [1, 2, 3, 7, 8, 9, 13, 14, 15],
    ALL_COMPLETED: [16, 17],
};

export const TD_STATUS_GROUPS = {
    NEW_REQUESTS: [6],
    AWAITING_DOCUMENTS: [13],
    DOCUMENTS_SUBMITTED: [14],
    WAITING_MANAGER_DATES: [7, 8, 9],
    READY_FOR_BOOKING: [10, 11, 12],
    BOOKING: [15],
    COMPLETED: [16, 17],
    REJECTED: [18],
    PENDING: [6, 14, 15],
    DONE: [16, 17],
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
 * Get next status in simple workflow (legacy)
 */
export const getNextStatus = (currentStatus) => {
    const flow = {
        13: 14,
        14: 7, // After visa review, goes to manager for final dates
        15: 16,
        16: 17,
    };
    return flow[currentStatus] || null;
};

/**
 * Get available actions for a status (legacy format)
 */
export const getAvailableActions = (status) => {
    const config = getStatusConfig(status);
    const allActions = [];

    Object.entries(config.actions).forEach(([roleId, actions]) => {
        actions.forEach(action => {
            allActions.push({
                key: action,
                label: action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
                role: roleId === String(ROLE_IDS.EMPLOYEE) ? 'employee' :
                    roleId === String(ROLE_IDS.HELPDESK) ? 'helpdesk' :
                        roleId === String(ROLE_IDS.MANAGER) ? 'manager' : 'approver',
            });
        });
    });

    return allActions;
};

/**
 * Get documents required by status with upload status
 */
export const getDocumentsForStatus = (statusId, allDocuments, uploadedDocuments) => {
    const employeeDocs = [];
    const tdUploadDocs = [];

    allDocuments.forEach(doc => {
        const docId = doc.documentID || doc.id;
        const isUploaded = !!uploadedDocuments[docId];

        if (DOCUMENT_GROUPS.EMPLOYEE_UPLOADS.includes(docId)) {
            if (isUploaded) {
                employeeDocs.push({ ...doc, isUploaded: true, category: 'employee' });
            }
        }

        if (statusId === 14 && DOCUMENT_GROUPS.TD_VISA_REVIEW.includes(docId)) {
            tdUploadDocs.push({ ...doc, isUploaded, category: 'td_visa' });
        }

        if (statusId === 15) {
            if (DOCUMENT_GROUPS.TD_VISA_REVIEW.includes(docId)) {
                employeeDocs.push({ ...doc, isUploaded, category: 'td_visa_uploaded' });
            }
            if (DOCUMENT_GROUPS.TD_BOOKING.includes(docId)) {
                tdUploadDocs.push({ ...doc, isUploaded, category: 'td_booking' });
            }
        }
    });

    return { employeeDocs, tdUploadDocs };
};

/**
 * Get stepper configuration for employee dashboard
 */
export const getStepperConfig = (currentStatus) => {
    const steps = [
        { label: 'Submitted', statuses: [1, 2, 3] },
        { label: 'Initial Approval', statuses: [4, 5, 6] },
        { label: 'Documents Upload', statuses: [13] },
        { label: 'Document Review', statuses: [14] },
        { label: 'Final Approval', statuses: [7, 8, 9, 10, 11, 12] },
        { label: 'Booking', statuses: [15, 16] },
        { label: 'Completed', statuses: [17] },
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
        completed: steps.map((_, index) => index < activeStep),
    };
};

/**
 * Get timeline steps for detailed flow view
 */
export const getDetailedTimelineSteps = (currentStatus) => {
    const allSteps = [
        { status: 1, label: 'Request Initiated' },
        { status: 4, label: 'Initial Approval' },
        { status: 13, label: 'Document Request' },
        { status: 14, label: 'Documents Submitted' },
        { status: 7, label: 'Final Dates Request' },
        { status: 10, label: 'Final Approval' },
        { status: 15, label: 'Booking in Progress' },
        { status: 16, label: 'Tickets Uploaded' },
        { status: 17, label: 'Travel Completed' },
    ];

    return allSteps.map(step => ({
        ...step,
        isCompleted: currentStatus > step.status || (currentStatus === 17 && step.status <= 17),
        isCurrent: currentStatus === step.status,
    }));
};

// ============================================
// DEFAULT EXPORT
// ============================================
const statusMapper = {
    // Core
    STATUS_CODES,
    ROLE_IDS,
    ACTIONS,
    DOCUMENT_IDS,
    DOCUMENT_GROUPS,
    STATUS_GROUPS,
    TD_STATUS_GROUPS,

    // New API
    getStatusConfig,
    getRoleActions,
    canPerformAction,
    getNextStatusForAction,
    canEmployeeUploadDocuments,
    getRequiredDocuments,
    getTDUploadDocuments,
    getPriorityBadge,

    // Legacy compatibility
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
    getDocumentsForStatus,
    getStepperConfig,
    getDetailedTimelineSteps,
};

export default statusMapper;