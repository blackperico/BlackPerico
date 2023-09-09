import './App.css';
import React, {useState, useEffect, createContext, useContext, useRef, useReducer, useCallback, useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import Todos from './Todos.js';
{
    class Car {
    constructor(name) {
        this.brand = name;
        //console.log('This is Car class: ' + name);
    }
    fja() {
        return 'I have a ' + this.brand;
    }
}
class Model extends Car{
    constructor(name, mod) {
        super(name);
        this.model = mod;
    }
    show() {
        return 'I have a ' + this.brand + ' ' + this.model; 
    }
}
let myCar = new Model('Golf', '2');
}

{
    class Test {
    constructor() {
        this.yo = 'red';
    }
    fja() {
        console.log(this);
    }
}
class Test2 extends Test{
    constructor() {
        super()
    }
    fja = () => {
        console.log(this);
    }
}

let myTest = new Test();
document.querySelector('.test').addEventListener('click', myTest.fja);
}


{
    let niz = [1, 2, 3, 4, 5];
let promNiz = niz.map((item) => <p key={item.toString()}>{item}</p>);
let rootTest = ReactDOM.createRoot(document.querySelector('#target'));
rootTest.render(promNiz);
}

{
    const vehicle = {
        type: 'car',
        brand: 'Golf',
        model: '2',
        color: 'black',
        year: 2004,
        registration: {
            country: 'Serbia',
            city: 'Beograd'
        }
    }
    let myVehicle = function({year, model, type, brand, color, registration: {country, city}}) {
        const msg = 'My ' + type + ' is a ' + color + ' ' + brand + ' ' + model + ' from ' + year + '.';
        console.log(msg);
        const msg2 = `It's registered in ` + country + ' in ' + city +'.';
        console.log(msg2);
    }
    myVehicle(vehicle);
}

{
    const vehicle = {
        brand: 'Golf',
        model: 2,
        color: 'black'
    }
    const vehicle2 = {
        type: 'car',
        color: 'red',
        year: 2004
    }
    const updatedVehicle = {...vehicle, ...vehicle2};
    console.log(updatedVehicle);
}

/*let n = <table>
    <tr>
        <th>Name</th>
        <th>Surname</th>
        <th>Struka</th>
    </tr>
    <tr>
        <td>Aleksandar</td>
        <td>Stanojevic</td>
        <td>Rektum</td>
    </tr>
    <tr><td>Lazar</td></tr>
    <tr><td>Nikola</td></tr>
</table>;
ReactDOM.createRoot(document.querySelector('#target')).render(n);
*/

{
    function Car(arg) {
        return (
        <>
            <p>I have a {arg.sup.brand}. It's model: {arg.sup.model}</p>
        </>
        )
    }
    function Garage() {
        let carInfo = {
            brand: 'Ford',
            model: 'Mustang'
        }
        let yearInfo ={year: 1998}
        return (
            <>
            <p>What do I have inside?</p>
            <Car sup = {carInfo}/>
            </>
        )
    }
    function Football() {
        function test() {
            console.log('test');
        }
        function show(par) {
            console.log(par);
        }
        //***MULTIPLE FUNCTIONS***
        return <button onClick={(e) => {show(e); test()}}>Click me</button>
    }
    //ReactDOM.createRoot(document.querySelector('#target')).render(<Football/>);
}

{
    function ScoredGoal() {
        return <h1>Goal!!!</h1>
    }
    function MissedGoal() {
        return <h1>Goal missed</h1>
    }
    function Goal(props) {
        let isGoal = props.isGoal;
        if(isGoal)
            return <ScoredGoal/>
        else
            return <MissedGoal/>
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<Goal isGoal = {false}/>)
}

{
    function ListItem(props) {
        return <li>I am a {props.car}.</li>
    }
    function Main() {
        let cars = [{id: 1, brand: 'Golf'},
         {id: 2, brand: 'Honda'},
          {id: 3, brand: 'Peugeot'}];
        return <ul>
            {cars.map((item) => <ListItem key = {item.id} car = {item.brand}/>)}
        </ul>
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<Main />);
}

/*{
    function MyForm() {
        let [info, setInfo] = useState({});
        const [select, setSelect] = useState('default');
        function handleChange(e) {
            setSelect(e.target.value);
        }
        function handleSubmit(username, age) {
            setInfo({name: username, years: age});
            console.log(info);
        }
        return (
            <form onSubmit={(e) => {e.preventDefault(); handleSubmit(document.querySelector('.username').value, (+document.querySelector('.age').value))}}>
                <label>Enter your name:
                    <input type='text'
                    className='username'>

                    </input>
                </label>
                <label>Enter your age:
                    <input type='number'
                    className='age'>

                    </input>
                </label>
                <input type='submit'/>
                <textarea value={'test'}></textarea>
                <select value={select} onChange={handleChange}>
                    <option value='default'>Select one</option>
                    <option value='Aco'>Aco</option>
                    <option value='Lazar'>Lazar</option>
                    <option value='Nikola'>Nikola</option>
                </select>
            </form>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<MyForm/>);
}*/
{
    function MyForm() {
        function handleSubmit(e) {
            let name = e.target.name;
            let value = e.target.value;
            setInfo((prom) => {return {...prom, [name]: value}});
            console.log(info);
        }
        const [info, setInfo] = useState({});
        const [city, setCity] = useState('default');
        const [text, setText] = useState('This is some text.');
        return(
            <form onSubmit={(e) => {e.preventDefault(console.log(info))}}>
                <label>Enter your name:
                    <input type='text' name='name' onChange={handleSubmit}></input>
                </label>
                <label>Enter your age:
                    <input type='number' name='age' onChange={handleSubmit}></input>
                </label>
                <label>Select your city:
                    <select value={city} onChange={(e) => {setCity(e.target.value); setInfo((prom) => {return {...prom, city: e.target.value}})}}>
                        <option value='default'>Select city</option>
                        <option value='Podgorica'>Podgorica</option>
                        <option value='Tivat'>Tivat</option>
                        <option value='Kotor'>Kotor</option>
                        <option value='Budva'>Budva</option>
                        <option value='Bar'>Bar</option>
                    </select>
                </label>
                <input type='submit' />
                <textarea value={text} onChange={(e) => {setText(e.target.value)}}>
                    Test.
                </textarea>
            </form>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<MyForm />);
}

{
    function App() {
        const [count, setCount] = useState(0);
        const [todos, setTodos] = useState(['todo 1', 'todo 2']);
        const increment = () => {
            setCount((c) => c + 1);
        }
        return(
            <>
                <Todos todos={todos} />
                <hr />
                <div>
                    Count: {count}
                    <button onClick={increment}>+</button>
                </div>
            </>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<App />);
}
{
    /*function Yo() {
        const [count, setCount] = useState(0);
        const [test, setTest] = useState(['this', 'is', 'test']);
        return(
            <>
                <button onClick={() => {setTest((prom) => {return[...prom, 'is']})}}></button>
                <Todos count = {count} setCount = {setCount} test = {test} setTest = {setTest}/>
                </>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<Yo />);*/
}
{
    function Test() {
        const [count, setCount] = useState(0);
        const [calc, setCalc] = useState(0);
        useEffect(() => {
            setCalc(count * 2)
        }, [count]);
        useEffect(() => {
            let to = setTimeout(() => {
                setCount(count + 1);
            }, 1000);
            return () => clearTimeout(to);
        }, []);
        return(
            <>
            <h1>I've rendered {count} times!</h1>
            </>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<Test />);
}
{
    const usernameContext = createContext();
    function Component1() {
        const [username, setUsername] = useState('Aleksandar Stanojevic');
        return(
            <>
                <p>Hello {username}.</p>
                <usernameContext.Provider value={username}>
                    <Component2 />
                </usernameContext.Provider>
            </>
        )
    }
    function Component2() {
        return(
            <>
            <p>Component2</p>
            <Component3 />
            </>
        )
    }
    function Component3() {
        return(
            <>
            <p>Component3</p>
            <Component4 />
            </>
        )
    }
    function Component4() {
        return(
            <>
            <p>Component4</p>
            <Component5 />
            </>
        )
    }
    function Component5() {
        const username = useContext(usernameContext);
        return(
            <p>Hello {username}, again!</p>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<Component1 />);
}
{
    function App() {
        const [inputValue, setInputValue] = useState('');
        const count = useRef(0);
        useEffect(() => {count.current = count.current + 1});
        return(
            <>
            <p>Rendered: {count.current} times.</p>
            <input type='text'
            onChange={(e) => {setInputValue(e.target.value)}}></input>
            </>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<App />);
}
{
    const ACTIONS = {
        INCREMENT: 'INCREMENT',
        DECREMENT: 'DECREMENT'
    }
    function reducer(state, action) {
        console.log(action);
        switch(action.type) {
            case ACTIONS.INCREMENT:
                return {count: state.count + 1}
            case ACTIONS.DECREMENT:
                return {count: state.count - 1}
            default:
                return state;
        }
    }
    function App() {
        const [state, dispatch] = useReducer(reducer, {count: 0});
        function increment() {
            dispatch({type: ACTIONS.INCREMENT});
        }
        function decrement() {
            dispatch({type: ACTIONS.DECREMENT});
        }
        return(
            <>
            <button onClick={decrement}>-</button>
            <span>{state.count}</span>
            <button onClick={increment}>+</button>
            </>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<App />);
}
{
    const initialTodos = [
        {
            id: 1,
            title: 'todo 1',
            complete: false
        },
        {
            id: 2,
            title: 'todo 2',
            complete: false
        }
    ];
    function reducer(state, action) {
        switch(action.test) {
            case 'switch':
                return state.map((current) => {
                    if(current.id == action.id)
                        return {...current, complete: !current.complete}
                    else
                        return current;
                })
            default:
                return state;
        }
    }
    function App() {
        const [todos, dispatch] = useReducer(reducer, initialTodos);
        function handleChange(e) {
            dispatch({id: e.id, test: 'switch'});
        }
        return(
            todos.map((todo) => (
                <div key={todo.id}>
                    <label>{todo.title}
                    <input type='checkbox'
                    checked={todo.complete} 
                    onChange={() => handleChange(todo)} />
                    </label>
                </div>
            ))
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<App />);
}
{
    function App() {
        const [count, setCount] = useState(0);
        const [todos, setTodos] = useState([]);
        function increment() {
            setCount(count + 1);
        };
        const addTodo = useCallback(() => {
            setTodos((c) => [...c, 'New todo.']);
        }, [todos]);
        return(
            <>
            <Todos todos={todos} addTodo={addTodo} />
            <button onClick={increment}>{count}</button>
            </>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<App />);
}
{
    function App() {
        const [count, setCount] = useState(0);
        const [todos, setTodos] = useState([]);
        function expensiveFunction(num) {
            console.log('Calculating...');
            for(let i = 0; i < 1000000000; i++)
                num = num + 1;
            return num;
        };
        const calculation = useMemo(() => {expensiveFunction(count)}, [count]);
        function increment() {
            setCount((n) => n + 1);
        };
        function addTodo() {
            setTodos((n) => [...n, 'New todo.']);
        }
        return(
            <>
            <div>
                Count: {count}
                <button onClick={increment}>+</button>
            </div>
            <div>
                <h2>Todos</h2>
                {todos.map((todo, index) => {
                    return <p key={index}>{todo}</p>
                })}
                <button onClick={addTodo}>Add todo</button>
                <hr/>
                <h2>Expensive Calculation</h2>
                {calculation}
            </div>
            </>
        )
    }
    ReactDOM.createRoot(document.querySelector('#target')).render(<App />);
}