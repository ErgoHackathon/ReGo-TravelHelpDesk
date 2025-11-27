// Mock Data Service - Simulates backend API responses
// This will be replaced with real API calls later

// Mock users database (for testing login)
const mockUsers = {
  // Employee
  'employee@company.com': {
    email: 'employee@company.com',
    password: 'Test123!', // In real app, this would be hashed
    user: {
      id: '1',
      email: 'employee@company.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'EMPLOYEE',
      department: 'Engineering',
      employeeId: 'EMP001',
      phone: '+91 9876543210',
      isActive: true
    }
  },
  // Manager/AVP (combined)
  'manager@company.com': {
    email: 'manager@company.com',
    password: 'Test123!',
    user: {
      id: '2',
      email: 'manager@company.com',
      firstName: 'Sarah',
      lastName: 'Smith',
      role: 'MANAGER',
      department: 'Engineering',
      employeeId: 'MGR001',
      phone: '+91 9876543211',
      isActive: true
    }
  },
  'avp@company.com': {
    email: 'avp@company.com',
    password: 'Test123!',
    user: {
      id: '3',
      email: 'avp@company.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'AVP',
      department: 'Operations',
      employeeId: 'AVP001',
      phone: '+91 9876543212',
      isActive: true
    }
  },
  // SVP/CHRO/Finance (combined)
  'svp@company.com': {
    email: 'svp@company.com',
    password: 'Test123!',
    user: {
      id: '4',
      email: 'svp@company.com',
      firstName: 'Lisa',
      lastName: 'Brown',
      role: 'SVP',
      department: 'Operations',
      employeeId: 'SVP001',
      phone: '+91 9876543213',
      isActive: true
    }
  },
  'chro@company.com': {
    email: 'chro@company.com',
    password: 'Test123!',
    user: {
      id: '5',
      email: 'chro@company.com',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'CHRO',
      department: 'HR',
      employeeId: 'CHRO001',
      phone: '+91 9876543214',
      isActive: true
    }
  },
  'finance@company.com': {
    email: 'finance@company.com',
    password: 'Test123!',
    user: {
      id: '6',
      email: 'finance@company.com',
      firstName: 'Emily',
      lastName: 'Davis',
      role: 'FINANCE',
      department: 'Finance',
      employeeId: 'FIN001',
      phone: '+91 9876543215',
      isActive: true
    }
  },
  // Admin/Travel Desk (combined)
  'admin@company.com': {
    email: 'admin@company.com',
    password: 'Test123!',
    user: {
      id: '7',
      email: 'admin@company.com',
      firstName: 'Alex',
      lastName: 'Taylor',
      role: 'ADMIN',
      department: 'Admin',
      employeeId: 'ADM001',
      phone: '+91 9876543216',
      isActive: true
    }
  },
  'traveldesk@company.com': {
    email: 'traveldesk@company.com',
    password: 'Test123!',
    user: {
      id: '8',
      email: 'traveldesk@company.com',
      firstName: 'Travel',
      lastName: 'Coordinator',
      role: 'TRAVEL_DESK',
      department: 'Admin',
      employeeId: 'TD001',
      phone: '+91 9876543217',
      isActive: true
    }
  }
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
const mockDataService = {
  /**
   * Mock Login
   */
  login: async (credentials) => {
    await delay(800); // Simulate network delay

    const { email, password } = credentials;
    const mockUser = mockUsers[email.toLowerCase()];

    if (!mockUser) {
      throw {
        response: {
          data: {
            success: false,
            error: { message: 'Invalid email or password' }
          }
        }
      };
    }

    if (mockUser.password !== password) {
      throw {
        response: {
          data: {
            success: false,
            error: { message: 'Invalid email or password' }
          }
        }
      };
    }

    // Generate mock tokens
    const mockToken = `mock_token_${Date.now()}`;
    const mockRefreshToken = `mock_refresh_${Date.now()}`;

    return {
      data: {
        success: true,
        data: {
          user: mockUser.user,
          token: mockToken,
          refreshToken: mockRefreshToken
        },
        message: 'Login successful'
      }
    };
  },

  /**
   * Mock Register (for future use)
   */
  register: async (userData) => {
    await delay(1000);
    
    // Check if user already exists
    if (mockUsers[userData.email.toLowerCase()]) {
      throw {
        response: {
          data: {
            success: false,
            error: { message: 'User already exists' }
          }
        }
      };
    }

    const newUser = {
      id: `${Date.now()}`,
      ...userData,
      isActive: true,
      employeeId: `EMP${Math.floor(Math.random() * 1000)}`
    };

    const mockToken = `mock_token_${Date.now()}`;
    const mockRefreshToken = `mock_refresh_${Date.now()}`;

    return {
      data: {
        success: true,
        data: {
          user: newUser,
          token: mockToken,
          refreshToken: mockRefreshToken
        },
        message: 'Registration successful'
      }
    };
  },

  /**
   * Mock Get Profile
   */
  getProfile: async () => {
    await delay(500);

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw {
        response: {
          data: {
            success: false,
            error: { message: 'Not authenticated' }
          }
        }
      };
    }

    return {
      data: {
        success: true,
        data: JSON.parse(userStr)
      }
    };
  },

  /**
   * Mock Logout
   */
  logout: async () => {
    await delay(300);
    return {
      data: {
        success: true,
        message: 'Logged out successfully'
      }
    };
  }
};

export default mockDataService;

// Export mock users for reference
export { mockUsers };