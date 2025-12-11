// /**
//  * Mock API - All mock data centralized here
//  * Returns SAME structure as real backend
//  */

// // ============================================
// // PERSISTED STORAGE HELPERS
// // ============================================

// const loadFromStorage = (key, defaultValue = []) => {
//   try {
//     const data = localStorage.getItem(key);
//     return data ? JSON.parse(data) : defaultValue;
//   } catch (e) {
//     return defaultValue;
//   }
// };

// const saveToStorage = (key, data) => {
//   try {
//     localStorage.setItem(key, JSON.stringify(data));
//   } catch (e) {
//     console.warn('Could not save to localStorage');
//   }
// };

// // ============================================
// // MOCK DATABASE
// // ============================================

// const mockDB = {
//   employees: [
//     { empId: '787', name: 'Abhishek Kumar', email: 'abhishek.kumar@demo.com', rptEmpId: '828', refRoleId: 101, password: 'Pass@123' },
//     { empId: '828', name: 'Sneha Patel', email: 'sneha.patel@demo.com', rptEmpId: '2', refRoleId: 102, password: 'Sneha@123' },
//     { empId: '2', name: 'Akash Kumar', email: 'akash.kumar@demo.com', rptEmpId: '1', refRoleId: 105, password: 'Akash@123' },
//     { empId: '128', name: 'Rahul Mehta', email: 'rahul.mehta@demo.com', rptEmpId: '600', refRoleId: 104, password: 'Rahul@123' },
//     { empId: '436', name: 'Priya Sharma', email: 'priya.sharma@demo.com', rptEmpId: '128', refRoleId: 101, password: 'Priya@123' },
//     { empId: '320', name: 'Vikram Singh', email: 'vikram.singh@demo.com', rptEmpId: '', refRoleId: 103, password: 'Vikram@123' },
//   ],

//   travels: [
//     { empId: '787', country: 'Germany', city: 'Berlin', remark: 'Client meeting', suggestedDate: '2025-11-28T00:00:00', travelStartDate: '2025-12-01T00:00:00', travelEndDate: '2025-12-05T00:00:00', status: 2, rptEmpId: '828' },
//     { empId: '436', country: 'Germany', city: 'Munich', remark: 'Project kickoff', suggestedDate: '2025-11-27T00:00:00', travelStartDate: '2025-12-10T00:00:00', travelEndDate: '2025-12-20T00:00:00', status: 1, rptEmpId: '128' },
//     { empId: '828', country: 'USA', city: 'New York', remark: 'Annual conference', suggestedDate: '2025-11-25T00:00:00', travelStartDate: '2025-12-15T00:00:00', travelEndDate: '2025-12-20T00:00:00', status: 0, rptEmpId: '2' },
//   ],

//   documents: [
//     { documentID: 1, documentName: 'Passport' },
//     { documentID: 2, documentName: 'Invitation Letter' },
//     { documentID: 3, documentName: 'Cover Letter' },
//     { documentID: 4, documentName: 'KT plan' },
//     { documentID: 5, documentName: 'Hotel Booking' },
//     { documentID: 6, documentName: 'Flight Booking' },
//     { documentID: 7, documentName: 'Travel Insurance' },
//     { documentID: 8, documentName: 'Visa Form' },
//     { documentID: 9, documentName: 'Letter of Intent' },
//   ],

//   roles: [
//     { rollID: 101, rollName: 'Employee' },
//     { rollID: 102, rollName: 'Manager' },
//     { rollID: 103, rollName: 'Helpdesk' },
//     { rollID: 104, rollName: 'DVP/AVP' },
//     { rollID: 105, rollName: 'SVP' },
//   ],

//   // ✅ Load from localStorage (persisted)
//   employeeDocuments: loadFromStorage('mockEmployeeDocuments', [])
// };

// // Simulate API delay
// const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// // ============================================
// // MOCK API FUNCTIONS
// // ============================================

// const mockApi = {
//   // POST /api/LoginRequest
//   login: async (username, password) => {
//     await delay(500);
//     console.log('🔵 MOCK: POST /api/LoginRequest');

//     const employee = mockDB.employees.find(
//       e => e.email.toLowerCase() === username.toLowerCase() && e.password === password
//     );

//     return employee
//       ? { status: 'Success', result: employee.refRoleId }
//       : { status: 'Failure', result: null };
//   },

//   // POST /api/employee/GetEmployeeData
//   getEmployeeData: async (idOrEmail) => {
//     await delay(300);
//     console.log('🔵 MOCK: POST /api/employee/GetEmployeeData');

//     const employee = mockDB.employees.find(
//       e => e.empId === idOrEmail || e.email.toLowerCase() === idOrEmail.toLowerCase()
//     );

//     return employee
//       ? { status: 'Success', result: { empId: employee.empId, name: employee.name, email: employee.email, rptEmpId: employee.rptEmpId } }
//       : { status: 'Functional Failure', result: null };
//   },

//   // POST /api/employee/TravelDetailByEmpId?id=xxx
//   getTravelDetailByEmpId: async (empId) => {
//     await delay(300);
//     console.log('🔵 MOCK: POST /api/employee/TravelDetailByEmpId?id=' + empId);

//     const travel = mockDB.travels.find(t => t.empId === empId);

//     return travel
//       ? { status: 'Success', result: travel }
//       : { status: 'Functional Failure', result: null };
//   },

//   // POST /api/manager/GetEmployeesByRptId
//   getEmployeesByRptId: async (managerId) => {
//     await delay(300);
//     console.log('🔵 MOCK: POST /api/manager/GetEmployeesByRptId');

//     const team = mockDB.employees.filter(e => e.rptEmpId === managerId);

//     return team.length > 0
//       ? { status: 'Success', result: team.map(e => ({ empId: e.empId, name: e.name, email: e.email })) }
//       : { status: 'Functional Failure', result: [] };
//   },

//   // POST /api/manager/TravelDetailByRptId
//   getTravelDetailByRptId: async (managerId) => {
//     await delay(300);
//     console.log('🔵 MOCK: POST /api/manager/TravelDetailByRptId');

//     const travels = mockDB.travels.filter(t => t.rptEmpId === managerId);

//     return travels.length > 0
//       ? { status: 'Success', result: travels }
//       : { status: 'Functional Failure', result: [] };
//   },

//   // POST /api/manager/InsertTravelDetail
//   insertTravelDetail: async (travelData) => {
//     await delay(500);
//     console.log('🔵 MOCK: POST /api/manager/InsertTravelDetail');

//     mockDB.travels.push(travelData);

//     return { status: 'Success', result: 'Inserted' };
//   },

//   // POST /api/UpdateTravelStatus
//   updateTravelStatus: async (empId, status) => {
//     await delay(400);
//     console.log('🔵 MOCK: POST /api/UpdateTravelStatus');

//     const travel = mockDB.travels.find(t => t.empId === empId);
//     if (travel) travel.status = status;

//     return { status: 'Success', result: 'Updated' };
//   },

//   // GET /api/GetAllDocumentsList
//   getAllDocumentsList: async () => {
//     await delay(300);
//     console.log('🔵 MOCK: GET /api/GetAllDocumentsList');

//     return { status: 'Success', result: mockDB.documents };
//   },

//   // ✅ POST /api/employee/AddDocument - WITH VERIFICATION
//   addDocument: async (empId, documentId, document) => {
//     await delay(800);
//     console.log('🔵 MOCK: POST /api/employee/AddDocument');

//     // Find document name
//     const docType = mockDB.documents.find(d => d.documentID === documentId);

//     const newDoc = {
//       empDocId: Date.now(),
//       empId: empId,
//       documentId: documentId,
//       documentName: docType?.documentName || 'Unknown',
//       documentSize: document.length,
//       documentPreview: document.substring(0, 100) + '...',
//       createdOn: new Date().toISOString(),
//       status: 'UPLOADED'
//     };

//     // Add to array
//     mockDB.employeeDocuments.push(newDoc);

//     // ✅ Persist to localStorage
//     saveToStorage('mockEmployeeDocuments', mockDB.employeeDocuments);

//     // ✅ Log for verification
//     console.log('✅ Document SAVED:', {
//       empId: newDoc.empId,
//       documentId: newDoc.documentId,
//       documentName: newDoc.documentName,
//       size: newDoc.documentSize + ' bytes',
//       createdOn: newDoc.createdOn
//     });

//     console.log('📁 Total documents for employee ' + empId + ':', 
//       mockDB.employeeDocuments.filter(d => d.empId === empId).length
//     );

//     return { status: 'Success', result: 'Document Added' };
//   },

//   // ✅ POST /api/employee/UpdateDocument - WITH VERIFICATION
//   updateDocument: async (empId, documentId, document) => {
//     await delay(800);
//     console.log('🔵 MOCK: POST /api/employee/UpdateDocument');

//     const index = mockDB.employeeDocuments.findIndex(
//       d => d.empId === empId && d.documentId === documentId
//     );

//     const docType = mockDB.documents.find(d => d.documentID === documentId);

//     if (index !== -1) {
//       // Update existing
//       mockDB.employeeDocuments[index] = {
//         ...mockDB.employeeDocuments[index],
//         documentSize: document.length,
//         documentPreview: document.substring(0, 100) + '...',
//         updatedOn: new Date().toISOString(),
//         status: 'UPDATED'
//       };
//       console.log('✅ Document UPDATED:', mockDB.employeeDocuments[index]);
//     } else {
//       // Add new if not exists
//       const newDoc = {
//         empDocId: Date.now(),
//         empId: empId,
//         documentId: documentId,
//         documentName: docType?.documentName || 'Unknown',
//         documentSize: document.length,
//         documentPreview: document.substring(0, 100) + '...',
//         createdOn: new Date().toISOString(),
//         status: 'UPLOADED'
//       };
//       mockDB.employeeDocuments.push(newDoc);
//       console.log('✅ Document ADDED:', newDoc);
//     }

//     // ✅ Persist to localStorage
//     saveToStorage('mockEmployeeDocuments', mockDB.employeeDocuments);

//     return { status: 'Success', result: 'Document Updated' };
//   },

//   // ✅ POST /api/HelpDesk/GetEmployeeDocuments - Get uploaded document
//   getEmployeeDocuments: async (empId, docId) => {
//     await delay(300);
//     console.log('🔵 MOCK: POST /api/HelpDesk/GetEmployeeDocuments');

//     const doc = mockDB.employeeDocuments.find(
//       d => d.empId === empId && d.documentId === docId
//     );

//     console.log('📄 Found document:', doc ? 'Yes' : 'No');

//     return doc
//       ? { status: 'Success', result: doc }
//       : { status: 'Functional Failure', result: null };
//   },

//   // ✅ NEW: Get all documents for an employee
//   getEmployeeAllDocuments: async (empId) => {
//     await delay(300);
//     console.log('🔵 MOCK: GET all documents for employee:', empId);

//     const docs = mockDB.employeeDocuments.filter(d => d.empId === empId);

//     console.log('📁 Found', docs.length, 'documents for employee', empId);

//     return { status: 'Success', result: docs };
//   },

//   // GET /api/GetRollMaster
//   getRollMaster: async () => {
//     await delay(200);
//     console.log('🔵 MOCK: GET /api/GetRollMaster');

//     return { status: 'Success', result: mockDB.roles };
//   }
// };

// export default mockApi;
// export { mockDB };