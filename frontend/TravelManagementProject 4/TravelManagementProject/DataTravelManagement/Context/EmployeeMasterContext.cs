using DataTravelManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Context
{
    public class EmployeeMasterContext : DbContext
    {


        public EmployeeMasterContext(DbContextOptions<EmployeeMasterContext> options)
                    : base(options)
        {
        }

        public DbSet<EmployeeMaster> EmployeeMasters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EmployeeMaster>(entity =>
            {
                entity.ToTable("TMS_EmployeeMaster");
                entity.HasKey(e => e.EmpId);

                entity.Property(e => e.EmpId)
                      .IsRequired()
                      .HasMaxLength(50); 

                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Email)
                      .IsRequired();

                entity.Property(e => e.RptEmpId)
                      .HasMaxLength(50);

                entity.Property(e => e.RptAvpId)
                      .HasMaxLength(50);

                entity.Property(e => e.RptSvpId)
                      .HasMaxLength(50);


                entity.Property(e => e.RefRoleId)
                      .IsRequired();

                entity.Property(e => e.CreatedOn)
                      .IsRequired(false);

                entity.Property(e => e.CreatedBy)
                      .HasMaxLength(50);

                entity.Property(e => e.UpdatedOn)
                      .IsRequired(false);

                entity.Property(e => e.UpdatedBy)
                      .HasMaxLength(50);
            });

        }
    }
}



