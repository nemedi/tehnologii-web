import { useReducer } from "react";

function initialize(value) {
    return {count: parseInt(value)};
}

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: Math.max(state.count - 1, 0)};
        case 'reset':
            return initialize(action.payload);
        default:
            throw new Error(`Unknown action type '${action.type}'.`);
    }
}

function Counter({value}) {
    const [state, dispatch] = useReducer(reducer, value, initialize);
    return (
        <div>
            <button onClick={() => dispatch({type: 'decrement'})}>-</button>
            <span>{state.count}</span>
            <button onClick={() => dispatch({type: 'increment'})}>+</button>
            <button onClick={() => dispatch({type: 'reset', payload: value})}>Reset</button>
        </div>
    );
}

export default Counter;