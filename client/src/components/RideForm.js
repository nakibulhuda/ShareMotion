import { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function RideForm(){
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [seats, setSeats] = useState(1);
  const [status, setStatus] = useState('Open');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Match backend shape + types
    const newRide = {
      startLocation: { address: startLocation },   // was string → now object
      endLocation:   { address: endLocation },     // was string → now object
      dateTime: new Date(dateTime).toISOString(),  // send ISO string
      basePrice: Number(basePrice),                // ensure number
      seats: Number(seats) || 1,
      status
    };

    try {
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.post(`${API}/api/rides`, newRide, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      alert('Ride posted successfully!');
      // reset
      setStartLocation('');
      setEndLocation('');
      setDateTime('');
      setBasePrice('');
      setSeats(1);
      setStatus('Open');
      console.log('Created ride:', data);
    } catch (err) {
      const statusCode = err?.response?.status;
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      console.error('POST /api/rides failed:', err?.response || err);
      alert(`Error posting ride${statusCode ? ` (${statusCode})` : ''}: ${msg}`);
    }
  };

  return (
    <form className="card pad" style={{maxWidth:840, margin:"24px auto"}} onSubmit={handleSubmit}>
      <h2 style={{marginTop:0}}>Post a ride</h2>
      <div className="row two">
        <div>
          <label className="label">Start Location</label>
          <input className="input" type="text" value={startLocation}
                 onChange={(e)=>setStartLocation(e.target.value)} required/>
        </div>
        <div>
          <label className="label">End Location</label>
          <input className="input" type="text" value={endLocation}
                 onChange={(e)=>setEndLocation(e.target.value)} required/>
        </div>
        <div>
          <label className="label">Date & Time</label>
          <input className="input" type="datetime-local" value={dateTime}
                 onChange={(e)=>setDateTime(e.target.value)} required/>
        </div>
        <div>
          <label className="label">Base / Tentative Price</label>
          <input className="input" type="number" min="0" step="1" value={basePrice}
                 onChange={(e)=>setBasePrice(e.target.value)} />
        </div>
        <div>
          <label className="label">Seats</label>
          <input className="input" type="number" min="1" value={seats}
                 onChange={(e)=>setSeats(Number(e.target.value)||1)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
            <option>Open</option><option>Closed</option>
          </select>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button className="btn primary" type="submit">Post Ride</button>
        <button className="btn ghost" type="button" onClick={()=>window.history.back()}>Cancel</button>
      </div>
    </form>
  );
}
