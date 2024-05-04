import { Button, Card, Empty, Modal, Form, Input, message, Statistic } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './index.css'
import { useAuth } from "context/AuthProvider/useAuth";

const CommissionList = () => {
    const [commissions, setCommissions] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [currentCommission, setCurrentCommission] = useState<any>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { isAdmin } = useAuth()

    const getCommissions = async () => {
        const response = await axios.get('http://localhost:8000/api/v1/commissions/getAll')
        setCommissions(response.data.commissions)
    }

    useEffect(()=>{
        getCommissions()
    }, [])

    const handleEdit = (commission: any) => {
        setCurrentCommission(commission);
        form.setFieldsValue({
            title: commission.title,
            percentage: commission.percentage * 100
        });
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (!currentCommission) {
                throw new Error('Nenhuma comissão selecionada para atualização.');
            }
            
            const updatedCommission = { ...currentCommission, ...values, percentage: values.percentage / 100 };
            const response = await axios.put(`http://localhost:8000/api/v1/commissions/${currentCommission.id}`, updatedCommission);
            
            if (response.status === 200) {
                setIsModalOpen(false); 
                message.success('Comissão atualizada com sucesso!');
                getCommissions(); 
            } else {
                message.error('Falha ao atualizar a comissão. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao validar campos do formulário ou ao enviar a requisição:', error);
            message.error('Ocorreu um erro ao atualizar a comissão. Por favor, tente novamente.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
                                {isAdmin() && <Button className="button-edit" onClick={() => handleEdit(el)} >Editar</Button>}
                            </Card>
                        ))
                    : <Empty description="Nenhuma comissão encontrada" />}
                </div>
                <div className="buttonWrapper">
                    {isAdmin() && <Button onClick={e => navigate('/commissions/register')}>Adicionar comissão</Button>}
                </div>
                <Modal
                    title="Editar Comissão"
                    open={isModalOpen} 
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="title"
                            label="Título"
                            rules={[{ required: true, message: 'Por favor, insira o título da comissão!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="percentage"
                            label="Porcentagem"
                            rules={[{ required: true, message: 'Por favor, insira a porcentagem da comissão!' }]}
                        >
                            <Input type="number" step="0.01" min="0" max="100" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </NavbarWrapper>
    )
};

export default CommissionList;
