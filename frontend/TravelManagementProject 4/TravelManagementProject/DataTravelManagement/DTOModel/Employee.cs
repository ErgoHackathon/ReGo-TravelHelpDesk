using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.DTOModel
{
    public class Employee
    {
        public string EmpId { get; set; }

        public string Name { get; set; }


        public string Email { get; set; }


        public string RptEmpId { get; set; }

    }
}
