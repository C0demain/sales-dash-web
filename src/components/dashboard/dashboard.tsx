import React from "react";
import RankingSellers from "./rankingSellers/rankingSellers";
import ListSells from "./sells/ListSells";
import './index.css'
import Navbargest from "../AdminNavbar/AdminNavbar";
import NavbarWrapper from "../NavbarWrapper/NavbarWrapper";

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

export default Dashboard;
