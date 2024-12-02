HTMLElement.prototype.pieChart = async function(getData, options) {
    this.innerHTML = '<h2>Loading data...</h2>';
    if (!options) {
        options = {};
    }
    if (!options.colors) {
        options.colors = ['#52D726', '#FFEC00', '#FF7300', '#FF0000', '#007ED6', '#7CDDDD'];
    }
    if (!options.precision) {
        options.precision = 2;
    }
    if (!options.radius) {
        options.radius = 100;
    }
    if (!options.total) {
        options.total = 100;
    }
    const data = getData.constructor.name === 'AsyncFunction'
        ? await getData() : getData();
    this.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2 * options.radius;
    this.appendChild(canvas);
    const context = canvas.getContext('2d');
    const total = Object.values(data).reduce((sum, value) => sum += value, 0);
    if (options.percentage) {
        options.total = total;
    }
    let currentAngle = 0;
    let colorIndex = 0;
    const table = document.createElement('table');
    html = options.title ? `<tr><td colspan="3"><b>${options.title}</b></td></tr>` : '';
    Object.entries(data).forEach(([label, value]) => {
        let portionAngle = (value / total) * 2 * Math.PI;
        portionAngle = portionAngle * options.total / 100;
        context.beginPath();
        context.arc(options.radius, options.radius, options.radius, currentAngle, currentAngle + portionAngle);
        currentAngle += portionAngle;
        context.lineTo(options.radius, options.radius);
        context.fillStyle = options.colors[colorIndex];
        context.fill();
        let factor = Math.pow(10, options.precision);
        let printableValue = (Math.round(factor * 100 * value / total) / factor) + '';
        if (printableValue.indexOf('.') === -1) {
            printableValue += '.';
        }
        while (printableValue.indexOf('.') >= printableValue.length - options.precision) {
            printableValue += '0';
        }
        html += `<tr>
                    <td>
                        <div style="width:1em;height:1em;background-color:${options.colors[colorIndex]}"></div>
                    </td>
                    <td align="right">${printableValue}%</td>
                    <td width="100%" nowrap>${label}</td>
                </tr>`;
        colorIndex++;
    });
    table.innerHTML = html;
    this.appendChild(table);
}