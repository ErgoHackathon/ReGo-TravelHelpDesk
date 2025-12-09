using DataTravelManagement.Model;
using Microsoft.EntityFrameworkCore;

namespace DataTravelManagement.Context
{
    public class EmployeeDocumentContext : DbContext
    {
        public EmployeeDocumentContext(DbContextOptions<EmployeeDocumentContext> options)
            : base(options)
        {
        }

        public DbSet<EmployeeDocumentMaster> EmployeeDocuments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EmployeeDocumentMaster>(entity =>
            {
                entity.ToTable("TMS_EmployeeDocumentMaster");

                entity.HasKey(e => e.EmpDocId);

                entity.Property(e => e.EmpDocId)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.EmpId)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.DocumentID)
                      .IsRequired();

                entity.Property(e => e.Document)
                      .IsRequired();

                // NEW: File metadata columns
                entity.Property(e => e.FileType)
                      .HasMaxLength(100)
                      .IsRequired(false);

                entity.Property(e => e.FileName)
                      .HasMaxLength(255)
                      .IsRequired(false);

                entity.Property(e => e.FileSize)
                      .IsRequired(false);

                entity.Property(e => e.CreatedOn)
                      .IsRequired(false);

                entity.Property(e => e.CreatedBy)
                      .HasMaxLength(50)
                      .IsRequired(false);

                entity.Property(e => e.UpdatedOn)
                      .IsRequired(false);

                entity.Property(e => e.UpdatedBy)
                      .HasMaxLength(50)
                      .IsRequired(false);
            });
        }
    }
}