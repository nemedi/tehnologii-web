import React from 'react';
import { useState } from 'react';

function TodoList({values}) {
    
    const [todos, setTodos] = useState(values);
    const [todo, setTodo] = useState('');
    
    function handleChange(e){
        setTodo(e.target.value);
    };

    function handleAdd(e) {
        e.preventDefault();
        setTodos([...todos, todo]);
        setTodo('');
    };

    function handleRemove(index) {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };
      
    return (
        <div>
        <h1>Todo List</h1>
        <form>
            <input type='text' value={todo} onChange={handleChange}/>
            <button onClick={handleAdd}>Add</button>
        </form>
        <ul>
            {todos.map((todo, index) => (
                <li key={todo}>{todo}
                    <button onClick={() => handleRemove(index)}>Remove</button>
                </li>
            ))}
        </ul>
        </div>
    )
}

export default TodoList;