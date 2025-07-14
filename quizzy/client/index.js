window.addEventListener('load', async function() {
    async function loadQuestion(endpoint) {
        let response = await fetch(endpoint);
        return await response.json();
    }
    function handleCurrentQuestion(question) {
        document.querySelector('.category-area').innerHTML = '';
        document.querySelector('.topic-area').innerHTML = '';
        document.querySelector('.question-area').innerHTML = '';
        document.querySelector('#another-question').disabled = true;
        document.querySelector('#show-answer').disabled = true;
        if (question) {
            document.querySelector('.category-area').innerHTML = question.category ? question.category : '';
            document.querySelector('.topic-area').innerHTML = question.topic ? question.topic : '';
            document.querySelector('.question-area').innerHTML = question.question ? 'Întrebare:' + '<br/>' + question.question.replaceAll("\\n", "<br/>") : '';
            document.querySelector('#another-question').disabled = !question.question || question.question.length === 0;
            document.querySelector('#show-answer').disabled = !question.answer || question.answer.length === 0;
        }
    }
    function handleShowAnswer(question) {
        if (question) {
            document.querySelector('.question-area').innerHTML = question.answer && question.answer.length > 0
                ? 'Răspuns:' + '<br/>' + question.answer.replaceAll("\\n", "<br/>") : '';
        }
        document.querySelector('#show-answer').disabled = true;
        document.querySelector('#another-question').disabled = true;
    }

    let currentQuestion = await loadQuestion('current-question');
    handleCurrentQuestion(currentQuestion);
    document.querySelector('#another-question').addEventListener('click', async () => 
        handleCurrentQuestion(currentQuestion = await loadQuestion('another-question'))
    );    
    document.querySelector('#next-question').addEventListener('click', async () => 
        handleCurrentQuestion(currentQuestion = await loadQuestion('next-question'))
    );
    document.querySelector('#show-answer').addEventListener('click', () => {
        if (currentQuestion) {
            handleShowAnswer(currentQuestion);
        }
    });
    document.querySelector('#reset-question').addEventListener('click', async () => 
        handleCurrentQuestion(await loadQuestion('reset-current-question'))
    );
});
