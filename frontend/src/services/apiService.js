/**
 * API Service - Single entry point
 * Automatically switches between mock and real API
 */

import apiConfig from '../config/apiConfig';  // ✅ Correct path
import mockApi from './api/mockApi';          // ✅ Correct path
import realApi from './api/realApi';          // ✅ Correct path

// One line switch!
const api = apiConfig.USE_MOCK_API ? mockApi : realApi;

// DEBUG: Confirm which API is being used
console.log('🔧 API SERVICE:', {
    USE_MOCK_API: apiConfig.USE_MOCK_API,
    usingAPI: apiConfig.USE_MOCK_API ? 'MOCK API' : 'REAL API'
});

export default api;