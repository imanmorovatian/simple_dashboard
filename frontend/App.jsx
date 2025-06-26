import React, { useState } from 'react';
import SensorWidget from './SensorWidget';

function App() {
  const [widgets, setWidgets] = useState([]);
  const [inputId, setInputId] = useState("");

  const addWidget = () => {
    setWidgets([...widgets, inputId]);
    setInputId("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <input value={inputId} onChange={e => setInputId(e.target.value)} />
      <button onClick={addWidget}>Add Widget</button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {widgets.map(id => (
          <SensorWidget key={id + Math.random()} sensorId={id} />
        ))}
      </div>
    </div>
  );
}

export default App;
