import React from "react";
import RankingSellers from "./rankingSellers/rankingSellers";
import ListSells from "./sells/ListSells";
import './dashboard.css'
import Navbargest from "../Barra_lateral/Barra_lateral_gestor";
import NavbarWrapper from "../Barra_lateral/NavbarWrapper/NavbarWrapper";

function Dashboard() {
    return(
        <NavbarWrapper>
        <Navbargest/>
        <div className="container">
            <h1 className="tituloDashboard">Dashboard Geral</h1>
            <div className="box">
                <ListSells/>
            </div>
            <div className="divider"></div>
            <div className="box">
                <RankingSellers/>
            </div>
        </div>
        </NavbarWrapper>
    )
}

export { Dashboard };
