using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZgadajSieAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeDeleteBehaviour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Events_JoinedEventsEventId",
                table: "EventRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Users_ParticipantsId",
                table: "EventRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_EventTags_Events_EventsEventId",
                table: "EventTags");

            migrationBuilder.DropForeignKey(
                name: "FK_EventTags_Tags_TagsId",
                table: "EventTags");

            migrationBuilder.RenameColumn(
                name: "TagsId",
                table: "EventTags",
                newName: "TagId");

            migrationBuilder.RenameColumn(
                name: "EventsEventId",
                table: "EventTags",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventTags_TagsId",
                table: "EventTags",
                newName: "IX_EventTags_TagId");

            migrationBuilder.RenameColumn(
                name: "ParticipantsId",
                table: "EventRegistrations",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "JoinedEventsEventId",
                table: "EventRegistrations",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventRegistrations_ParticipantsId",
                table: "EventRegistrations",
                newName: "IX_EventRegistrations_UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_Name",
                table: "Tags",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Events_EventId",
                table: "EventRegistrations",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Users_UserId",
                table: "EventRegistrations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventTags_Events_EventId",
                table: "EventTags",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventTags_Tags_TagId",
                table: "EventTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Events_EventId",
                table: "EventRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_EventRegistrations_Users_UserId",
                table: "EventRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_EventTags_Events_EventId",
                table: "EventTags");

            migrationBuilder.DropForeignKey(
                name: "FK_EventTags_Tags_TagId",
                table: "EventTags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_Name",
                table: "Tags");

            migrationBuilder.RenameColumn(
                name: "TagId",
                table: "EventTags",
                newName: "TagsId");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "EventTags",
                newName: "EventsEventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventTags_TagId",
                table: "EventTags",
                newName: "IX_EventTags_TagsId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "EventRegistrations",
                newName: "ParticipantsId");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "EventRegistrations",
                newName: "JoinedEventsEventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventRegistrations_UserId",
                table: "EventRegistrations",
                newName: "IX_EventRegistrations_ParticipantsId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Events_JoinedEventsEventId",
                table: "EventRegistrations",
                column: "JoinedEventsEventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventRegistrations_Users_ParticipantsId",
                table: "EventRegistrations",
                column: "ParticipantsId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventTags_Events_EventsEventId",
                table: "EventTags",
                column: "EventsEventId",
                principalTable: "Events",
                principalColumn: "EventId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EventTags_Tags_TagsId",
                table: "EventTags",
                column: "TagsId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
