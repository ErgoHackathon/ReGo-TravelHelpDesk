using DataTravelManagement.Context;
using DataTravelManagement.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Data
{
    public class DashboardData
    {
        private readonly EmployeeMasterContext _Employeecontext;

        private readonly TravelMasterContext _Travelcontext;

        public DashboardData(EmployeeMasterContext Employeecontext, TravelMasterContext Travelcontext)
        {
            _Employeecontext= Employeecontext;
            _Travelcontext = Travelcontext;
        }


        public List<TravelMaster> GetSvpEmployees(string RptSvpId)
        {
            var svpEmpIds = _Employeecontext.EmployeeMasters
                .Where(e => e.RptSvpId == RptSvpId)
                .Select(e => e.EmpId)
                .ToList();
            var travelDetails = _Travelcontext.TravelMasters
                .Where(t => svpEmpIds.Contains(t.EmpId))
                .ToList();
            return travelDetails;
        }

        public List<TravelMaster> GetAvpEmployees(string RptAvpId)
        {
            var avpEmpids= _Employeecontext.EmployeeMasters
                .Where(e => e.RptAvpId == RptAvpId)
                .Select(e => e.EmpId) .ToList();

            var travelDetails= _Travelcontext.TravelMasters
                .Where(t => avpEmpids.Contains(t.EmpId))
                .ToList();
            return travelDetails;

        }

        }
}
