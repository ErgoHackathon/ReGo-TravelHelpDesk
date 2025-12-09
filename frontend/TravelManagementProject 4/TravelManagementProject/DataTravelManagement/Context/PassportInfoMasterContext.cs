using DataTravelManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Context
{
    public class PassportInfoMasterContext:DbContext
    {
        public PassportInfoMasterContext(DbContextOptions<PassportInfoMasterContext> options)
         : base(options) { }

        public DbSet<PassportInfoMaster> PassportInfos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<PassportInfoMaster>();

            entity.ToTable("TMS_PassportInfoMaster");

            entity.HasKey(p => p.EmpId);

            entity.Property(p => p.EmpId)
                  .IsRequired()
                  .HasMaxLength(50); 

            entity.Property(p => p.Issuer)
                  .HasMaxLength(10).IsRequired(false);

           
            entity.Property(p => p.FullName)
                  .HasMaxLength(250).IsRequired(false);

            entity.Property(p => p.PassportNumber)
                  .HasMaxLength(20).IsRequired(false);

            entity.Property(p => p.Nationality)
                  .HasMaxLength(10).IsRequired(false);

            entity.Property(p => p.DateOfBirth)
                  .HasColumnType("date").IsRequired(false);

            entity.Property(p => p.ExpiryDate)
                  .HasColumnType("date").IsRequired(false);

            entity.Property(p => p.Sex)
                  .HasColumnType("char(1)")
                  .IsRequired(false);

            entity.Property(p => p.CompositeCheck)
                  .HasColumnType("bit").IsRequired(false);


        }
    }

}   