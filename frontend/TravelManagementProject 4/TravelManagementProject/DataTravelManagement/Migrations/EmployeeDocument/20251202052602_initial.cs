using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataTravelManagement.Migrations.EmployeeDocument
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TMS_EmployeeDocumentMaster",
                columns: table => new
                {
                    EmpDocId = table.Column<int>(type: "int", maxLength: 50, nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmpId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DocumentID = table.Column<int>(type: "int", nullable: false),
                    Document = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdatedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TMS_EmployeeDocumentMaster", x => x.EmpDocId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TMS_EmployeeDocumentMaster");
        }
    }
}
