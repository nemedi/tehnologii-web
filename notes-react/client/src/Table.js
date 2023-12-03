import {useState, useEffect} from 'react';
import {useNavigate, NavLink} from "react-router-dom";

function Table() {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const loadNotes = async () => {
        const response = await fetch ('/api/notes');
        setNotes(response.status === 200 ? await response.json(): []);
    };
    useEffect(() => {loadNotes();}, []);
    return (
        <table>
            <thead>
                <th align="left" nowrap>
                    <b>Note</b>
                </th>
                <th align="center">
                    <input type="button" value="Add" onClick={() => navigate('/add')}/>
                </th>
            </thead>
            <tbody>
            {
                notes.map((note, index) =>
                    <tr key={index}>
                        <td align="left">{note.title}</td>
                        <td align="center">
                            <NavLink to={`/edit/${note.id}`}>Edit</NavLink>
                        </td>
                    </tr>
                )
            }
            </tbody>
            <tfoot>
            {
                notes.length === 0 &&
                <tr>
                    <td colspan="2" align="center">
                        No notes found, press 'Add' to create one.
                    </td>
                </tr>
            }
            </tfoot>
        </table>
    );
  }
  
  export default Table;