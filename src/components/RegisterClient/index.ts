import { apiBackend, apiInstance } from 'services/api';

export async function sendData(userName: string, segment: string, cpf: string) {

  const url = `${apiBackend}/api/v1/clients/register`;

  const userData = {
    'name': userName,
    'segment': segment,
    'cpf': cpf
  };

    const response = await apiInstance.post(url, userData)
    if(response.status === 201) console.log("Dados enviados com sucesso")
}