import Sequelize from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './repository.db',
    define: {
        timestamps: false
    }
});

const Note = sequelize.define('note', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

async function initialize() {
    await sequelize.authenticate();
    await sequelize.sync();
}

export {
    initialize, Note
}