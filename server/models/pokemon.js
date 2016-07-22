export default function (sequelize, DataTypes) {
  var Pokemon = sequelize.define('pokemon',
    {
      name: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      }
    }, {
      classMethods: {
        associate: models=> {
          Pokemon.belongsToMany(models.coordinate, {through: models.rating});
        }
      },
      timestamps: false
    });

  return Pokemon;
}
