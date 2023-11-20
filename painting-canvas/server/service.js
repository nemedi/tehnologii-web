const {readRepositoryContent, writeRepositoryContent} = require('./repository');

function getFigures() {
	return Object.entries(readRepositoryContent())
		.map(([id, figure]) => {
			figure.id = id;
			return figure;
		});
}

function addFigure(figure) {
	const figures = readRepositoryContent();
	figures[figure.id] = figure;
	delete figure.id;
	writeRepositoryContent(figures);
}

function addPointToFigure(figureId, point) {
	const figures = readRepositoryContent();
	if (figures.hasOwnProperty(figureId)) {
		figures[figureId].points.push(point);
		writeRepositoryContent(figures);
	}
}

function removeFigure(figureId) {
	const figures = readRepositoryContent();
	if (figures.hasOwnProperty(figureId)) {
		delete figures[figureId];
		writeRepositoryContent(figures);
	}
}

module.exports = {getFigures, addFigure, addPointToFigure, removeFigure};