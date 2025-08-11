import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout(){
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <>
      <nav className="nav">
        <div className="navwrap container">
          <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:700}}>
            <span>🚗 ShareMotion</span>
          </div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <NavLink to="/rides" className={({isActive})=> isActive?"active":""}>Rides</NavLink>
            <NavLink to="/post-ride" className={({isActive})=> isActive?"active":""}>Post Ride</NavLink>
            {isAuthed && (
              <NavLink to="/my-rides" className={({isActive})=> isActive?"active":""}>My Rides</NavLink>
            )}
            {!isAuthed ? (
              <>
                <NavLink to="/login" className={({isActive})=> isActive?"active":""}>Login</NavLink>
                <NavLink to="/register" className={({isActive})=> isActive?"active":""}>Register</NavLink>
              </>
            ) : (
              <>
                <span style={{opacity:.8}}>Hi{userName ? `, ${userName}`:''}</span>
                <button className="btn ghost" onClick={logout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container" style={{paddingTop:20}}><Outlet/></main>
    </>
  );
}
