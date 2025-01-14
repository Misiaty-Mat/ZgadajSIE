using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZgadajSieAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class EventHasTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventDetails_Events_EventId",
                table: "EventDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventDetails",
                table: "EventDetails");

            migrationBuilder.DropColumn(
                name: "EventName",
                table: "EventDetails");

            migrationBuilder.RenameTable(
                name: "EventDetails",
                newName: "EventsDetails");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventsDetails",
                table: "EventsDetails",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventsDetails_Events_EventId",
                table: "EventsDetails",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventsDetails_Events_EventId",
                table: "EventsDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventsDetails",
                table: "EventsDetails");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Events");

            migrationBuilder.RenameTable(
                name: "EventsDetails",
                newName: "EventDetails");

            migrationBuilder.AddColumn<string>(
                name: "EventName",
                table: "EventDetails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventDetails",
                table: "EventDetails",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventDetails_Events_EventId",
                table: "EventDetails",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
