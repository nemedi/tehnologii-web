window.onload = async function() {
    document.getElementById('chart')
        .pieChart(async () => await (await fetch('/results')).json(), {
            title: 'Rezultatele alegerilor parlamentare 2024',
            radius: 180,
            percentage: true,
            colors: ['#F79C9E', '#FBAE5E', '#FFF370', '#7FB1E0', '#A3DFF3', '#9B8AE3', '#7FDEAF',
                '#D8F1A8', '#7CCF8D',  '#B292D9', '#E892BA', '#A6EBFF', '#97CAFF', '#7FB6AC', '#E7838A'
            ]
        });
};