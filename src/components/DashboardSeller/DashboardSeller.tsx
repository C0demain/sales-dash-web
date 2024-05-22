import ListSellsSeller from "components/ListSellSeller/ListSellSeller";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";
import TotalSellsSeller from "components/TotalSellsSeller/TotalSellsSeller";
import { useState } from "react";
import LineChartSeller from "components/LineChartSeller/LineChartSeller";

function DashboardSeller () {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    return(
        <NavbarWrapper>
        <Navbargest/>
        <div className="containerDash">
            <div style={{backgroundColor: '#001529', width: '100%', height: '7vh'}}><h1 className="tituloDashboard">Dashboard Vendedor</h1></div>
            <h1 className="tituloDashboard">Dashboard Vendedor</h1>
            <div className="chartsBox">
                <LineChartSeller/>
                <TotalSellsSeller 
                        startDateProp={startDate} 
                        endDateProp={endDate} />
            </div>
            <div className="box">
                <ListSellsSeller 
                        onStartDateChange={setStartDate} 
                        onEndDateChange={setEndDate}/>
            </div>
        </div>
        </NavbarWrapper>
    )
}

export default DashboardSeller;