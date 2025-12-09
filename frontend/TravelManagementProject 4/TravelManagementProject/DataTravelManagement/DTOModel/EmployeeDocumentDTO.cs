using System;

namespace DataTravelManagement.DTOModel
{
    /// <summary>
    /// DTO for returning document list (without base64 content)
    /// </summary>
    public class EmployeeDocumentListDTO
    {
        public int EmpDocId { get; set; }
        public string EmpId { get; set; }
        public int DocumentID { get; set; }
        public string? FileType { get; set; }
        public string? FileName { get; set; }
        public long? FileSize { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    /// <summary>
    /// DTO for returning document with base64 content (for preview/download)
    /// </summary>
    public class EmployeeDocumentFileDTO
    {
        public int EmpDocId { get; set; }
        public string EmpId { get; set; }
        public int DocumentID { get; set; }
        public string? FileType { get; set; }
        public string? FileName { get; set; }
        public long? FileSize { get; set; }
        public string Base64String { get; set; } // Decrypted document as base64
        public DateTime? CreatedOn { get; set; }
    }
}