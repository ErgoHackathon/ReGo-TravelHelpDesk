using DataTravelManagement.DTOModel;
using DataTravelManagement.Model;

namespace ServicesTravelManagement.Repository
{
    public interface IRepository
    {
        // Existing methods
        Response<List<RollMaster>> GetRollMasterData();
        Response<int> ValidateLogin(string username, string password);
        Response<Employee> GetEmployee(string id);
        Response<List<EmployeeByRptId>> GetEmployeesByRptId(string ID);

        Response<TravelMaster> GetTravelDetailByTId(int TId);
        Response<List<TravelMaster>> GetTravelDetailsByEmpId(string empId);
        Response<List<TravelMaster>> GetTravelDetailsByRptId(string empId);
        Response<string> InsertTravelDetail(List<TravelMaster> travel);
        Response<string> UpdateTravelStatus(int TId, int status);

        Response<List<DocumentMaster>> GetAllDocumentList();
        Response<byte[]> GetEmployeeDocument(string empId, int docId);
        Response<string> AddEmployeeDocument(string empId, int docId, byte[] document);

        Response<List<TravelMaster>> GetSvpEmployees(string RptSvpId);
        Response<List<TravelMaster>> GetAvpEmployees(string RptAvpId);

        Response<PassportInfoMaster> GetPassportInfo(string EmpId);
        Response<List<TravelMaster>> GetAllTravelDetails();

        // NEW: Document management methods
        Response<string> AddEmployeeDocumentWithMetadata(string empId, int docId, byte[] document, string fileType, string fileName, long? fileSize);
        Response<List<EmployeeDocumentListDTO>> GetAllEmployeeDocuments(string empId);
        Response<EmployeeDocumentFileDTO> GetEmployeeDocumentFile(string empId, int docId);
        Response<string> DeleteEmployeeDocument(string empId, int docId);
    }
}