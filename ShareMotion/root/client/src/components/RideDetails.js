import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingPage } from './Loading';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function valToAddress(v){
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v.address || v.name || `${v.lat ?? ''} ${v.lng ?? ''}`.trim();
}

export default function RideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  const fetchRide = async () => {
    try {
      const { data } = await axios.get(`${API}/api/rides/${id}`);
      setRide(data);
      
      const userId = localStorage.getItem('userId');
      setIsOwner(data.postedBy?._id === userId || data.host === userId);
    } catch (err) {
      setError('Error fetching ride details');
    }
  };

  const fetchRequests = async () => {
    if (!isOwner) return;
    try {
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.get(`${API}/api/requests/ride/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token') || '';
      await axios.patch(`${API}/api/requests/${requestId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchRequests();
    } catch (err) {
      alert(`Error updating request: ${err.response?.data?.message || err.message}`);
    }
  };

  const sendMessage = (userId) => {
    navigate(`/messages/${userId}`);
  };

  useEffect(() => { fetchRide(); }, [id, fetchRide]);
  useEffect(() => { if (isOwner) fetchRequests(); }, [isOwner, id, fetchRequests]);

  if (error) return <div className="card pad" style={{borderColor:"rgba(239,68,68,.4)"}}>{error}</div>;
  if (!ride) return <LoadingPage message="Loading ride details..." />;

  return (
    <div style={{marginTop:12}}>
      <div className="card pad" style={{marginBottom: 16}}>
        <h2 style={{marginTop:0}}>{valToAddress(ride.startLocation)} ➜ {valToAddress(ride.endLocation)}</h2>
        
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <span className={`badge ${ride.status === 'Open' ? 'open' : ride.status === 'Completed' ? 'completed' : 'closed'}`}>
            {ride.status}
          </span>
          <span className="badge">🪑 {ride.seats} seat{ride.seats > 1 ? "s" : ""}</span>
          <span className="badge">📅 {ride.dateTime ? new Date(ride.dateTime).toLocaleDateString() : ''}</span>
          <span className="badge">⏰ {ride.dateTime ? new Date(ride.dateTime).toLocaleTimeString() : ''}</span>
          <span className="badge">💸 {ride.basePrice ? `${ride.basePrice}` : "Free"}</span>
          {ride.isRecurring && <span className="badge">🔄 Recurring</span>}
        </div>

        <div style={{marginBottom:16}}>
          <strong>Posted by:</strong> {ride.postedBy?.name || 'Unknown'}
          {!isOwner && (
            <button 
              className="btn ghost" 
              style={{marginLeft: 10}}
              onClick={() => sendMessage(ride.postedBy?._id)}
            >
              Message
            </button>
          )}
        </div>

        <div style={{display:"flex",gap:10}}>
          <button className="btn ghost" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      {isOwner && (
        <div className="card pad">
          <h3 style={{marginTop:0}}>Ride Requests ({requests.length})</h3>
          
          {requests.length === 0 ? (
            <div className="empty">No requests yet.</div>
          ) : (
            <div className="list">
              {requests.map(request => (
                <div key={request._id} className="card pad" style={{marginBottom: 8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <strong>{request.requester?.name}</strong>
                      <div style={{fontSize:14,color:"var(--muted)"}}>
                        Bid: ${request.bidPrice} • Status: {request.status}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button 
                        className="btn ghost" 
                        onClick={() => sendMessage(request.requester?._id)}
                      >
                        Message
                      </button>
                      {request.status === 'Pending' && (
                        <>
                          <button 
                            className="btn primary" 
                            onClick={() => updateRequestStatus(request._id, 'Confirmed')}
                          >
                            Accept
                          </button>
                          <button 
                            className="btn ghost" 
                            onClick={() => updateRequestStatus(request._id, 'Cancelled')}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
