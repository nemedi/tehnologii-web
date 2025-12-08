window.onload = async function() {
    document.getElementById('chart')
        .pieChart(async () => await (await fetch('/results')).json(), {
            title: 'Rezultatele alegerilor pentru primarul Bucurestiului 2025',
            radius: 180,
            colors: ['#FFF370', '#FFA04D', '#F79C9E', '#7FB1E0', '#5CB3A8', '#FFD8A6', '#9B8AE3',
                '#FFB3C7', '#B89AD8', '#99E6FF', '#99FFEE', '#CCB8FF', '#FFF0A6', '#F7B7A3', '#7FB6AC']
        });
};