import React, { useState, useEffect } from 'react';

export default function SensorWidget({ sensorId }) {
  const [color, setColor] = useState("gray");

  useEffect(() => {
    fetch(`http://localhost:5000/sensor/${sensorId}`)
      .then(res => res.json())
      .then(data => {
        if (data.active === true) setColor("green");
        else if (data.active === false) setColor("red");

        setTimeout(() => setColor("gray"), 5000);
      });
  }, [sensorId]);

  return (
    <div style={{
      backgroundColor: color,
      width: "200px",
      height: "100px",
      margin: "10px",
      borderRadius: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontWeight: "bold"
    }}>
      {sensorId}
    </div>
  );
}
