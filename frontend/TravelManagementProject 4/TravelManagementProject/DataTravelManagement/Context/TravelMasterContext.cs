using DataTravelManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Context
{
    public class TravelMasterContext : DbContext
    {
        public TravelMasterContext(DbContextOptions<TravelMasterContext> options)
            : base(options)
        {
        }

        public DbSet<TravelMaster> TravelMasters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TravelMaster>(entity =>
            {
                entity.ToTable("TMS_TravelMaster");



                entity.HasKey(e => e.TId);

                entity.Property(e => e.TId)
                      .ValueGeneratedOnAdd();


                entity.Property(e => e.EmpId)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.EmpId)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.Country)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.City)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.Remark)
                      .HasMaxLength(500);


                entity.Property(e => e.SuggestedDate)
                      .HasColumnType("date");

                entity.Property(e => e.TravelStartDate)
                      .HasColumnType("date");

                entity.Property(e => e.TravelEndDate)
                      .HasColumnType("date");

                entity.Property(e => e.Status)
                      .IsRequired();

                entity.Property(e => e.RptEmpId)
                      .IsRequired();
            });
        }
    }
    }


  
    
