using DataTravelManagement.Data;
using DataTravelManagement.DTOModel;
using DataTravelManagement.Model;
using ServicesTravelManagement.Repository;

namespace ServicesTravelManagement.Services
{
    public class Service : IRepository
    {
        private readonly RollMasterData _rollData;
        private readonly LoginMasterData _LoginData;
        private readonly EmployeeMasterData _EmployeeData;
        private readonly TravelMasterData _TravelData;
        private readonly DocumentMasterData _DocumentData;
        private readonly EmployeeDocumentData _EmployeeDocumentData;
        private readonly DashboardData _DashboardData;
        private readonly PassportInfoData _PassportData;

        public Service(
            RollMasterData rollData,
            LoginMasterData LoginData,
            EmployeeMasterData EmployeeData,
            TravelMasterData TravelData,
            DocumentMasterData DocumentData,
            EmployeeDocumentData EmployeeDocumentData,
            DashboardData DashboardData,
            PassportInfoData PassportData)
        {
            _rollData = rollData;
            _LoginData = LoginData;
            _EmployeeData = EmployeeData;
            _TravelData = TravelData;
            _DocumentData = DocumentData;
            _EmployeeDocumentData = EmployeeDocumentData;
            _DashboardData = DashboardData;
            _PassportData = PassportData;
        }

        public Response<List<RollMaster>> GetRollMasterData()
        {
            var rolls = _rollData.GetAllRolls();
            return new Response<List<RollMaster>>
            {
                Status = rolls == null ? "Technical Failure" : "Success",
                Result = rolls
            };
        }

        public Response<int> ValidateLogin(string username, string password)
        {
            var user = _LoginData.GetByIdorEmail(username);
            return new Response<int>
            {
                Status = user != null && user.Password == password ? "Success" : "Functional Failure",
                Result = user == null || user.Password != password ? 0 : user.RefRoleId
            };
        }

        public Response<Employee> GetEmployee(string id)
        {
            var emp = _EmployeeData.GetByIdorEmail(id);
            var employee = new Employee
            {
                EmpId = emp.EmpId,
                Name = emp.Name,
                Email = emp.Email,
                RptEmpId = emp.RptEmpId
            };
            return new Response<Employee>
            {
                Status = employee == null ? "Functional Failure" : "Success",
                Result = employee
            };
        }

        public Response<List<EmployeeByRptId>> GetEmployeesByRptId(string ID)
        {
            var employees = _EmployeeData.GetEmployeesByRptId(ID);
            var emp = new List<EmployeeByRptId>();

            foreach (var e in employees)
            {
                emp.Add(new EmployeeByRptId
                {
                    EmpId = e.EmpId,
                    Name = e.Name,
                    Email = e.Email
                });
            }

            return new Response<List<EmployeeByRptId>>
            {
                Status = emp == null || emp.Count == 0 ? "Functional Failure" : "Success",
                Result = emp
            };
        }

        public Response<List<TravelMaster>> GetTravelDetailsByEmpId(string empId)
        {
            var travels = _TravelData.GetTravelDetailByEmpId(empId);
            return new Response<List<TravelMaster>>
            {
                Status = travels == null ? "Functional Failure" : "Success",
                Result = travels
            };
        }

        public Response<TravelMaster> GetTravelDetailByTId(int TId)
        {
            var travel = _TravelData.GetTravelDetailByTId(TId);
            return new Response<TravelMaster>
            {
                Status = travel == null ? "Functional Failure" : "Success",
                Result = travel
            };
        }

        public Response<List<TravelMaster>> GetTravelDetailsByRptId(string empId)
        {
            var travels = _TravelData.GetTravelDetailByRptId(empId);
            return new Response<List<TravelMaster>>
            {
                Status = travels == null || travels.Count == 0 ? "Functional Failure" : "Success",
                Result = travels
            };
        }

        public Response<string> InsertTravelDetail(List<TravelMaster> travel)
        {
            var result = _TravelData.InsertTravelDetail(travel);
            return new Response<string>
            {
                Status = result == "Inserted" ? "Success" : "Functional Failure",
                Result = result
            };
        }

        public Response<string> UpdateTravelStatus(int TId, int status)
        {
            var result = _TravelData.UpdateTravelStatus(TId, status);
            return new Response<string>
            {
                Status = result == "Updated" ? "Success" : "Functional Failure",
                Result = result
            };
        }

        public Response<List<DocumentMaster>> GetAllDocumentList()
        {
            var documents = _DocumentData.GetAllDocumentsList();
            return new Response<List<DocumentMaster>>
            {
                Status = documents == null || documents.Count == 0 ? "Technical Failure" : "Success",
                Result = documents
            };
        }

        // Existing method (backward compatibility)
        public Response<byte[]> GetEmployeeDocument(string empId, int docId)
        {
            var document = _EmployeeDocumentData.GetDocument(empId, docId);
            return new Response<byte[]>
            {
                Status = document == null ? "Functional Failure" : "Success",
                Result = document
            };
        }

        // Existing method (backward compatibility)
        public Response<string> AddEmployeeDocument(string empId, int docId, byte[] document)
        {
            var result = _EmployeeDocumentData.AddDocument(empId, docId, document);
            return new Response<string>
            {
                Status = result == "Document added successfully." || result == "Document updated successfully." ? "Success" : "Functional Failure",
                Result = result
            };
        }

        // ==========================================
        // NEW METHODS FOR DOCUMENT MANAGEMENT
        // ==========================================

        /// <summary>
        /// Add document with file metadata (FileType, FileName, FileSize)
        /// </summary>
        public Response<string> AddEmployeeDocumentWithMetadata(string empId, int docId, byte[] document, string fileType, string fileName, long? fileSize)
        {
            var result = _EmployeeDocumentData.AddDocument(empId, docId, document, fileType, fileName, fileSize);
            return new Response<string>
            {
                Status = result.Contains("successfully") ? "Success" : "Functional Failure",
                Result = result
            };
        }

        /// <summary>
        /// Get list of all uploaded documents for an employee (without base64 content)
        /// </summary>
        public Response<List<EmployeeDocumentListDTO>> GetAllEmployeeDocuments(string empId)
        {
            var documents = _EmployeeDocumentData.GetAllDocumentsByEmpId(empId);
            return new Response<List<EmployeeDocumentListDTO>>
            {
                Status = "Success",
                Result = documents ?? new List<EmployeeDocumentListDTO>()
            };
        }

        /// <summary>
        /// Get document file with base64 content (for preview/download)
        /// </summary>
        public Response<EmployeeDocumentFileDTO> GetEmployeeDocumentFile(string empId, int docId)
        {
            var document = _EmployeeDocumentData.GetDocumentWithMetadata(empId, docId);
            return new Response<EmployeeDocumentFileDTO>
            {
                Status = document == null ? "Functional Failure" : "Success",
                Result = document
            };
        }

        /// <summary>
        /// Delete employee document
        /// </summary>
        public Response<string> DeleteEmployeeDocument(string empId, int docId)
        {
            var result = _EmployeeDocumentData.DeleteDocument(empId, docId);
            return new Response<string>
            {
                Status = result == "Document deleted successfully." ? "Success" : "Functional Failure",
                Result = result
            };
        }

        // ==========================================
        // END NEW METHODS
        // ==========================================

        public Response<List<TravelMaster>> GetSvpEmployees(string RptSvpId)
        {
            var travels = _DashboardData.GetSvpEmployees(RptSvpId);
            return new Response<List<TravelMaster>>
            {
                Status = travels == null || travels.Count == 0 ? "Functional Failure" : "Success",
                Result = travels
            };
        }

        public Response<List<TravelMaster>> GetAvpEmployees(string RptAvpId)
        {
            var travels = _DashboardData.GetAvpEmployees(RptAvpId);
            return new Response<List<TravelMaster>>
            {
                Status = travels == null || travels.Count == 0 ? "Functional Failure" : "Success",
                Result = travels
            };
        }

        public Response<PassportInfoMaster> GetPassportInfo(string EmpId)
        {
            var passportInfo = _PassportData.GetPassportInfo(EmpId);
            return new Response<PassportInfoMaster>
            {
                Status = passportInfo == null ? "Functional Failure" : "Success",
                Result = passportInfo
            };
        }

        public Response<List<TravelMaster>> GetAllTravelDetails()
        {
            var travels = _TravelData.GetAllTravelDetails();
            return new Response<List<TravelMaster>>
            {
                Status = travels == null || travels.Count == 0 ? "Functional Failure" : "Success",
                Result = travels
            };
        }
    }
}