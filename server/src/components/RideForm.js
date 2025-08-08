import { useState } from 'react';
import axios from 'axios';

const RideForm = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [basePrice, setBasePrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRide = { startLocation, endLocation, dateTime, basePrice };

    try {
      await axios.post('http://localhost:5000/api/rides', newRide, {
        headers: { Authorization: Bearer ${localStorage.getItem('token')} }
      });
      alert('Ride posted successfully!');
    } catch (err) {
      alert('Error posting ride');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Start Location:</label>
      <input
        type="text"
        value={startLocation}
        onChange={(e) => setStartLocation(e.target.value)}
        required
      />
      <label>End Location:</label>
      <input
        type="text"
        value={endLocation}
        onChange={(e) => setEndLocation(e.target.value)}
        required
      />
      <label>Date and Time:</label>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        required
      />
      <label>Base Price:</label>
      <input
        type="number"
        value={basePrice}
        onChange={(e) => setBasePrice(e.target.value)}
        required
      />
      <button type="submit">Post Ride</button>
    </form>
  );
};

export default RideForm;

