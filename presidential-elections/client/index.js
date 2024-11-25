window.onload = async function() {
    document.getElementById('chart')
        .pieChart(async () => await (await fetch('/results')).json(), {
            title: 'Rezultatele alegerilor prezidentiale 2024 turul 1',
            colors: ['#E7869D', '#6D9ECE', '#EF4D54', '#F5B661', '#FFE866', '#A6D6FE', '#6BC48D',
                '#F9A69B', '#7D8AB5', '#A998E3', '#6BA87A', '#6BA1C7', '#8A7EBF', '#E2EB9F']
        });
};