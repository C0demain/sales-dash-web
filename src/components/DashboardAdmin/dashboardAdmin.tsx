import ListSells from "components/ListSell/ListSells";
import './index.css'
import Navbargest from "components/AdminNavbar/AdminNavbar";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import RankingSellers from "components/RankingSellers/rankingSellers";
import BasicLineChart from "components/LineChart/LineChart";
import BarChart from "components/Barchart/BarChart";

function DashboardAdmin() {
    return (
        <NavbarWrapper>
            <Navbargest />
            <div className="containerDash">
                <div style={{ backgroundColor: '#001529', width: '100%', height: '7vh' }}><h1 className="tituloDashboard">Dashboard Gestor</h1></div>
                <div className="chartsBox">
                    <div>
                        <BasicLineChart />
                    </div>
                    <div>
                        <BarChart />
                    </div>
                </div>
                <div className="box">
                    <ListSells />
                </div>
                <div className="divider"></div>
                <div className="box">
                    <RankingSellers />
                </div>
            </div>
        </NavbarWrapper>
    )
}

export default DashboardAdmin;
