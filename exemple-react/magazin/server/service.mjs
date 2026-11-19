import Sequelize from 'sequelize';

function badRequest(message) {
	return Object.assign(new Error(message), {status: 400});
}

// Operatorii permisi in ?filter= (lista alba).
const OPERATORS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'notLike'];

function checkFields(Model, fields) {
	const known = Object.keys(Model.rawAttributes);
	fields.forEach(field => {
		if (!known.includes(field)) {
			throw badRequest(`Unknown field '${field}'.`);
		}
	});
	return fields;
}

function missing(value) {
	return value === undefined || value === null || value === '';
}

// Valid daca toate atributele obligatorii (nu PK, allowNull === false) sunt prezente.
// Valorile 0 / false sunt acceptate.
function valid(Model, payload) {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
		return false;
	}
	return Object.entries(Model.tableAttributes)
		.every(([name, field]) =>
			field.primaryKey || field.allowNull !== false || !missing(payload[name]));
}

// Pastreaza doar atributele cunoscute (fara PK) din corp.
function sanitize(Model, payload) {
	const body = {};
	Object.entries(payload).forEach(([name, value]) => {
		const field = Model.tableAttributes[name];
		if (field && !field.primaryKey) {
			body[name] = value;
		}
	});
	return body;
}

function where(Model, request) {
	if (!request.query.filter) {
		return undefined;
	}
	return String(request.query.filter).split(',')
		.reduce((filter, condition) => {
			const [field, operator, ...value] = condition.split('-');
			checkFields(Model, [field]);
			if (!OPERATORS.includes(operator) || value.length === 0) {
				throw badRequest(`Invalid condition '${condition}'.`);
			}
			filter[field] = {[Sequelize.Op[operator]]: value.join('-')};
			return filter;
		}, {});
}

function order(Model, request) {
	if (!request.headers['x-sort']) {
		return undefined;
	}
	return request.headers['x-sort'].split(',')
		.map(item => {
			const direction = item.charAt(0);
			if (direction !== '+' && direction !== '-') {
				throw badRequest(`Invalid sort '${item}'.`);
			}
			const [field] = checkFields(Model, [item.substring(1)]);
			return [field, direction === '+' ? 'ASC' : 'DESC'];
		});
}

function attributes(Model, request) {
	return request.headers['x-fields']
		? checkFields(Model, request.headers['x-fields'].split(','))
		: undefined;
}

async function getRecords(Model, request, response) {
	const records = await Model.findAll({
		where: where(Model, request),
		order: order(Model, request),
		attributes: attributes(Model, request)
	});
	if (records.length > 0) {
		response.status(200).json(records);
	} else {
		response.status(204).send();
	}
}

async function getRecord(Model, request, response) {
	const record = await Model.findByPk(request.params.id, {
		attributes: attributes(Model, request)
	});
	if (record) {
		response.status(200).json(record);
	} else {
		response.status(404).send();
	}
}

async function checkRecord(Model, request, response) {
	const found = await Model.findByPk(request.params.id);
	response.status(found ? 200 : 404).send();
}

async function createRecord(Model, request, response) {
	if (valid(Model, request.body)) {
		const record = await Model.create(sanitize(Model, request.body));
		response.status(201)
			.location(`${request.protocol}://${request.hostname}:${request.socket.localPort}${request.baseUrl}${request.url.replace(/\/$/, '')}/${record.id}`)
			.send();
	} else {
		response.status(400).send();
	}
}

async function changeRecord(Model, request, response) {
	const record = await Model.findByPk(request.params.id);
	if (record) {
		if (valid(Model, request.body)) {
			await record.update(sanitize(Model, request.body));
			response.status(204).send();
		} else {
			response.status(400).send();
		}
	} else {
		response.status(404).send();
	}
}

async function modifyRecord(Model, request, response) {
	const record = await Model.findByPk(request.params.id);
	if (record) {
		if (!request.body || typeof request.body !== 'object') {
			return response.status(400).send();
		}
		await record.update(sanitize(Model, request.body));
		response.status(204).send();
	} else {
		response.status(404).send();
	}
}

async function removeRecords(Model, request, response) {
	await Model.destroy({where: {}});
	response.status(204).send();
}

async function removeRecord(Model, request, response) {
	const record = await Model.findByPk(request.params.id);
	if (record) {
		await record.destroy();
		response.status(204).send();
	} else {
		response.status(404).send();
	}
}

// Subresurse N:M. Modelul de legatura are cheia primara compusa:
// prima cheie = membrul, a doua cheie = gazda.
function keys(Submodel) {
	const [member, host] = Submodel.primaryKeyAttributes;
	return {member, host};
}

async function getSubrecords(Submodel, request, response) {
	const {member, host} = keys(Submodel);
	const subrecords = await Submodel.findAll({
		where: {[host]: request.params.id},
		attributes: [member]
	});
	if (subrecords.length > 0) {
		response.status(200).json(subrecords);
	} else {
		response.status(204).send();
	}
}

async function removeSubrecords(Submodel, request, response) {
	const {host} = keys(Submodel);
	await Submodel.destroy({where: {[host]: request.params.id}});
	response.status(204).send();
}

async function addSubrecord(Submodel, request, response) {
	const {member, host} = keys(Submodel);
	await Submodel.findOrCreate({
		where: {[host]: request.params.id, [member]: request.params.key}
	});
	response.status(204).send();
}

async function removeSubrecord(Submodel, request, response) {
	const {member, host} = keys(Submodel);
	const subrecord = await Submodel.findOne({
		where: {[host]: request.params.id, [member]: request.params.key}
	});
	if (subrecord) {
		await subrecord.destroy();
		response.status(204).send();
	} else {
		response.status(404).send();
	}
}

export {
	getRecords,
	getRecord,
	checkRecord,
	createRecord,
	changeRecord,
	modifyRecord,
	removeRecords,
	removeRecord,
	getSubrecords,
	removeSubrecords,
	addSubrecord,
	removeSubrecord
};
