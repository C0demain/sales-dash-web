import axios from 'axios';

export async function sendData(name: string) {
  const url = 'http://localhost:8000/api/v1/products/register';

  const userData = {
    'name': name
  };

  try {
    const response = await axios.post(url, userData);
    if (response.status === 201) {
      console.log("Dados enviados com sucesso");
      return response.data;
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    throw error;
  }
}
