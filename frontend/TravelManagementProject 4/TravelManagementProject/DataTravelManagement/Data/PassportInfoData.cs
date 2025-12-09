using DataTravelManagement.Context;
using DataTravelManagement.Model;
using DataTravelManagement.Ocr;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Data
{
    public class PassportInfoData
    {
        private readonly PassportInfoMasterContext _passportContext;


        public PassportInfoData( PassportInfoMasterContext passportContext)
        {
            _passportContext = passportContext;
        }

        public PassportInfoMaster GetPassportInfo(string EmpId)
        {
            var info=_passportContext.PassportInfos.Find(EmpId);
            return info;
        }


    }
}
