import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export default function AuthForm({ mode = 'login', onAuth = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = `${API}/api/auth/${mode}`;
      const payload = mode === 'register' ? { name, email, password } : { email, password };
      const { data } = await axios.post(url, payload);

      // persist auth
      localStorage.setItem('token', data.token || '');
      if (data?.user?._id) localStorage.setItem('userId', data.user._id);
      if (data?.user?.name) localStorage.setItem('userName', data.user.name);

      onAuth(data.token, data.user);
      navigate('/rides', { replace: true });
    } catch (err) {
      console.error('Auth error:', err?.response?.data || err.message);
      setError(err?.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'register' ? 'Create account' : 'Login';

  return (
    <div className="card pad" style={{maxWidth:520, margin:"24px auto"}}>
      <h2 style={{marginTop:0}}>{title}</h2>
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div>
            <label className="label">Name</label>
            <input className="input" type="text" value={name}
              onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>
        )}

        <label className="label">Email</label>
        <input className="input" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />

        <label className="label">Password</label>
        <input className="input" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />

        <div style={{display:"flex",gap:10,marginTop:16}}>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : title}
          </button>
          <button className="btn ghost" type="button" onClick={()=>navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
