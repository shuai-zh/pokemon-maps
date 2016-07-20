export default function (sequelize, DataTypes) {
  var Pokemon = sequelize.define('pokemon',
    {
      num: {
        type: DataTypes.INTEGER,
        unique: true
      },
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
