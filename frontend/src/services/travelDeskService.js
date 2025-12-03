/**
 * Travel Desk Service
 * Handles all travel desk booking-related API calls
 * Matches ReGo_Backend_API_and_DB_Spec_v1.md
 */

import apiClient from '../api/client';
import apiConfig, { ENDPOINTS } from '../config/apiConfig';

/**
 * Create/update booking for a travel request
 * @param {object} bookingData - { requestId, flightNumber, hotelName, ticketUrl }
 * @returns {Promise<object>} - { status }
 */
export const createBooking = async (bookingData) => {
    if (apiConfig.USE_MOCK_API) {
        console.log('🔵 Using MOCK API for createBooking');
        return {
            status: 'BOOKED'
        };
    }

    console.log('🟢 Using REAL API for createBooking');
    const response = await apiClient.post(ENDPOINTS.TRAVEL_BOOK, bookingData);
    return response.data;
};

const travelDeskService = {
    createBooking
};

export default travelDeskService;
