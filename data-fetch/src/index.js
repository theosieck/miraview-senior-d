import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import DataTable from './datatable';
import './index.css';

export default function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('https://swapi.dev/api/people')
            .then((response) => response.json())    // http response -> json data
            .then((json) => setData(json.results)); // store json data in local state
    }, []); // [] makes useEffect execute once when component is loaded

    return (
        <div>
            <DataTable data={data} />
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);