import { apiInstance } from "services/api";

export async function sendDataSeller(userName: string, email: string, cpf: string, senha: string) {
  const urlSeller = 'http://localhost:8000/api/v1/auth/registerUser';

  const userData = {
    'name': userName,
    'email': email,
    'password': senha,
    'cpf': cpf
  };

  try {
    const response = await apiInstance.post(urlSeller, userData);
    console.log('Response from server (Seller):', response); 
    if (response.status === 201) {
      console.log("Dados enviados com sucesso");
    }
  } catch (error: any) {
    console.error("Erro ao enviar dados do vendedor:", error);
  }
}

export async function sendDataAdmin(name: string, email: string, cpf: string) {
  const urlAdmin = 'http://localhost:8000/api/v1/auth/registerAdmin';

  const userData = {
    'name': name,
    'email': email,
    'cpf': cpf
  };

  try {
    const response = await apiInstance.post(urlAdmin, userData);
    console.log('Response from server (Admin):', response); // Log da resposta do servidor
    if (response.status === 201) {
      console.log("Dados enviados com sucesso");
    }
  } catch (error: any) {
    console.error("Erro ao enviar dados do administrador:", error);
  }
}
