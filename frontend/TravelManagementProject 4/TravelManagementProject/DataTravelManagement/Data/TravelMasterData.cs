using DataTravelManagement.Context;
using DataTravelManagement.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Data
{
    public class TravelMasterData
    {
        private readonly TravelMasterContext _context;

        public TravelMasterData(TravelMasterContext context)
        {
            _context = context;
        }

        public List<TravelMaster> GetTravelDetailByEmpId(string empId)
        {
            return _context.TravelMasters.Where(u => u.EmpId == empId).ToList();
        }

        public TravelMaster GetTravelDetailByTId(int TId)
        {
            return _context.TravelMasters.Find(TId);
        }
        public List<TravelMaster> GetTravelDetailByRptId(string empId)
        {
            return _context.TravelMasters.Where(u => u.RptEmpId == empId).ToList();
        }

        public string InsertTravelDetail(List<TravelMaster> travel)
        {
            _context.TravelMasters.AddRange(travel);
            _context.SaveChanges();

            return "Inserted";

        }

        public string UpdateTravelStatus(int TId, int status)
        {
            var emp= _context.TravelMasters.Find(TId);
            emp.Status = status;
            _context.SaveChanges();

            return "Updated";

        }


        public List<TravelMaster> GetAllTravelDetails()
        {
            return _context.TravelMasters
                           .OrderByDescending(t => t.SuggestedDate)
                           .ThenByDescending(t => t.TId)
                           .ToList();
        }


    }
}
