using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.FindMinPath.Migrations
{
    /// <inheritdoc />
    public partial class addcolumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MapDetails_MapId",
                table: "MapDetails");

            migrationBuilder.RenameColumn(
                name: "Fuel",
                table: "MapDetails",
                newName: "MinFuel");

            migrationBuilder.AddColumn<string>(
                name: "MatrixJson",
                table: "MapDetails",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MapDetails_MapId",
                table: "MapDetails",
                column: "MapId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MapDetails_MapId",
                table: "MapDetails");

            migrationBuilder.DropColumn(
                name: "MatrixJson",
                table: "MapDetails");

            migrationBuilder.RenameColumn(
                name: "MinFuel",
                table: "MapDetails",
                newName: "Fuel");

            migrationBuilder.CreateIndex(
                name: "IX_MapDetails_MapId",
                table: "MapDetails",
                column: "MapId",
                unique: true);
        }
    }
}
