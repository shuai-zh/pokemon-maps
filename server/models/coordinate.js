export default function (sequelize, DataTypes) {
  var Coordinate = sequelize.define('coordinate',
    {
      x: {
        type: DataTypes.INTEGER,
        unique: 'coordinatesUniqueIndex'
      },
      y: {
        type: DataTypes.INTEGER,
        unique: 'coordinatesUniqueIndex'
      },
      totalCaught: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    }, {
      classMethods: {
        associate: models=> {
          Coordinate.belongsToMany(models.pokemon, {through: models.rating});
        }
      },
      timestamps: false
    });

  return Coordinate;
}
