import React, { useState } from 'react';
import axios from 'axios';

const SensorWidget = () => {
  const [sensorId, setSensorId] = useState('');
  const [color, setColor] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/sensors/${sensorId}`);
      const active = res.data.active;

      setColor(active ? 'green' : 'red');

      setTimeout(() => {
        setColor('gray');
      }, 5000);
    } catch (error) {
      console.error(error);
      alert('Sensor not found');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter sensor ID"
          value={sensorId}
          onChange={(e) => setSensorId(e.target.value)}
        />
        <button type="submit">Create Widget</button>
      </form>

      {color && (
        <div
          style={{
            marginTop: 20,
            width: 100,
            height: 100,
            backgroundColor: color,
            border: '1px solid black',
          }}
        />
      )}
    </div>
  );
};

export default SensorWidget;
