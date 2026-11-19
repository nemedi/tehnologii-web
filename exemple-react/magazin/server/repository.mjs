import Sequelize from 'sequelize';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './repository.db',
	logging: false
});

const id = () => ({
	type: Sequelize.UUID,
	defaultValue: Sequelize.UUIDV4,
	allowNull: false,
	primaryKey: true
});

const Customer = sequelize.define('customer', {
	id: id(),
	firstName: {type: Sequelize.STRING, allowNull: false},
	lastName: {type: Sequelize.STRING, allowNull: false},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {isEmail: true}
	},
	address: Sequelize.STRING
}, {timestamps: false});

const Product = sequelize.define('product', {
	id: id(),
	name: {type: Sequelize.STRING, allowNull: false},
	description: Sequelize.STRING,
	price: {
		type: Sequelize.DECIMAL(10, 2),
		allowNull: false,
		validate: {min: 0}
	},
	stock: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {min: 0}
	}
}, {timestamps: false});

const Order = sequelize.define('order', {
	id: id(),
	placedAt: {type: Sequelize.DATE, allowNull: false},
	status: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {isIn: [['NEW', 'PAID', 'SHIPPED', 'CANCELLED']]}
	},
	customerId: {type: Sequelize.UUID, allowNull: false}
}, {timestamps: false});

// Tabel de legatura: prima cheie = membrul, a doua = gazda.
const OrderProduct = sequelize.define('orderProduct', {
	productId: {type: Sequelize.UUID, primaryKey: true},
	orderId: {type: Sequelize.UUID, primaryKey: true}
}, {timestamps: false});

Customer.hasMany(Order, {foreignKey: 'customerId', onDelete: 'RESTRICT'});
Order.belongsTo(Customer, {foreignKey: 'customerId', onDelete: 'RESTRICT'});
Order.belongsToMany(Product, {through: OrderProduct, foreignKey: 'orderId', otherKey: 'productId'});
Product.belongsToMany(Order, {through: OrderProduct, foreignKey: 'productId', otherKey: 'orderId'});

async function initialize() {
	await sequelize.authenticate();
	await sequelize.sync();
}

export {
	initialize,
	Customer,
	Product,
	Order,
	OrderProduct
};
