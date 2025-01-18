using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZgadajSieAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class EventDropMinParticipants : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinParticipation",
                table: "EventsDetails");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MinParticipation",
                table: "EventsDetails",
                type: "integer",
                nullable: true);
        }
    }
}
