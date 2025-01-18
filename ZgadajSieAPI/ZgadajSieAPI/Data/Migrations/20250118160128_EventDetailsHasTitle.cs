using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZgadajSieAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class EventDetailsHasTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "MinAttendance",
                table: "EventsDetails",
                newName: "MinParticipation");

            migrationBuilder.RenameColumn(
                name: "MaxAttendance",
                table: "EventsDetails",
                newName: "MaxParticipation");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "EventsDetails",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Title",
                table: "EventsDetails");

            migrationBuilder.RenameColumn(
                name: "MinParticipation",
                table: "EventsDetails",
                newName: "MinAttendance");

            migrationBuilder.RenameColumn(
                name: "MaxParticipation",
                table: "EventsDetails",
                newName: "MaxAttendance");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Events",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
