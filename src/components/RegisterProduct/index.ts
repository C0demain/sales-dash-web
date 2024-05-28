import axios from 'axios';

export async function sendData(productName: string, description: string) {

  const url = 'http://localhost:8000/api/v1/products/register';

  const userData = {
    'name': productName,
    'description': description
  };

  const response = await axios.post(url, userData)
  if (response.status === 201) console.log("Dados enviados com sucesso")
}