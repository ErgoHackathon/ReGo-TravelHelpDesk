using DataTravelManagement.Context;
using DataTravelManagement.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Data
{
    public class RollMasterData
    {

        private readonly RollMasterContext _context;

        public RollMasterData(RollMasterContext context)
        {
            _context = context;
        }
        public List<RollMaster> GetAllRolls()
        {
            return _context.RollMasters.ToList();
        }
    }
}
