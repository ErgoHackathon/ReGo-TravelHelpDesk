using DataTravelManagement.Context;
using DataTravelManagement.Model;
using DataTravelManagement.DTOModel;
using DataTravelManagement.Ocr;
using System.Security.Cryptography;

namespace DataTravelManagement.Data
{
    public class EmployeeDocumentData
    {
        private readonly EmployeeDocumentContext _context;
        private readonly OcrServices _ocrServices;
        private readonly PassportInfoMasterContext _passportContext;

        private static readonly byte[] Key = Convert.FromBase64String("sJ17cfyxl0Rk7MqJ4sz2k0mtdMNkJs98AJ3cQBjkHBQ=");
        private static readonly byte[] IV = Convert.FromBase64String("6cojBDO++/cde4qJpZ6tUg==");

        public EmployeeDocumentData(EmployeeDocumentContext context, OcrServices service, PassportInfoMasterContext passportContext)
        {
            _context = context;
            _ocrServices = service;
            _passportContext = passportContext;
        }

        /// <summary>
        /// Get decrypted document bytes (existing method - kept for backward compatibility)
        /// </summary>
        public byte[] GetDocument(string empId, int documentId)
        {
            var encryptedData = _context.EmployeeDocuments
                .Where(doc => doc.EmpId == empId && doc.DocumentID == documentId)
                .Select(doc => doc.Document)
                .FirstOrDefault();

            if (encryptedData == null) return null;

            return Decrypt(encryptedData);
        }

        /// <summary>
        /// Get document with full metadata and base64 content (for preview/download)
        /// </summary>
        public EmployeeDocumentFileDTO GetDocumentWithMetadata(string empId, int documentId)
        {
            var doc = _context.EmployeeDocuments
                .Where(d => d.EmpId == empId && d.DocumentID == documentId)
                .FirstOrDefault();

            if (doc == null) return null;

            var decryptedBytes = Decrypt(doc.Document);
            var base64String = Convert.ToBase64String(decryptedBytes);

            return new EmployeeDocumentFileDTO
            {
                EmpDocId = doc.EmpDocId,
                EmpId = doc.EmpId,
                DocumentID = doc.DocumentID,
                FileType = doc.FileType,
                FileName = doc.FileName,
                FileSize = doc.FileSize,
                Base64String = base64String,
                CreatedOn = doc.CreatedOn
            };
        }

        /// <summary>
        /// Get all uploaded documents for an employee (list without base64 - lightweight)
        /// </summary>
        public List<EmployeeDocumentListDTO> GetAllDocumentsByEmpId(string empId)
        {
            var documents = _context.EmployeeDocuments
                .Where(doc => doc.EmpId == empId)
                .Select(doc => new EmployeeDocumentListDTO
                {
                    EmpDocId = doc.EmpDocId,
                    EmpId = doc.EmpId,
                    DocumentID = doc.DocumentID,
                    FileType = doc.FileType,
                    FileName = doc.FileName,
                    FileSize = doc.FileSize,
                    CreatedOn = doc.CreatedOn,
                    UpdatedOn = doc.UpdatedOn
                })
                .ToList();

            return documents;
        }

        /// <summary>
        /// Add or update document with metadata
        /// </summary>
        public string AddDocument(string empId, int documentId, byte[] document, string fileType = null, string fileName = null, long? fileSize = null)
        {
            var existingDocument = _context.EmployeeDocuments
                .FirstOrDefault(doc => doc.EmpId == empId && doc.DocumentID == documentId);

            if (existingDocument != null)
            {
                // Update existing document
                if (documentId == 1)
                {
                    var ExistingInfo = _passportContext.PassportInfos
                        .FirstOrDefault(doc => doc.EmpId == empId);

                    if (ExistingInfo != null)
                    {
                        var PassportInfo = _ocrServices.OCR(document);
                        ExistingInfo.Issuer = PassportInfo.Issuer;
                        ExistingInfo.FullName = PassportInfo.FullName;
                        ExistingInfo.PassportNumber = PassportInfo.PassportNumber;
                        ExistingInfo.Nationality = PassportInfo.Nationality;
                        ExistingInfo.Sex = PassportInfo.Sex;
                        ExistingInfo.DateOfBirth = PassportInfo.DateOfBirth;
                        ExistingInfo.ExpiryDate = PassportInfo.ExpiryDate;
                        ExistingInfo.CompositeCheck = PassportInfo.CompositeCheck;
                        _passportContext.SaveChanges();
                    }
                }

                existingDocument.Document = Encrypt(document);
                existingDocument.FileType = fileType;
                existingDocument.FileName = fileName;
                existingDocument.FileSize = fileSize;
                existingDocument.UpdatedOn = DateTime.UtcNow;

                _context.SaveChanges();
                return "Document updated successfully.";
            }

            // Insert new document
            if (documentId == 1)
            {
                var PassportInfo = _ocrServices.OCR(document);
                PassportInfo.EmpId = empId;
                _passportContext.PassportInfos.Add(PassportInfo);
                _passportContext.SaveChanges();
            }

            var encrypted = Encrypt(document);

            var employeeDocument = new EmployeeDocumentMaster
            {
                EmpId = empId,
                DocumentID = documentId,
                Document = encrypted,
                FileType = fileType,
                FileName = fileName,
                FileSize = fileSize,
                CreatedOn = DateTime.UtcNow
            };

            _context.EmployeeDocuments.Add(employeeDocument);
            _context.SaveChanges();
            return "Document added successfully.";
        }

        /// <summary>
        /// Delete document
        /// </summary>
        public string DeleteDocument(string empId, int documentId)
        {
            var document = _context.EmployeeDocuments
                .FirstOrDefault(doc => doc.EmpId == empId && doc.DocumentID == documentId);

            if (document == null)
            {
                return "Document not found.";
            }

            // If it's a passport document, also delete passport info
            if (documentId == 1)
            {
                var passportInfo = _passportContext.PassportInfos
                    .FirstOrDefault(p => p.EmpId == empId);

                if (passportInfo != null)
                {
                    _passportContext.PassportInfos.Remove(passportInfo);
                    _passportContext.SaveChanges();
                }
            }

            _context.EmployeeDocuments.Remove(document);
            _context.SaveChanges();

            return "Document deleted successfully.";
        }

        private byte[] Encrypt(byte[] plainData)
        {
            using var aes = Aes.Create();
            aes.Key = Key;
            aes.IV = IV;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var encryptor = aes.CreateEncryptor();
            return encryptor.TransformFinalBlock(plainData, 0, plainData.Length);
        }

        private byte[] Decrypt(byte[] encryptedData)
        {
            using var aes = Aes.Create();
            aes.Key = Key;
            aes.IV = IV;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var decryptor = aes.CreateDecryptor();
            return decryptor.TransformFinalBlock(encryptedData, 0, encryptedData.Length);
        }
    }
}