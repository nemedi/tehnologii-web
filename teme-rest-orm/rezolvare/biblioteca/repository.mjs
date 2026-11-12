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

const Author = sequelize.define('author', {
	id: id(),
	firstName: {type: Sequelize.STRING, allowNull: false},
	lastName: {type: Sequelize.STRING, allowNull: false},
	birthYear: {
		type: Sequelize.INTEGER,
		validate: {
			min: 1000,
			max: new Date().getFullYear()
		}
	},
	country: Sequelize.STRING
}, {timestamps: false});

const Book = sequelize.define('book', {
	id: id(),
	title: {type: Sequelize.STRING, allowNull: false},
	isbn: {
		type: Sequelize.STRING(13),
		allowNull: false,
		validate: {len: [13, 13]}
	},
	publishedOn: Sequelize.DATEONLY,
	pages: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {min: 1}
	},
	authorId: {type: Sequelize.UUID, allowNull: false}
}, {timestamps: false});

const Reader = sequelize.define('reader', {
	id: id(),
	name: {type: Sequelize.STRING, allowNull: false},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {isEmail: true}
	},
	phone: Sequelize.STRING
}, {timestamps: false});

const Loan = sequelize.define('loan', {
	id: id(),
	borrowedOn: {type: Sequelize.DATEONLY, allowNull: false},
	dueOn: {type: Sequelize.DATEONLY, allowNull: false},
	returnedOn: Sequelize.DATEONLY,
	bookId: {type: Sequelize.UUID, allowNull: false},
	readerId: {type: Sequelize.UUID, allowNull: false}
}, {
	timestamps: false,
	validate: {
		dueAfterBorrowed() {
			if (this.dueOn <= this.borrowedOn) {
				throw new Error('dueOn must be after borrowedOn.');
			}
		}
	}
});

const Category = sequelize.define('category', {
	id: id(),
	name: {type: Sequelize.STRING, allowNull: false},
	description: Sequelize.STRING
}, {timestamps: false});

// Tabel de legatura: prima cheie = membrul, a doua = gazda.
const BookCategory = sequelize.define('bookCategory', {
	categoryId: {type: Sequelize.UUID, primaryKey: true},
	bookId: {type: Sequelize.UUID, primaryKey: true}
}, {timestamps: false});

Author.hasMany(Book, {foreignKey: 'authorId', onDelete: 'RESTRICT'});
Book.belongsTo(Author, {foreignKey: 'authorId', onDelete: 'RESTRICT'});
Book.hasMany(Loan, {foreignKey: 'bookId', onDelete: 'RESTRICT'});
Loan.belongsTo(Book, {foreignKey: 'bookId', onDelete: 'RESTRICT'});
Reader.hasMany(Loan, {foreignKey: 'readerId', onDelete: 'RESTRICT'});
Loan.belongsTo(Reader, {foreignKey: 'readerId', onDelete: 'RESTRICT'});
Book.belongsToMany(Category, {through: BookCategory, foreignKey: 'bookId', otherKey: 'categoryId'});
Category.belongsToMany(Book, {through: BookCategory, foreignKey: 'categoryId', otherKey: 'bookId'});

async function initialize() {
	await sequelize.authenticate();
	await sequelize.sync();
}

export {
	initialize,
	Author,
	Book,
	Reader,
	Loan,
	Category,
	BookCategory
};
