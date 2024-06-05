import ListSellsSeller from "components/ListSellSeller/ListSellSeller";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import UserStats from "components/UserStats/UserStats";
import { useState, useEffect } from "react";
import LineChartSeller from "components/LineChartSeller/LineChartSeller";
import Navbar from "components/Navbar/Navbar";
import CommissionChartSeller from "components/CommissionChartSeller/CommissionChartSeller";
import { useAuth } from "context/AuthProvider/useAuth";

function DashboardSeller() {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    return (
        <NavbarWrapper>
            <Navbar />
            <div className="containerDash">
                <div><h1 className="tituloDashboard">Dashboard Vendedor</h1></div>
                <div className="chartsBox">
                    <LineChartSeller />
                    <CommissionChartSeller />
                </div>
                <div className="box">
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