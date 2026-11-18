const {ready, sanitize, Student} = require('./repository');

const plain = student => student && student.get({plain: true});

module.exports = {
	async getRecords() {
		await ready;
		return (await Student.findAll({order: [['lastName', 'ASC'], ['firstName', 'ASC']]}))
			.map(plain);
	},
	async getRecord(id) {
		await ready;
		return plain(await Student.findByPk(id));
	},
	async addRecord(record) {
		await ready;
		return (await Student.create(sanitize(record))).id;
	},
	async saveRecord(id, record) {
		await ready;
		const [count] = await Student.update(sanitize(record), {where: {id}});
		return count > 0;
	},
	async removeRecord(id) {
		await ready;
		return (await Student.destroy({where: {id}})) > 0;
	}
};
