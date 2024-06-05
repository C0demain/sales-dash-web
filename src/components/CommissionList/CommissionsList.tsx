import { Button, Empty, Modal, Form, Input, message, Table, TableColumnsType, Spin } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useAuth } from "context/AuthProvider/useAuth";
import './index.css';
import { apiInstance } from "services/api";

interface Commission {
    id: number;
    title: string;
    percentage: number;
}

const CommissionsList: React.FC = () => {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCommission, setCurrentCommission] = useState<Commission | null>(null);
    const [form] = Form.useForm();
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    const getCommissions = async () => {
        try {
            const response = await apiInstance.get<{ commissions: Commission[] }>('http://localhost:8000/api/v1/commissions/getAll');
            setCommissions(response.data.commissions);
            setLoading(false);
            setDataLoaded(true);
        } catch (error) {
            console.error("Erro ao buscar comissões:", error);
            message.error('Erro ao buscar comissões. Por favor, tente novamente.');
        }
    };

    useEffect(() => {
        getCommissions();
    }, []);

    const handleEdit = (commission: Commission) => {
        setCurrentCommission(commission);
        form.setFieldsValue({
            title: commission.title,
            percentage: commission.percentage * 100,
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
            const response = await apiInstance.put(`http://localhost:8000/api/v1/commissions/${currentCommission.id}`, updatedCommission);

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

    const columns: TableColumnsType<Commission> = [
        {
            title: 'Título',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Porcentagem',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (text: number) => `${text * 100}%`,
        },
    ];

    if (isAdmin()) {
        columns.push({
            title: 'Ações',
            key: 'actions',
            render: (_: any, record: Commission) => (
                <>
                    <Button className="button-edit" onClick={() => handleEdit(record)}>Editar</Button>
                </>
            ),
        });
    }

    return (
        <NavbarWrapper>
            <Navbar />
            <div className="container">
                <div className="commissions">
                    <Spin spinning={loading}>
                        {dataLoaded && commissions.length === 0 ? (
                            <Empty description="Nenhuma comissão encontrado" />
                        ) : (
                            <>
                                {commissions.length > 0 && (
                                    <>
                                        <h1 className="commissionTitle">Comissões</h1>
                                        <Table
                                            columns={columns}
                                            dataSource={commissions}
                                            rowKey="id"
                                            pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 30] }}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </Spin>
                </div>
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
        </NavbarWrapper>
    );
};

export default CommissionsList;
