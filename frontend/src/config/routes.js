/**
 * Route Configuration
 * Centralized route constants for the application
 */

export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',

    // Dashboard routes
    DASHBOARD: '/dashboard',

    // Travel Request routes
    TRAVEL_REQUESTS: '/dashboard/travel-requests',
    CREATE_TRAVEL_REQUEST: '/dashboard/travel-requests/create',
    VIEW_TRAVEL_REQUEST: '/dashboard/travel-requests/:id',
    EDIT_TRAVEL_REQUEST: '/dashboard/travel-requests/:id/edit',

    // Approval routes
    APPROVALS: '/dashboard/approvals',
    PENDING_APPROVALS: '/dashboard/approvals/pending',
    APPROVAL_HISTORY: '/dashboard/approvals/history',

    // Document routes
    DOCUMENTS: '/dashboard/documents',
    UPLOAD_DOCUMENT: '/dashboard/documents/upload',

    // Booking routes
    BOOKINGS: '/dashboard/bookings',
    VIEW_BOOKING: '/dashboard/bookings/:id',

    // Expense routes
    EXPENSES: '/dashboard/expenses',
    CREATE_EXPENSE: '/dashboard/expenses/create',
    VIEW_EXPENSE: '/dashboard/expenses/:id',

    // Profile routes
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',

    // Admin routes
    USERS: '/dashboard/admin/users',
    REPORTS: '/dashboard/admin/reports',
    SYSTEM_CONFIG: '/dashboard/admin/config'
};

/**
 * Build route with parameters
 * @param {string} route - Route template
 * @param {object} params - Parameters to replace
 * @returns {string} - Built route
 */
export const buildRoute = (route, params = {}) => {
    let builtRoute = route;
    Object.keys(params).forEach(key => {
        builtRoute = builtRoute.replace(`:${key}`, params[key]);
    });
    return builtRoute;
};

/**
 * Check if route is public (doesn't require authentication)
 * @param {string} pathname - Current pathname
 * @returns {boolean} - True if public route
 */
export const isPublicRoute = (pathname) => {
    const publicRoutes = [
        ROUTES.HOME,
        ROUTES.LOGIN,
        ROUTES.REGISTER,
        ROUTES.FORGOT_PASSWORD,
        ROUTES.RESET_PASSWORD
    ];
    return publicRoutes.includes(pathname);
};

/**
 * Get route name from pathname
 * @param {string} pathname - Current pathname
 * @returns {string} - Route name
 */
export const getRouteName = (pathname) => {
    const routeNames = {
        [ROUTES.HOME]: 'Home',
        [ROUTES.LOGIN]: 'Login',
        [ROUTES.REGISTER]: 'Register',
        [ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
        [ROUTES.DASHBOARD]: 'Dashboard',
        [ROUTES.TRAVEL_REQUESTS]: 'Travel Requests',
        [ROUTES.CREATE_TRAVEL_REQUEST]: 'Create Travel Request',
        [ROUTES.APPROVALS]: 'Approvals',
        [ROUTES.PENDING_APPROVALS]: 'Pending Approvals',
        [ROUTES.APPROVAL_HISTORY]: 'Approval History',
        [ROUTES.DOCUMENTS]: 'Documents',
        [ROUTES.BOOKINGS]: 'Bookings',
        [ROUTES.EXPENSES]: 'Expenses',
        [ROUTES.PROFILE]: 'Profile',
        [ROUTES.SETTINGS]: 'Settings',
        [ROUTES.USERS]: 'User Management',
        [ROUTES.REPORTS]: 'Reports'
    };

    return routeNames[pathname] || 'Unknown';
};

export default ROUTES;
