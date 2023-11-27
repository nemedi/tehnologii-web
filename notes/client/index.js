window.onload = function() {
    const getView = memoizer(async view =>
        await (await fetch(`/views/${view}.html`)).text()
    );
    function render(view, context) {
        $('div').innerHTML = view.render(context);
    }
    async function getNotes() {
        let response = await fetch('/api/notes');
        return response.status === 200
            ? await response.json() : [];
    }
    async function getNote(id) {
        let response = await fetch(`/api/notes/${id}`);
        return response.status === 200
            ? await response.json() : {};
    }
    async function addNote(title, content) {
        let response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `title=${encodeURI(title)}&content=${encodeURI(content)}`
        });
        return response.status === 201;
    }
    async function saveNote(note) {
        let response = await fetch(`/api/notes/${note.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
        return response.status === 204;
    }
    async function removeNote(id) {
        let response = await fetch(`/api/notes/${id}`, {
            method: 'DELETE'
        });
        return response.status === 204;
    }
    async function loadTable() {
        let view = await getView('table');
        let notes = await getNotes();
        render(view, {notes, empty: notes.length === 0});
        $('input[value=Add]').onclick = () => goTo('add');
    };
    async function loadForm(id) {
        let view = await getView('form');
        let note = id ? await getNote(id) : {};
        render(view, {...note});
        let form = $('form');
        form.action = 'javascript:void(0)';
        form.onsubmit = async () => {
            let note = id ? {id} : {};
            new Array(...form.elements)
                .filter(element => element.getAttribute('data'))
                .forEach(element => note[element.getAttribute('data')] = element.value);
            if (id !== undefined && await saveNote(note)
                || id == undefined && await addNote(note.title, note.content)) {
                goTo('home');
            }
        };
        if (id) {
            form.onreset = async () => {
                if (await removeNote(id)) {
                    goTo('home');
                }
            };
        }
        $('input[value=Cancel]').onclick = () => goTo('home');
    };
    router({
        'home': () => loadTable(),
        'add': () => loadForm(),
        'edit/:id': ({id}) => loadForm(id)
    });
    goTo('home');
}