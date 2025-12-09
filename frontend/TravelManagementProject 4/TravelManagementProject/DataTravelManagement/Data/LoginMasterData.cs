using DataTravelManagement.Context;
using DataTravelManagement.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Data
{
    public class LoginMasterData
    {
        private readonly LoginMasterContext _context;

        public LoginMasterData(LoginMasterContext context)
        {
            _context = context;
        }

        public List<LoginMaster> GetAllLogins()
        {
            return _context.LoginMasters.ToList();
        }

        public LoginMaster GetByEmail(string email)
        {
            return _context.LoginMasters.FirstOrDefault(u => u.Email == email);
        }
        public LoginMaster GetByEmpId(string empId)
        {
            return _context.LoginMasters.Find(empId);
        }
        public LoginMaster GetByIdorEmail(string detail)
        {
            LoginMaster user;

            if (int.TryParse(detail, out int id))
            {
                user = _context.LoginMasters.Find(detail);
            }
            else
            {
                user = _context.LoginMasters.FirstOrDefault(u => u.Email == detail);

            }
           return user;
        }
       
     
    }
}
