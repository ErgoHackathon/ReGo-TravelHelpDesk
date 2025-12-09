
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace DataTravelManagement.Model
{
    [Table("TMS_TravelMaster")]
    public class TravelMaster
    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int TId { get; set; }


        [Required]
        public string EmpId { get; set; }

       

        [Required]
        [StringLength(100)]
        public string Country { get; set; }

        [Required]
        [StringLength(100)]
        public string City { get; set; }

        [StringLength(500)]
        public string Remark { get; set; }

        [Column(TypeName = "date")]
        public DateTime SuggestedDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime TravelStartDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime TravelEndDate { get; set; }


        public int Status { get; set; }

        [Required]
        public string RptEmpId { get; set; }
    }
}

