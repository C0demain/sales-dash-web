import ListSells from "components/ListSell/ListSells";
import './index.css'
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import RankingSellers from "components/RankingSellers/rankingSellers";
import BasicLineChart from "components/LineChart/LineChart";
import BarChart from "components/Barchart/BarChart";
import Navbar from "components/Navbar/Navbar";
import ClientSalesChart from "components/ClientSalesChart/ClientSalesChart";

function DashboardAdmin() {
    return (
        <NavbarWrapper>
            <Navbar />
            <div className="containerDash">
                <div><h1 className="tituloDashboard">Dashboard Gestor</h1></div>
                <div className="chartsBox">
                    <div>
                        <BasicLineChart />
                    </div>
                    <div>
                        <BarChart />
                    </div>
                    <div className="clientSalesChart">
                        <ClientSalesChart />
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
