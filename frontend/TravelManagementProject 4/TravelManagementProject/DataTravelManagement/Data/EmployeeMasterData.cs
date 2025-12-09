using DataTravelManagement.Context;
using DataTravelManagement.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Data
{
    public class EmployeeMasterData
    {
        private readonly EmployeeMasterContext _context;

        public EmployeeMasterData(EmployeeMasterContext context)
        {
            _context = context;
        }

        public EmployeeMaster GetByIdorEmail(string detail)
        {
            EmployeeMaster user;

            if (int.TryParse(detail, out int id))
            {
                user = _context.EmployeeMasters.Find(detail);
            }
            else
            {
                user = _context.EmployeeMasters.FirstOrDefault(u => u.Email == detail);

            }
            return user;
        }
        public List<EmployeeMaster> GetEmployeesByRptId(string id)
        {
            return _context.EmployeeMasters.Where(u => u.RptEmpId == id).ToList();
            
        }
    }
}
