using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataTravelManagement.Model
{
    [Table("TMS_EmployeeDocumentMaster")]
    public class EmployeeDocumentMaster
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmpDocId { get; set; }

        [Required]
        [StringLength(50)]
        public string EmpId { get; set; }

        [Required]
        public int DocumentID { get; set; }

        [Required]
        public byte[] Document { get; set; }

        // NEW: File metadata columns
        [StringLength(100)]
        public string? FileType { get; set; }

        [StringLength(255)]
        public string? FileName { get; set; }

        public long? FileSize { get; set; }

        public DateTime? CreatedOn { get; set; }

        [StringLength(50)]
        public string? CreatedBy { get; set; }

        public DateTime? UpdatedOn { get; set; }

        [StringLength(50)]
        public string? UpdatedBy { get; set; }
    }
}