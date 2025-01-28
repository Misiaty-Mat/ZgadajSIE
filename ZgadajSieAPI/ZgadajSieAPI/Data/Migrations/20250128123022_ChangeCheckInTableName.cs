using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZgadajSieAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCheckInTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CheckIn_Events_EventId",
                table: "CheckIn");

            migrationBuilder.DropForeignKey(
                name: "FK_CheckIn_Users_UserId",
                table: "CheckIn");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CheckIn",
                table: "CheckIn");

            migrationBuilder.RenameTable(
                name: "CheckIn",
                newName: "CheckIns");

            migrationBuilder.RenameIndex(
                name: "IX_CheckIn_UserId",
                table: "CheckIns",
                newName: "IX_CheckIns_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_CheckIn_EventId_UserId",
                table: "CheckIns",
                newName: "IX_CheckIns_EventId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CheckIns",
                table: "CheckIns",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CheckIns_Events_EventId",
                table: "CheckIns",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CheckIns_Users_UserId",
                table: "CheckIns",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CheckIns_Events_EventId",
                table: "CheckIns");

            migrationBuilder.DropForeignKey(
                name: "FK_CheckIns_Users_UserId",
                table: "CheckIns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CheckIns",
                table: "CheckIns");

            migrationBuilder.RenameTable(
                name: "CheckIns",
                newName: "CheckIn");

            migrationBuilder.RenameIndex(
                name: "IX_CheckIns_UserId",
                table: "CheckIn",
                newName: "IX_CheckIn_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_CheckIns_EventId_UserId",
                table: "CheckIn",
                newName: "IX_CheckIn_EventId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CheckIn",
                table: "CheckIn",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CheckIn_Events_EventId",
                table: "CheckIn",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CheckIn_Users_UserId",
                table: "CheckIn",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
