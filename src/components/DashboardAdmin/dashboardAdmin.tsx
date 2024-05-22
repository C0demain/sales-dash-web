import ListSells from "components/ListSell/ListSells";
import './index.css'
import Navbargest from "components/AdminNavbar/AdminNavbar";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import RankingSellers from "components/RankingSellers/rankingSellers";
import BasicLineChart from "components/LineChart/LineChart";
import BarChart from "components/Barchart/BarChart";

function DashboardAdmin() {
    return(
        <NavbarWrapper>
        <Navbargest/>
        <div className="container">
            <h1 className="tituloDashboard">Dashboard Gestor</h1>
            <div className="box">
                <BasicLineChart/>
            </div>
            <div className="box">
                <BarChart/>
            </div>
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

export default DashboardAdmin;
