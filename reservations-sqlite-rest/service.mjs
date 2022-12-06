import Sequelize from "sequelize";

function valid(Model, payload) {
	return Object.entries(Model.tableAttributes)
		.reduce((valid, [name, field]) => {
		if (valid 
			&& !field.primaryKey
			&& field.allowNull === false && !payload[name]) {
			valid = false;
		}
		return valid;
	}, true);
}

function where(request) {
	if (request.query.filter) {
		return request.query.filter.split(',')
			.reduce((filter, condition) => {
			let data = condition.split('-');
			filter[data[0]] = {[Sequelize.Op[data[1]]] : data[2]};
			return filter;
		}, {});
	} else {
		return undefined;
	}
}

function order(request) {
	if (request.headers['x-sort']) {
		return request.headers['x-sort'].split(',')
			.reduce((sort, field) => {
			sort.push([field.substring(1), field.charAt(0) === '+' ? 'ASC' : 'DESC']);
			return sort;
		}, []);
	} else {
		return undefined;
	}
}

async function getRecords(Model, request, response) {
	let records = await Model.findAll({
		where: where(request),
		order: order(request),
		attributes: request.headers['x-fields']
			? request.headers['x-fields'].split(',') : undefined});
	if (records.length > 0) {
		response.status(200).json(records);
	} else {
		response.status(204).send();
	}
}

async function getRecord(Model, request, response) {
	let record = await Model.findByPk(request.params.id, {
			attributes: request.headers['x-fields']
				? request.headers['x-fields'].split(',') : undefined});
	if (record) {
		response.status(200).json(record);
	} else {
		response.status(404).send();
	}
}

async function checkRecord(Model, request, response) {
	let found = await Model.findByPk(request.params.id);
	response.status(found ? 200 : 404).send();
}

async function createRecord(Model, request, response) {
	if (valid(Model, request.body)) {
		let record = await Model.create(request.body);
		response.status(201)
			.location(`http://${request.headers.host}${request.baseUrl}${request.url}${record.id}`)
			.send();
	} else {
		response.status(400).send();
	}
}

async function changeRecord(Model, request, response) {
	let record = await Model.findByPk(request.params.id);
	if (record) {
		if (valid(Model, request.body)) {
			await record.update(request.body);
			response.status(204).send();
		} else {
			response.status(400).send();
		}
	} else {
		response.status(404).send();
	}
}

async function modifyRecord(Model, request, response) {
	let record = await Model.findByPk(request.params.id);
	if (record) {
		Object.entries(request.body).forEach(([name, value]) =>
			record[name] = value);
		await record.save();
		response.status(204).send();
	} else {
		response.status(404).send();
	}
}

async function removeRecords(Model, request, response) {
	await Model.truncate();
	response.status(204).send();
}

async function removeRecord(Model, request, response) {
	let record = await Model.findByPk(request.params.id);
	if (record) {
		await record.destroy();
		response.status(204).send();
	} else {
		response.status(404).send();
	}
}

async function getSubrecords(Submodel, request, response) {
	let subrecords = await Submodel.findAll({
		where: {
			[Submodel.primaryKeyAttributes[1]]: request.params.id
		},
		attributes: [Submodel.primaryKeyAttributes[0]]
	});
	if (subrecords.length > 0) {
		response.status(200).json(subrecords);
	} else {
		response.status(204).send();
	}
}

async function removeSubrecords(Submodel, request, response) {
	await Submodel.destroy({
		where: {
			[Submodel.primaryKeyAttributes[1]]: request.params.id
		}
	});
	response.status(204).send();
}

async function addSubrecord(Submodel, request, response) {
	await Submodel.create({
		[Submodel.primaryKeyAttributes[1]]: request.params.id,
		[Submodel.primaryKeyAttributes[0]]: request.params.key
	});
	response.status(204).send();
}

async function removeSubrecord(Submodel, request, response) {
	let subrecord = await Submodel.findOne({
		where: {
			[Submodel.primaryKeyAttributes[1]]: request.params.id,
			[Submodel.primaryKeyAttributes[0]]: request.params.key
		}
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