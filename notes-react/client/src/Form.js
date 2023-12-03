import {useState, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
function Form() {
    const navigate = useNavigate();
    const [note, setNote] = useState({
        title: '',
        content: ''
    });
    const {noteId} = useParams();
    const loadNote = async () => {
        if (noteId) {
			const response = await fetch(`/api/notes/${noteId}`);
			setNote(response.status === 200
                ? await response.json()
                : {title: '', content: ''}
            );
		}
    }
    useEffect(() => {loadNote(noteId);}, [noteId]);
    function set(property, value) {
		const record = {...note};
		record[property] = value;
		setNote(record);
	}
    async function saveNote() {
		if (noteId) {
			const response = await fetch(`/api/notes/${noteId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(note)
			});
			if (response.status === 204) {
				navigate('/');
			}
		} else {
            const response = await fetch('/api/notes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `title=${encodeURI(note.title)}&content=${encodeURI(note.content)}`
			});
			if (response.status === 201) {
				navigate('/');
			}			
		}
    }
    async function removeNote() {
        if (noteId) {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: 'DELETE'
            });
            if (response.status === 204) {
                navigate('/');
            }
        }
    }
    return (
        <form onSubmit={saveNote} onReset={() => navigate('/')}>
            <table>
                <tr>
                    <td align="right">
                        <b>Title</b>
                    </td>
                    <td>
                        <input type="text" data="title" value={note.title}
                            onChange={event => set(event.target.getAttribute('data'), event.target.value)}/>
                    </td>
                </tr>
                <tr>
                    <td align="right" valign="top">
                        <b>Content</b>
                    </td>
                    <td>
                        <textarea data="content" rows="20" cols="30"
                            onChange={event => set(event.target.getAttribute('data'), event.target.value)} value={note.content}/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <input type="submit" value="Save"/>
                        {
                            noteId &&
                            <input type="button" value="Remove" onClick={removeNote}/>
                        }
                        <input type="button" value="Cancel" onClick={() => navigate('/')}/>
                    </td>
                </tr>
            </table>
        </form>
    );
  }
  
  export default Form;