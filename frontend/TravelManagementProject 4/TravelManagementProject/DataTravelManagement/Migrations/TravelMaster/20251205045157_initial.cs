using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataTravelManagement.Migrations.TravelMaster
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TMS_TravelMaster",
                columns: table => new
                {
                    TId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmpId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Remark = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SuggestedDate = table.Column<DateTime>(type: "date", nullable: false),
                    TravelStartDate = table.Column<DateTime>(type: "date", nullable: false),
                    TravelEndDate = table.Column<DateTime>(type: "date", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    RptEmpId = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TMS_TravelMaster", x => x.TId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TMS_TravelMaster");
        }
    }
}
