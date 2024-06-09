import { apiInstance } from "services/api";

export async function updatePassword(newPassword: string) {
    // Função para validar a senha
    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };

    // Verifica se a nova senha atende aos requisitos
    if (!validatePassword(newPassword)) {
        console.error("Erro: A senha deve ter pelo menos 8 caracteres, incluir pelo menos um número e um caractere especial.");
        return { success: false, message: "A senha deve ter pelo menos 8 caracteres, incluir pelo menos um número e um caractere especial." };
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;  
    const email = user.email;  

    if (!userId || !email) {
        console.error("Erro: ID ou email do usuário não encontrado");
        return { success: false, message: "ID ou email do usuário não encontrado" };
    }

    const urlUpdatePassword = `http://localhost:8000/api/v1/auth/user/${userId}`;

    const passwordData = {
        'email': email,
        'password': newPassword
    };

    try {
        const response = await apiInstance.put(urlUpdatePassword, passwordData);
        if (response.status === 200) {
            console.log("Senha atualizada com sucesso");
            return { success: true, message: "Senha atualizada com sucesso" };
        }
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            console.error("Erro: Email não corresponde ao usuário ou senha atual incorreta");
            return { success: false, message: "Email não corresponde ao usuário ou senha atual incorreta" };
        } else {
            console.error("Erro ao atualizar a senha");
            return { success: false, message: "Erro ao atualizar a senha" };
        }
    }
}
