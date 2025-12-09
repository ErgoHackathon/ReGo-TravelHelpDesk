using DataTravelManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
//using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Context
{
    public class DocumentMasterContext: DbContext
    {

        public DocumentMasterContext(DbContextOptions<DocumentMasterContext> options)
                    : base(options)
        {
        }

        public DbSet<DocumentMaster> DocumentMasters { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DocumentMaster>(entity =>
            {
                entity.ToTable("TMS_DocumentMaster");
                entity.HasKey(e => e.DocumentID);
                entity.Property(e => e.DocumentID).ValueGeneratedNever();
                entity.Property(e => e.DocumentName).IsRequired().HasMaxLength(100);
            });

        }

    }
}


