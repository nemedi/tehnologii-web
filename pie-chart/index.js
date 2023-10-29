function createPieChart() {
    document.getElementById('chart')
        .pieChart({
            'Python': 2595,
            'Java': 2124,
            'JavaScript': 826,
            'C#': 762,
            'PHP': 737,
            'Other': 2938
        }, {title: 'Programming Languages'});
}