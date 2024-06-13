import { Button, Col, Form, Input, Row, message } from "antd";
import { useAuth } from "context/AuthProvider/useAuth";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useState } from "react";
import logo from '../../images/logo.png'

export const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            await auth.authenticate(values.email, values.password);
            message.success('Login realizado com sucesso!');
            navigate('/dashboardAdmin');
        } catch (error: any) {
            message.error('Email ou senha incorretos. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Row justify="center" align="middle" className="login-container">
            <Col span={12}>
                <div className="form-container">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="login-logo" />
                    </div>

                    <Form
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        onFinish={onFinish}
                        className="form-wrapper"
                    >
                        <Form.Item label="Email" name="email" rules={[{ message: 'Por favor, insira seu email.' }]}>
                            <Input size="large" placeholder="Digite seu email" className="input-with-shadow" />
                        </Form.Item>

                        <Form.Item label="Senha" name="password" className="form-item" rules={[{ message: 'Por favor, insira sua senha.' }]}>
                            <Input.Password size="large" placeholder="Digite sua senha" className="input-with-shadow" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 24 }} className="button-wrapper">
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', backgroundColor: '#001529', height: '40px' }}>
                                Entrar
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};
