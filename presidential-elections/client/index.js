window.onload = async function() {
    document.getElementById('chart')
        .pieChart(async () => await (await fetch('/results')).json(), {
            title: 'Rezultate alegeri prezidentiale 2024',
            colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFC133', '#33FFF2', '#8D33FF',
                '#FF8C33', '#33D4FF', '#FF333F', '#4DFF33', '#FF33D4', '#FFD633', '#338CFF']
        });
};