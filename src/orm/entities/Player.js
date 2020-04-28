const Entity = require("entities/Entity");

class Player extends Entity {

    constructor(id, maxHealth, health, attack, defense, speed, effect, score, weeklyScore, level, experience, money, lastReport, badges, guildId, rank, weeklyRank) {
        super(id, maxHealth, health, attack, defense, speed, effect);

        this.discordId = id;
        this.score = score;
        this.weeklyScore = weeklyScore;
        this.level = level;
        this.experience = experience;
        this.money = money;
        this.lastReport = lastReport;
        this.badges = badges;
        this.guildId = guildId;

        // Virtual properties
        this.name = null;
        this.rank = rank;
        this.weeklyRank = weeklyRank;
    }

    // https://github.com/jshint/jshint/issues/3381
    ['set'](field, value) {
        if (['score', 'weeklyScore', 'level', 'experience', 'money'].indexOf(field) !== -1) {
            this['set' + field.charAt(0).toUpperCase() + field.slice(1)](value);
        } else {
            super.set(field, value);
        }
    }

    /**
     * @param {number} value
     */
    changeScoreAndWeeklyScore(value) {
        this.setScore(this.get('score') + value);
        this.setWeeklyScore(this.get('weeklyScore') + value);
    }

    /**
     * @param {number} value
     */
    setScore(value) {
        if (value > 0) {
            this.score = value;
        } else {
            this.score = 0;
        }
    }

    /**
     * @param {number} value
     */
    setWeeklyScore(value) {
        if (value > 0) {
            this.weeklyScore = value;
        } else {
            this.weeklyScore = 0;
        }
    }

    /**
     * Increments the Player's level, and subtract the experience needed for the level up from the Player's experience.
     * @param {*} message - The message that caused the levelup. Used to send a level up message
     * @param {string} language
     */
    setLevelUp(message, language) {
        // TODO
    }

    /**
     * Set this Player instance's level.
     * @param {number} value - The level this Player instance should be. Must be a positive Number.
     */
    setLevel(value) {
        if (value > 0) {
            this.level = value;
        }
    }

    /**
     * Return the amount of experience needed to level up.
     * @return {number} Return the experience needed to level up.
     */
    getExperienceNeededToLevelUp() {
        return Config.xp[this.get('level') + 1];
    }

    /**
     * Return the amount of experience used to level up.
     * @returns {Number} Return the experience used to level up.
     */
    getExperienceUsedToLevelUp() {
        return Config.xp[this.get('level')];
    }

    /**
     * TODO - WIP need testing
     * Add the specified amount of experience to the player's experience total.
     * @param {number} value - The amount of experience to add. Must be a positive Number.
     * @return {string|void}
     */
    addExperience(value) {
        let experienceResult;
        if (value > 0) {
            experienceResult = this.setExperience(this.get('experience') + value);
        }
        if (experienceResult !== undefined) {
            return experienceResult;
        }
    }

    /**
     * TODO - WIP need testing, maybe remove for stack load
     * Set this Player instance's current experience.
     * @param {number} value - The amount of experience this instance should have. Must be a positive or null Number.
     * @return {string|void}
     */
    setExperience(value) {
        if (value >= 0) {
            this.experience = value;
        }
        if ((this.experience >= this.getExperienceNeededToLevelUp())) {
            return "doLevelUp";
        }
    }

    /**
     * TODO : Pas de setMoney ce qui permet d'avoir de la monnaie négative (pour un systeme de prêt par exemple avec intérêts)
     * @param {number} value -
     */
    changeMoney(value) {
        this.money = this.get('money') + value;
    }

    /**
     * TODO - Je ne comprend pas cette méthode
     * Returns this player instance's current fight power
     * @return {number}
     */
    getFightPower() {
        return this.get('maxHealth') + (this.get('level') * 10);
    }

    // TODO

}

module.exports = Player;
