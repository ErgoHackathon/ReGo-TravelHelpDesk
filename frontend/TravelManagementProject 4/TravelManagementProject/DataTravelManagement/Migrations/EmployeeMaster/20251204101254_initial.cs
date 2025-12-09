using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataTravelManagement.Migrations.EmployeeMaster
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TMS_EmployeeMaster",
                columns: table => new
                {
                    EmpId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RptEmpId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    RptAvpId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    RptSvpId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    RefRoleId = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TMS_EmployeeMaster", x => x.EmpId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TMS_EmployeeMaster");
        }
    }
}
