using DataTravelManagement.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTravelManagement.Context
{
    public class RollMasterContext : DbContext
    {


        public RollMasterContext(DbContextOptions<RollMasterContext> options)
                    : base(options)
        {
        }


        public DbSet<RollMaster> RollMasters { get; set; } = null!;

        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RollMaster>(entity =>
            {
                entity.ToTable("TMS_RollMaster");
                entity.HasKey(e => e.RollID);
                entity.Property(e => e.RollID).ValueGeneratedNever();
                entity.Property(e => e.RollName).IsRequired().HasMaxLength(50);
            });

        }
    }
}


