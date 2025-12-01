/**
 * Permissions Configuration
 * Role-based access control (RBAC) configuration
 */

import { ROLES } from '../utils/constants';

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export const PERMISSIONS = {
    // Travel Request permissions
    CREATE_TRAVEL_REQUEST: 'create_travel_request',
    VIEW_OWN_REQUESTS: 'view_own_requests',
    VIEW_TEAM_REQUESTS: 'view_team_requests',
    VIEW_ALL_REQUESTS: 'view_all_requests',
    EDIT_OWN_REQUEST: 'edit_own_request',
    DELETE_OWN_REQUEST: 'delete_own_request',
    SUBMIT_REQUEST: 'submit_request',
    CANCEL_REQUEST: 'cancel_request',

    // Approval permissions
    APPROVE_AS_MANAGER: 'approve_as_manager',
    APPROVE_AS_AVP: 'approve_as_avp',
    APPROVE_AS_SVP: 'approve_as_svp',
    APPROVE_AS_CHRO: 'approve_as_chro',
    REJECT_REQUEST: 'reject_request',
    DELEGATE_APPROVAL: 'delegate_approval',
    VIEW_APPROVAL_HISTORY: 'view_approval_history',

    // Document permissions
    UPLOAD_DOCUMENT: 'upload_document',
    VIEW_DOCUMENTS: 'view_documents',
    DELETE_DOCUMENT: 'delete_document',
    VERIFY_DOCUMENT: 'verify_document',

    // Booking permissions
    CREATE_BOOKING: 'create_booking',
    VIEW_BOOKINGS: 'view_bookings',
    CANCEL_BOOKING: 'cancel_booking',
    MODIFY_BOOKING: 'modify_booking',

    // Expense permissions
    SUBMIT_EXPENSE: 'submit_expense',
    VIEW_OWN_EXPENSES: 'view_own_expenses',
    VIEW_ALL_EXPENSES: 'view_all_expenses',
    APPROVE_EXPENSE: 'approve_expense',
    REJECT_EXPENSE: 'reject_expense',
    PROCESS_REIMBURSEMENT: 'process_reimbursement',

    // User management permissions
    VIEW_USERS: 'view_users',
    CREATE_USER: 'create_user',
    EDIT_USER: 'edit_user',
    DELETE_USER: 'delete_user',
    ACTIVATE_USER: 'activate_user',
    DEACTIVATE_USER: 'deactivate_user',

    // Report permissions
    VIEW_REPORTS: 'view_reports',
    EXPORT_REPORTS: 'export_reports',
    VIEW_ANALYTICS: 'view_analytics',

    // System permissions
    MANAGE_SYSTEM_CONFIG: 'manage_system_config',
    VIEW_AUDIT_LOGS: 'view_audit_logs'
};

// ============================================
// ROLE PERMISSIONS MAPPING
// ============================================

export const ROLE_PERMISSIONS = {
    [ROLES.EMPLOYEE]: [
        PERMISSIONS.CREATE_TRAVEL_REQUEST,
        PERMISSIONS.VIEW_OWN_REQUESTS,
        PERMISSIONS.EDIT_OWN_REQUEST,
        PERMISSIONS.DELETE_OWN_REQUEST,
        PERMISSIONS.SUBMIT_REQUEST,
        PERMISSIONS.CANCEL_REQUEST,
        PERMISSIONS.UPLOAD_DOCUMENT,
        PERMISSIONS.VIEW_DOCUMENTS,
        PERMISSIONS.SUBMIT_EXPENSE,
        PERMISSIONS.VIEW_OWN_EXPENSES,
        PERMISSIONS.VIEW_BOOKINGS
    ],

    [ROLES.MANAGER]: [
        // Employee permissions
        ...ROLE_PERMISSIONS[ROLES.EMPLOYEE] || [],
        // Manager-specific permissions
        PERMISSIONS.VIEW_TEAM_REQUESTS,
        PERMISSIONS.APPROVE_AS_MANAGER,
        PERMISSIONS.REJECT_REQUEST,
        PERMISSIONS.DELEGATE_APPROVAL,
        PERMISSIONS.VIEW_APPROVAL_HISTORY,
        PERMISSIONS.VIEW_REPORTS
    ],

    [ROLES.AVP]: [
        // Manager permissions
        ...ROLE_PERMISSIONS[ROLES.MANAGER] || [],
        // AVP-specific permissions
        PERMISSIONS.APPROVE_AS_AVP,
        PERMISSIONS.VIEW_ALL_REQUESTS
    ],

    [ROLES.SVP]: [
        // AVP permissions
        ...ROLE_PERMISSIONS[ROLES.AVP] || [],
        // SVP-specific permissions
        PERMISSIONS.APPROVE_AS_SVP,
        PERMISSIONS.VIEW_ANALYTICS
    ],

    [ROLES.CHRO]: [
        // SVP permissions
        ...ROLE_PERMISSIONS[ROLES.SVP] || [],
        // CHRO-specific permissions
        PERMISSIONS.APPROVE_AS_CHRO,
        PERMISSIONS.VIEW_USERS
    ],

    [ROLES.TRAVEL_DESK]: [
        PERMISSIONS.VIEW_ALL_REQUESTS,
        PERMISSIONS.VIEW_APPROVAL_HISTORY,
        PERMISSIONS.CREATE_BOOKING,
        PERMISSIONS.VIEW_BOOKINGS,
        PERMISSIONS.CANCEL_BOOKING,
        PERMISSIONS.MODIFY_BOOKING,
        PERMISSIONS.UPLOAD_DOCUMENT,
        PERMISSIONS.VIEW_DOCUMENTS,
        PERMISSIONS.VERIFY_DOCUMENT,
        PERMISSIONS.VIEW_REPORTS
    ],

    [ROLES.FINANCE]: [
        PERMISSIONS.VIEW_ALL_REQUESTS,
        PERMISSIONS.VIEW_ALL_EXPENSES,
        PERMISSIONS.APPROVE_EXPENSE,
        PERMISSIONS.REJECT_EXPENSE,
        PERMISSIONS.PROCESS_REIMBURSEMENT,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.EXPORT_REPORTS,
        PERMISSIONS.VIEW_ANALYTICS
    ],

    [ROLES.ADMIN]: [
        // All permissions
        ...Object.values(PERMISSIONS)
    ]
};

// ============================================
// PERMISSION CHECKER FUNCTIONS
// ============================================

/**
 * Check if user has a specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (userRole, permission) => {
    if (!userRole || !permission) return false;
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {string} userRole - User's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - True if user has at least one permission
 */
export const hasAnyPermission = (userRole, permissions) => {
    if (!userRole || !permissions || !Array.isArray(permissions)) return false;
    return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has all specified permissions
 * @param {string} userRole - User's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export const hasAllPermissions = (userRole, permissions) => {
    if (!userRole || !permissions || !Array.isArray(permissions)) return false;
    return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a role
 * @param {string} userRole - User's role
 * @returns {string[]} - Array of permissions
 */
export const getRolePermissions = (userRole) => {
    return ROLE_PERMISSIONS[userRole] || [];
};

/**
 * Check if user can approve at a specific level
 * @param {string} userRole - User's role
 * @param {number} approvalLevel - Approval level (1-4)
 * @returns {boolean} - True if user can approve at this level
 */
export const canApproveAtLevel = (userRole, approvalLevel) => {
    const approvalPermissions = {
        1: PERMISSIONS.APPROVE_AS_MANAGER,
        2: PERMISSIONS.APPROVE_AS_AVP,
        3: PERMISSIONS.APPROVE_AS_SVP,
        4: PERMISSIONS.APPROVE_AS_CHRO
    };

    const requiredPermission = approvalPermissions[approvalLevel];
    return requiredPermission ? hasPermission(userRole, requiredPermission) : false;
};

/**
 * Check if user can access a specific route
 * @param {string} userRole - User's role
 * @param {string} route - Route path
 * @returns {boolean} - True if user can access route
 */
export const canAccessRoute = (userRole, route) => {
    // Public routes are accessible to all
    const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
    if (publicRoutes.includes(route)) return true;

    // Dashboard is accessible to all authenticated users
    if (route === '/dashboard') return true;

    // Admin routes
    if (route.startsWith('/dashboard/admin')) {
        return userRole === ROLES.ADMIN;
    }

    // Travel desk routes
    if (route.startsWith('/dashboard/bookings')) {
        return hasPermission(userRole, PERMISSIONS.VIEW_BOOKINGS);
    }

    // Approval routes
    if (route.startsWith('/dashboard/approvals')) {
        return hasAnyPermission(userRole, [
            PERMISSIONS.APPROVE_AS_MANAGER,
            PERMISSIONS.APPROVE_AS_AVP,
            PERMISSIONS.APPROVE_AS_SVP,
            PERMISSIONS.APPROVE_AS_CHRO
        ]);
    }

    // Finance routes
    if (route.startsWith('/dashboard/expenses')) {
        return hasAnyPermission(userRole, [
            PERMISSIONS.VIEW_OWN_EXPENSES,
            PERMISSIONS.VIEW_ALL_EXPENSES
        ]);
    }

    // Default: allow access
    return true;
};

export default {
    PERMISSIONS,
    ROLE_PERMISSIONS,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRolePermissions,
    canApproveAtLevel,
    canAccessRoute
};
