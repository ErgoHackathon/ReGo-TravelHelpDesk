using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataTravelManagement.Migrations.PassportInfoMaster
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TMS_PassportInfoMaster",
                columns: table => new
                {
                    EmpId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Issuer = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    PassportNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Nationality = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "date", nullable: true),
                    Sex = table.Column<string>(type: "char(1)", nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "date", nullable: true),
                    CompositeCheck = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TMS_PassportInfoMaster", x => x.EmpId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TMS_PassportInfoMaster");
        }
    }
}
