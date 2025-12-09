using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataTravelManagement.Migrations.DocumentMaster
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TMS_DocumentMaster",
                columns: table => new
                {
                    DocumentID = table.Column<int>(type: "int", nullable: false),
                    DocumentName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TMS_DocumentMaster", x => x.DocumentID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TMS_DocumentMaster");
        }
    }
}
