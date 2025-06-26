import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SensorDashboard() {
  const [sensorIdInput, setSensorIdInput] = useState('');
  const [sensorIds, setSensorIds] = useState([]);
  const [sensorData, setSensorData] = useState({}); // { id: { active: true/false, lastUpdated: Date, countdown: number } }

  // Add new sensor and initialize countdown to 5 seconds
  const addSensor = () => {
    const id = sensorIdInput.trim();
    if (id && !sensorIds.includes(id)) {
      setSensorIds(prev => [...prev, id]);
      setSensorIdInput('');

      axios.get(`http://localhost:5000/sensors/${id}`)
        .then(res => {
          setSensorData(prev => ({
            ...prev,
            [id]: { active: res.data.active, lastUpdated: new Date(), countdown: 5 }
          }));
        })
        .catch(() => {
          setSensorData(prev => ({
            ...prev,
            [id]: { active: false, lastUpdated: new Date(), countdown: 5 }
          }));
        });
    }
  };

  // Periodically fetch sensor data but do NOT reset countdown
  useEffect(() => {
    if (sensorIds.length === 0) return;

    const interval = setInterval(() => {
      sensorIds.forEach(id => {
        axios.get(`http://localhost:5000/sensors/${id}`)
          .then(res => {
            setSensorData(prev => {
              if (!prev[id]) return prev;
              return {
                ...prev,
                [id]: {
                  ...prev[id],
                  active: res.data.active,
                  lastUpdated: new Date(),
                  countdown: prev[id].countdown, // keep countdown unchanged
                }
              };
            });
          })
          .catch(() => {
            setSensorData(prev => {
              if (!prev[id]) return prev;
              return {
                ...prev,
                [id]: {
                  ...prev[id],
                  active: false,
                  lastUpdated: new Date(),
                  countdown: prev[id].countdown,
                }
              };
            });
          });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [sensorIds]);

  // Countdown timer that decreases countdown once per second, stops at 0
  useEffect(() => {
    const timer = setInterval(() => {
      setSensorData(prevData => {
        let changed = false;
        const updatedData = { ...prevData };

        Object.keys(updatedData).forEach(id => {
          if (updatedData[id].countdown > 0) {
            updatedData[id].countdown -= 1;
            changed = true;
          }
        });

        return changed ? updatedData : prevData;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          let color = 'gray'; // default gray if no data or expired

          if (sensor) {
            color = sensor.countdown === 0
              ? 'gray'
              : sensor.active
                ? 'green'
                : 'red';
          }

          return (
            <div
              key={id}
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: color,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
              }}
            >
              <div>ID: {id}</div>
              <div>{sensor && sensor.countdown > 0 ? `Time: ${sensor.countdown}s` : 'Expired'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SensorDashboard;
