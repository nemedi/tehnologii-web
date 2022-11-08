HTMLElement.prototype.paintingCanvas = async function(options) {

	if (typeof options === 'undefined') {
		options = {};
	}

	const state = {
		figures: {},
		current: null
	};
  
	function generateid() {
		return 'xxx-xxx-xxx'.replace(/x/g, (c) => {
			return Math.floor(Math.random() * 10);
		});
	}

	this.innerHTML = '';

	const colorInput = document.createElement('input');
	colorInput.type = 'color';
	colorInput.addEventListener('change', event => {
	  context.strokeStyle = event.target.value || 'black';
	});
	this.appendChild(colorInput);
  
	const lineInput = document.createElement('input');
	lineInput.type = 'range';
	lineInput.min = 1;
	lineInput.max = 5;
	lineInput.value = 2;
	lineInput.addEventListener('change', event => {
	  context.lineWidth = event.target.value || 1;
	});
	this.appendChild(lineInput);
  
	const downloadButton = document.createElement('input');
	downloadButton.type = 'button';
	downloadButton.value = 'Download';
	downloadButton.addEventListener('click', event => {
	  const imageName = prompt('Please enter image name');
	  const link = document.createElement('a');
	  link.href = canvas.toDataURL();
	  link.download = imageName || 'drawing';
	  link.click();
	});
	this.appendChild(downloadButton);
  
	const clearButton = document.createElement('input');
	clearButton.type = 'button';
	clearButton.value = 'Clear';
	clearButton.addEventListener('click', event => {
		isDrawing = false;
		context.clearRect(0, 0, canvas.width, canvas.height);
		Object.getOwnPropertyNames(state.figures)
			.forEach(figureId => options.removeFigure && options.removeFigure(figureId));
		state.figures = {};
		state.point = {x: 0, y: 0};
		state.current = null;
	});
	this.appendChild(clearButton);
  
	this.appendChild(document.createElement('br'));
  
	const canvas = document.createElement('canvas');
	canvas.width = options.width ? options.width : 800;
	canvas.height = options.height ? options.height : 600;
	canvas.style.border = 'solid 1px black';
	this.appendChild(canvas);
  
	const context = canvas.getContext('2d');
	function getPoint(event) {
		return {
			x: event.clientX - state.boundings.left,
			y: event.clientY - state.boundings.top
		}
	}
	canvas.addEventListener('mousedown', event => {
		const point = getPoint(event);
		state.current = generateid();
		state.figures[state.current] = {
			color: context.strokeStyle,
			line: context.lineWidth,
			points: []
		};
		context.beginPath();
		context.moveTo(point.x, point.y);
		state.figures[state.current].points.push(point);
		if (options.addFigure) {
			options.addFigure({id: state.current, ...state.figures[state.current]});
		}
	});
	canvas.addEventListener('mousemove', event => {
		const point = getPoint(event);
		if(state.current != null) {
			context.lineTo(point.x, point.y);
			context.stroke();
			state.figures[state.current].points.push(point);
			if (options.addPointToFigure) {
				options.addPointToFigure(state.current, point)
			}
		}
	});
	canvas.addEventListener('mouseup', event => {
		state.current = null;
	});
	if (options.loadFigures) {
		const figures = await options.loadFigures();
		state.figures = {};
		figures.forEach(figure => {
			state.figures[figure.id] = figure;
			delete figure.id;
			context.beginPath();
			context.strokeStyle = figure.color;
			context.lineWidth = figure.line;
			figure.points.forEach((point, index) => {
				if (index === 0) {
					context.moveTo(point.x, point.y);	
				} else {
					context.lineTo(point.x, point.y);
					context.stroke();
				}
				
			});
		});
	}
	state.boundings = canvas.getBoundingClientRect();
	context.strokeStyle = 'black';
	context.lineWidth = 2;
  }