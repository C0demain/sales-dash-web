import React from "react";
import RankingSellers from "./rankingSellers/rankingSellers";
import ListSells from "./sells/ListSells";
import './dashboard.css'

function Dashboard() {
    return(
        <div className="container">
            <h1>Dashboard Geral</h1>
            <div className="box">
                <ListSells/>
            </div>
            <div className="divider"></div>
            <div className="box">
                <RankingSellers/>
            </div>
        </div>
    )
}

export { Dashboard };
