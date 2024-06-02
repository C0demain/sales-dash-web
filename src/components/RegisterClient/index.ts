import axios from 'axios';

export async function sendData(userName: string, segment: string, cpf: string) {

  const url = 'http://localhost:8000/api/v1/clients/register';

  const userData = {
    'name': userName,
    'segment': segment,
    'cpf': cpf
  };

    const response = await axios.post(url, userData)
    if(response.status === 201) console.log("Dados enviados com sucesso")
}