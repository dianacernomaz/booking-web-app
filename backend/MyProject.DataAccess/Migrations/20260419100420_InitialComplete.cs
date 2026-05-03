using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyProject.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class InitialComplete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AmenityData_Properties_PropertyId",
                table: "AmenityData");

            migrationBuilder.DropForeignKey(
                name: "FK_NearbyPlaceData_Properties_PropertyId",
                table: "NearbyPlaceData");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyFeatureData_Properties_PropertyId",
                table: "PropertyFeatureData");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyImageData_Properties_PropertyId",
                table: "PropertyImageData");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyOccupiedDayData_Properties_PropertyId",
                table: "PropertyOccupiedDayData");

            migrationBuilder.DropForeignKey(
                name: "FK_ReviewData_Properties_PropertyId",
                table: "ReviewData");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReviewData",
                table: "ReviewData");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyOccupiedDayData",
                table: "PropertyOccupiedDayData");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyImageData",
                table: "PropertyImageData");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyFeatureData",
                table: "PropertyFeatureData");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NearbyPlaceData",
                table: "NearbyPlaceData");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AmenityData",
                table: "AmenityData");

            migrationBuilder.RenameTable(
                name: "ReviewData",
                newName: "Reviews");

            migrationBuilder.RenameTable(
                name: "PropertyOccupiedDayData",
                newName: "PropertyOccupiedDays");

            migrationBuilder.RenameTable(
                name: "PropertyImageData",
                newName: "PropertyImages");

            migrationBuilder.RenameTable(
                name: "PropertyFeatureData",
                newName: "PropertyFeatures");

            migrationBuilder.RenameTable(
                name: "NearbyPlaceData",
                newName: "NearbyPlaces");

            migrationBuilder.RenameTable(
                name: "AmenityData",
                newName: "Amenities");

            migrationBuilder.RenameIndex(
                name: "IX_ReviewData_PropertyId",
                table: "Reviews",
                newName: "IX_Reviews_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyOccupiedDayData_PropertyId",
                table: "PropertyOccupiedDays",
                newName: "IX_PropertyOccupiedDays_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyImageData_PropertyId",
                table: "PropertyImages",
                newName: "IX_PropertyImages_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyFeatureData_PropertyId",
                table: "PropertyFeatures",
                newName: "IX_PropertyFeatures_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_NearbyPlaceData_PropertyId",
                table: "NearbyPlaces",
                newName: "IX_NearbyPlaces_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_AmenityData_PropertyId",
                table: "Amenities",
                newName: "IX_Amenities_PropertyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyOccupiedDays",
                table: "PropertyOccupiedDays",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyImages",
                table: "PropertyImages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyFeatures",
                table: "PropertyFeatures",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NearbyPlaces",
                table: "NearbyPlaces",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Amenities",
                table: "Amenities",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Amenities_Properties_PropertyId",
                table: "Amenities",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NearbyPlaces_Properties_PropertyId",
                table: "NearbyPlaces",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyFeatures_Properties_PropertyId",
                table: "PropertyFeatures",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyImages_Properties_PropertyId",
                table: "PropertyImages",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyOccupiedDays_Properties_PropertyId",
                table: "PropertyOccupiedDays",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Properties_PropertyId",
                table: "Reviews",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Amenities_Properties_PropertyId",
                table: "Amenities");

            migrationBuilder.DropForeignKey(
                name: "FK_NearbyPlaces_Properties_PropertyId",
                table: "NearbyPlaces");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyFeatures_Properties_PropertyId",
                table: "PropertyFeatures");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyImages_Properties_PropertyId",
                table: "PropertyImages");

            migrationBuilder.DropForeignKey(
                name: "FK_PropertyOccupiedDays_Properties_PropertyId",
                table: "PropertyOccupiedDays");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Properties_PropertyId",
                table: "Reviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyOccupiedDays",
                table: "PropertyOccupiedDays");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyImages",
                table: "PropertyImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyFeatures",
                table: "PropertyFeatures");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NearbyPlaces",
                table: "NearbyPlaces");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Amenities",
                table: "Amenities");

            migrationBuilder.RenameTable(
                name: "Reviews",
                newName: "ReviewData");

            migrationBuilder.RenameTable(
                name: "PropertyOccupiedDays",
                newName: "PropertyOccupiedDayData");

            migrationBuilder.RenameTable(
                name: "PropertyImages",
                newName: "PropertyImageData");

            migrationBuilder.RenameTable(
                name: "PropertyFeatures",
                newName: "PropertyFeatureData");

            migrationBuilder.RenameTable(
                name: "NearbyPlaces",
                newName: "NearbyPlaceData");

            migrationBuilder.RenameTable(
                name: "Amenities",
                newName: "AmenityData");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_PropertyId",
                table: "ReviewData",
                newName: "IX_ReviewData_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyOccupiedDays_PropertyId",
                table: "PropertyOccupiedDayData",
                newName: "IX_PropertyOccupiedDayData_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyImages_PropertyId",
                table: "PropertyImageData",
                newName: "IX_PropertyImageData_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyFeatures_PropertyId",
                table: "PropertyFeatureData",
                newName: "IX_PropertyFeatureData_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_NearbyPlaces_PropertyId",
                table: "NearbyPlaceData",
                newName: "IX_NearbyPlaceData_PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_Amenities_PropertyId",
                table: "AmenityData",
                newName: "IX_AmenityData_PropertyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReviewData",
                table: "ReviewData",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyOccupiedDayData",
                table: "PropertyOccupiedDayData",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyImageData",
                table: "PropertyImageData",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyFeatureData",
                table: "PropertyFeatureData",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NearbyPlaceData",
                table: "NearbyPlaceData",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AmenityData",
                table: "AmenityData",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AmenityData_Properties_PropertyId",
                table: "AmenityData",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NearbyPlaceData_Properties_PropertyId",
                table: "NearbyPlaceData",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyFeatureData_Properties_PropertyId",
                table: "PropertyFeatureData",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyImageData_Properties_PropertyId",
                table: "PropertyImageData",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyOccupiedDayData_Properties_PropertyId",
                table: "PropertyOccupiedDayData",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReviewData_Properties_PropertyId",
                table: "ReviewData",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
