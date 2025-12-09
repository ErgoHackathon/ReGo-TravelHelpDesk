using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Model
{
    [Table("TMS_PassportInfoMaster")]
    public class PassportInfoMaster
    {

        [Key]                              
        public string EmpId { get; set; } 

        public string? Issuer  { get; set; }


        public string? FullName { get; set; } 

        public string? PassportNumber { get; set; } 

        public string? Nationality { get; set; } 

       
        public DateTime? DateOfBirth { get; set; } 

        public char? Sex { get; set; } 

       
        public DateTime? ExpiryDate { get; set; } 

        public bool? CompositeCheck { get; set; } 
    }
}

