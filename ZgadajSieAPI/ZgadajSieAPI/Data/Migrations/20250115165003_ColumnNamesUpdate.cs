using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZgadajSieAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ColumnNamesUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Users_AttendeesId",
                table: "EventRegistrations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventRegistrations",
                table: "EventRegistrations");

            migrationBuilder.DropIndex(
                name: "IX_EventRegistrations_JoinedEventsEventId",
                table: "EventRegistrations");

            migrationBuilder.RenameColumn(
                name: "MinAttendee",
                table: "EventsDetails",
                newName: "MinAttendance");

            migrationBuilder.RenameColumn(
                name: "MaxAttendee",
                table: "EventsDetails",
                newName: "MaxAttendance");

            migrationBuilder.RenameColumn(
                name: "AttendeesId",
                table: "EventRegistrations",
                newName: "ParticipantsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventRegistrations",
                table: "EventRegistrations",
                columns: new[] { "JoinedEventsEventId", "ParticipantsId" });

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrations_ParticipantsId",
                table: "EventRegistrations",
                column: "ParticipantsId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Users_ParticipantsId",
                table: "EventRegistrations",
                column: "ParticipantsId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Users_ParticipantsId",
                table: "EventRegistrations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventRegistrations",
                table: "EventRegistrations");

            migrationBuilder.DropIndex(
                name: "IX_EventRegistrations_ParticipantsId",
                table: "EventRegistrations");

            migrationBuilder.RenameColumn(
                name: "MinAttendance",
                table: "EventsDetails",
                newName: "MinAttendee");

            migrationBuilder.RenameColumn(
                name: "MaxAttendance",
                table: "EventsDetails",
                newName: "MaxAttendee");

            migrationBuilder.RenameColumn(
                name: "ParticipantsId",
                table: "EventRegistrations",
                newName: "AttendeesId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventRegistrations",
                table: "EventRegistrations",
                columns: new[] { "AttendeesId", "JoinedEventsEventId" });

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrations_JoinedEventsEventId",
                table: "EventRegistrations",
                column: "JoinedEventsEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Users_AttendeesId",
                table: "EventRegistrations",
                column: "AttendeesId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
