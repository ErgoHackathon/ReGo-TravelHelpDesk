using DataTravelManagement.Context;
using DataTravelManagement.Model;


namespace DataTravelManagement.Data
{
    public class DocumentMasterData
    {
        private readonly DocumentMasterContext _context;

        public DocumentMasterData(DocumentMasterContext context)
        {
            _context = context;
        }


        public List<DocumentMaster> GetAllDocumentsList()
        {
            return _context.DocumentMasters.ToList();
        }
    }
}
