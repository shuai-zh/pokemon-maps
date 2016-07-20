export default function (sequelize, DataTypes) {
  var Rating = sequelize.define('rating',
    {
      caught: {
        type: DataTypes.INTEGER
      },
      total: {
        type: DataTypes.INTEGER
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
