window.onload = async function() {
    document.getElementById('chart')
        .pieChart(async () => await (await fetch('/results')).json(), {
            title: 'Rezultatele alegerilor parlamentare 2024',
            colors: ['#F79C9E', '#FBAE5E', '#FFF370', '#7FB1E0', '#7FDEAF', '#A3DFF3', '#9B8AE3',
                '#D8F1A8', '#7CCF8D',  '#B292D9', '#E892BA', '#A6EBFF', '#7FB6AC', '#97CAFF', '#E7838A'
            ]
        });
};