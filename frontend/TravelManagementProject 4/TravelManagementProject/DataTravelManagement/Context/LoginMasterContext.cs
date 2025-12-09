using DataTravelManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Context
{
    public class LoginMasterContext : DbContext
    {


        public LoginMasterContext(DbContextOptions<LoginMasterContext> options)
                    : base(options)
        {
        }


        public DbSet<LoginMaster> LoginMasters { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LoginMaster>(entity =>
            {
                entity.ToTable("TMS_LoginMaster");

                entity.HasKey(e => e.EmpId);

                entity.Property(e => e.EmpId)
                      .IsRequired()
                      .HasMaxLength(50); 

                entity.Property(e => e.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Email)
                      .IsRequired();

                entity.Property(e => e.Password)
                      .IsRequired();

                entity.Property(e => e.RptEmpId)
                      .HasMaxLength(50);

                entity.Property(e => e.RefRoleId);

                entity.Property(e => e.CreatedOn)
                      .IsRequired();

                entity.Property(e => e.CreatedBy)
                      .HasMaxLength(50);

                entity.Property(e => e.UpdatedOn);

                entity.Property(e => e.UpdatedBy)
                      .HasMaxLength(50);
            });
        }


    }
}




      