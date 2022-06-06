import React, { useState } from 'react';
import logo from './logo.svg';
import axios from 'axios'
import './App.css';

URL = "http://localhost:5000"

function App() {
  const [initialized, setInitialized] = useState(false)
  const [columns, setColumns] = useState([])
  const [windowSize, setWindowSize] = useState(1000)
  const [selectedColumn, setSelectedColumn] = useState("Kingdom_mam")
  const [dgimResult, setDgimResult] = useState(null)

  const getColumns = async () => {
    const res = await axios.get(URL + "/columns");
    setColumns(res.data.columns)
    setInitialized(true);
    return res.data.columns
  }

  const getDgmi = async() => {
    const res = await axios.get(URL + "/dgim?colname=" + selectedColumn + "&window_size=" + windowSize);
    setDgimResult(res.data);
  }

  if (!initialized) {
    getColumns()
  }


  return (
    <div className="App">
      <header className="App-header">
      <div className="container">
        <h1>DGMI Algorithm</h1>
        <br />
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <p>Select a column from the dataframe</p>
            <select className='custom-select' value={selectedColumn} onChange={e => setSelectedColumn(e.target.value)}>
              {columns.map((col, i) => (<option key={col}>{col}</option>))}
            </select>
          </div>
          <div className="col-sm-12 col-md-6">
            <p>Select a window size</p>
            <input type="number" value={windowSize} onChange={e => setWindowSize(e.target.value)} />
          </div>
        </div>
        <button className='btn btn-info m-3' onClick={() => getDgmi()}>Calculate</button>
        {dgimResult ?
        <table className='table table-striped table-bordered' style={{color: '#ffffff'}}>
          <tr>
            <th>Column</th>
            <td>{dgimResult.colname}</td>
          </tr>
          <tr>
            <th>Window Size</th>
            <td>{dgimResult.window_size}</td>
          </tr>
          <tr>
            <th>DGIM</th>
            <td>{dgimResult.dgmi_result}</td>
          </tr>
          <tr>
            <th>Real number of ones</th>
            <td>{dgimResult.real_ones}</td>
          </tr>
        </table>
        : null }
      </div>
      </header>
    </div>
  );
}

export default App;
