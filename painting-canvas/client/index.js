window.onload = () => {
  document.getElementById('paintingCanvas').paintingCanvas({
    loadFigures: async () => {
      const response = await fetch('/figures');
      const body = await response.json();
      return body;
    },
    addFigure: figure => fetch('/figures',
      {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(figure)}),
    addPointToFigure: (figureId, point) => fetch(`/figures/${figureId}`,
      {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(point)}),
    removeFigure: figureId => fetch(`/figures/${figureId}`, 
      {method: 'DELETE'})
  });
};
