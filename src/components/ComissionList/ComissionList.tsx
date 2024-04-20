import { Button, Card, Empty, Statistic } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './index.css'


const CommissionList = () => {
    const [commissions, setCommissions] = useState<any>([])
    const navigate = useNavigate()

    const getCommissions = async () => {
        const response = await axios.get('http://localhost:8000/api/v1/commissions/getAll')

        setCommissions(response.data.commissions)
    }

    useEffect(()=>{
        getCommissions()
    }, [])

    return (
        <NavbarWrapper>
            <Navbargest/>
            <div className="container commissionList">
                <h1>Comissões</h1>
                {commissions.length > 0 ? 
                <div className="commissions">
                    {commissions.map((el: any) =>
                        <Card bordered={true}>
                            <Statistic title={el.title} value={el.percentage*100} suffix="%"/>
                        </Card>
                    )}
                </div>
                : <Empty description="Nenhuma comissão encontrada" />}
                <Button onClick={e => navigate('/commissions/register')}>Adicionar comissão</Button>
            </div>
        </NavbarWrapper>
    )
};

export default CommissionList;