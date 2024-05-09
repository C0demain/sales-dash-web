import ListSellsSeller from "components/ListSellSeller/ListSellSeller";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";
import TotalSellsSeller from "components/TotalSellsSeller/TotalSellsSeller";
import { useState } from "react";

function DashboardSeller () {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    return(
        <NavbarWrapper>
        <Navbargest/>
        <div className="container">
            <h1 className="tituloDashboard">Seu Dashboard</h1>
            <div className="box">
                <ListSellsSeller 
                        onStartDateChange={setStartDate} 
                        onEndDateChange={setEndDate}/>
            </div>
            <div className="box">
                <TotalSellsSeller 
                        startDateProp={startDate} 
                        endDateProp={endDate} />
            </div>
        </div>
        </NavbarWrapper>
    )
}

export default DashboardSeller;