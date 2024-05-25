import ListSellsSeller from "components/ListSellSeller/ListSellSeller";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/Navbar/Navbar";
import UserStats from "components/UserStats/UserStats";
import { useState } from "react";
import LineChartSeller from "components/LineChartSeller/LineChartSeller";

function DashboardSeller() {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    return (
        <NavbarWrapper>
            <Navbargest />
            <div className="containerDash">
                <div><h1 className="tituloDashboard">Dashboard Vendedor</h1></div>
                <div className="chartsBox">
                    <LineChartSeller />
                    <UserStats
                        startDateProp={startDate}
                        endDateProp={endDate} />
                </div>
                <div className="box">
                    <ListSellsSeller
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate} />
                </div>
            </div>
        </NavbarWrapper>
    )
}

export default DashboardSeller;