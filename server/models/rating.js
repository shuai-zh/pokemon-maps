export default function (sequelize, DataTypes) {
  var Rating = sequelize.define('rating',
    {
      caught: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      classMethods: {
        associate: models=> {

        }
      },
      timestamps: false
    });

  return Rating;
}
