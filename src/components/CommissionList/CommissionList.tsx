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
            <h1 className="commissionTitle">Comissões</h1>
                <div className="commissions">
                    {commissions.length > 0 ? 
                        commissions.map((el: any, index: number) => (
                            <Card key={index} bordered={true} className="commissionCard">
                                <Statistic title={<strong>{el.title}</strong>} value={el.percentage*100} suffix="%" />
                            </Card>
                        ))
                    : <Empty description="Nenhuma comissão encontrada" />}
                </div>
                <div className="buttonWrapper">
                    <Button onClick={e => navigate('/commissions/register')}>Adicionar comissão</Button>
                </div>
            </div>
        </NavbarWrapper>
    )
};

export default CommissionList;
