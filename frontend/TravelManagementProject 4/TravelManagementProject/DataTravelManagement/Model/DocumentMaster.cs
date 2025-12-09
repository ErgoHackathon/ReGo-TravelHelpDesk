
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace DataTravelManagement.Model
{
    [Table("TMS_DocumentMaster")]
    public class DocumentMaster
    {
            [Key]
            public int DocumentID { get; set; }

            [Required]
            [StringLength(100)]
            public string DocumentName { get; set; }
        }
    }

