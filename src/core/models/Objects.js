module.exports = (sequelize, DataTypes) => {

  const Objects = sequelize.define('Objects', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rarity: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.objects.rarity
    },
    power: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.objects.power
    },
    nature: {
      type: DataTypes.INTEGER,
      defaultValue: JsonReader.models.objects.nature
    },
    fr: {
      type: DataTypes.TEXT
    },
    en: {
      type: DataTypes.TEXT
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: require('moment')().format('YYYY-MM-DD HH:mm:ss')
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: require('moment')().format('YYYY-MM-DD HH:mm:ss')
    }
  }, {
    tableName: 'objects',
    freezeTableName: true
  });

  Objects.beforeSave((instance, options) => {
    instance.setDataValue('updatedAt', require('moment')().format('YYYY-MM-DD HH:mm:ss'));
  });

  /**
   * @param {("fr"|"en")} language - The language the inventory has to be displayed in
   * @param {("active"|"backup")} slot
   */
  Objects.prototype.toFieldObject = async function (language, slot) {
    return {
      name: JsonReader.items.getTranslation(language).objects[slot].fieldName,
      value: (this.id === 0) ? this[language] : this.getFullName(language, slot),
    };
  };

  /**
   * Get the full name of the object, with the rarity and nature
   * @param {("fr"|"en")} language - The language the potion has to be displayed in
   * @return {String}
   */
  Objects.prototype.toString = function (language) {
    return (this.id === 0) ? this[language] : format(
      JsonReader.items.getTranslation(language).potions.fieldValue, {
      name: this[language],
      rarity: this.getRarityTranslation(language),
      nature: this.getNatureTranslation(language),
    });
  };

  /**
   * @param {("fr"|"en")} language
   * @param {("active"|"backup")} slot
   * @return {String}
   */
  Objects.prototype.getFullName = function (language, slot) {
    return format(
        JsonReader.items.getTranslation(language).objects[slot].fieldValue, {
          name: this[language],
          rarity: this.getRarityTranslation(language),
          nature: this.getNatureTranslation(language),
        });
  };

  /**
   * Get the simple name of the item, without rarity or anything else
   * @param {("fr"|"en")} language
   * @return {String}
   */
  Objects.prototype.getName = function (language) {
    return this[language];
  };

  /**
   * @param {("fr"|"en")} language
   * @return {String}
   */
  Objects.prototype.getRarityTranslation = function(language) {
    return JsonReader.items.getTranslation(language).rarities[this.rarity];
  };

  /**
   * @param {("fr"|"en")} language
   * @return {String}
   */
  Objects.prototype.getNatureTranslation = function (language) {
    return format(JsonReader.items.getTranslation(language).objects.natures[this.nature], { power: this.power });
  };

  /**
   * @return {Number}
   */
  Objects.prototype.getAttack = function () {
    if (this.nature === 3) {
      return this.power;
    }
    return 0;
  };

  /**
   * @return {Number}
   */
  Objects.prototype.getDefense = function () {
    if (this.nature === 4) {
      return this.power;
    }
    return 0;
  };

  /**
   * @return {Number}
   */
  Objects.prototype.getSpeed = function () {
    if (this.nature === 2) {
      return this.power;
    }
    return 0;
  };

  return Objects;
};
