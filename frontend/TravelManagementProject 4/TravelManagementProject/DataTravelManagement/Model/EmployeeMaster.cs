
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataTravelManagement.Model
{
    [Table("TMS_EmployeeMaster")]
    public class EmployeeMaster
    {
        [Key]
        public string EmpId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }


        public string? RptEmpId { get; set; }

        public string? RptAvpId { get; set; }

        public string? RptSvpId { get; set; }

        public int RefRoleId { get; set; }


        public DateTime? CreatedOn { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public string? UpdatedBy { get; set; }

    }
}
