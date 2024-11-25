window.onload = async function() {
    document.getElementById('chart')
        .pieChart(async () => await (await fetch('/results')).json(), {
            title: 'Rezultate alegeri prezidentiale 2024',
            colors: ['#E7869D', '#EF4D54', '#6D9ECE', '#F5B661', '#FFE866', '#A6D6FE', '#6BC48D',
                '#F9A69B', '#7D8AB5', '#A998E3', '#6BA87A', '#6BA1C7', '#8A7EBF', '#E2EB9F']
        });
};