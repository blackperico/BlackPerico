import React from "react";
import { memo } from "react";

/*const Todos = ({todos}) => {
    console.log('todos');
    return(
        <>
            <h2>My Todos</h2>
            {todos.map((todo, index) => {
                return <p key={index}>{todo}</p>
            })}
        </>
    )
}

const Todos = ({count, setCount, test, setTest}) => {
    console.log('render');
    return(
        <>
            <p onClick={() => {setTest((prom) => {return [...prom, 'is']})}}>{test}</p>
            Count: {count}
            <button onClick={() => {setCount(count + 1)}}>+</button>
        </>
    )
}
export default memo(Todos);*/


const Todos = ({todos, addTodo}) => {
    console.log('Todo rendered.');
    return(
        <>
        <h2>My todos</h2>
        {todos.map((todo, index) => {
            return <p key={index}>{todo}</p>;
        })}
        <button onClick={addTodo}>Add todo</button>
        </>
        )
}
export default memo(Todos);