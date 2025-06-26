import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SensorDashboard() {
  const [sensorIdInput, setSensorIdInput] = useState('');
  const [sensorIds, setSensorIds] = useState([]);
  const [sensorData, setSensorData] = useState({}); // { id: { active: true/false, lastUpdated: Date } }

  // Function to add new sensor ID from input
  const addSensor = () => {
    const id = sensorIdInput.trim();
    if (id && !sensorIds.includes(id)) {
      setSensorIds([...sensorIds, id]);
      setSensorIdInput('');
    }
  };

  // Fetch sensor data whenever sensorIds changes or periodically
  useEffect(() => {
    sensorIds.forEach(id => {
      axios.get(`http://localhost:5000/sensors/${id}`)
        .then(res => {
          setSensorData(prev => ({
            ...prev,
            [id]: { active: res.data.active, lastUpdated: new Date() }
          }));
        })
        .catch(() => {
          setSensorData(prev => ({
            ...prev,
            [id]: { active: false, lastUpdated: new Date() }
          }));
        });
    });
  }, [sensorIds]);

  return (
    <div>
      <h1>Sensor Dashboard</h1>

      <input
        type="text"
        value={sensorIdInput}
        onChange={e => setSensorIdInput(e.target.value)}
        placeholder="Enter sensor ID"
      />
      <button onClick={addSensor}>Add Sensor</button>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {sensorIds.map(id => {
          const sensor = sensorData[id];
          let color = 'gray'; // default (no data yet)
          if (sensor) {
            if (new Date() - sensor.lastUpdated > 5000) color = 'gray'; // stale after 5 sec
            else color = sensor.active ? 'green' : 'red';
          }
          return (
            <div
              key={id}
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: color,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px'
              }}
            >
              ID: {id}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SensorDashboard;
