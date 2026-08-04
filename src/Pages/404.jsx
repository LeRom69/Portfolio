import { Link } from "react-router-dom";
import "../css/404.css";

import GridOverlayVert from "../Grids/GridOverlay-Vertical";
import Fog from "../Effects/Fog";

import { useGlobalMouse } from "../Effects/useGlobalMouse";

import { initPointer } from "../js/pointerStore";
import { useEffect } from "react";

export default function NotFound() {
  useGlobalMouse();

  useEffect(() => {
    initPointer();
  }, []);
  return (
    <main className="notfound">
      <Fog />
      <GridOverlayVert />
      <div className="ftf-wrapper">
        <h1>404</h1>
        <div style={{position:"relative", zIndex:"2"}}>
          <div className="shadow" />
          <p>PAGE NOT FOUND</p>
        </div>
      </div>
      <button className="send-btn"><Link to="/">RETURN HOME</Link></button>
    </main>
  );
}