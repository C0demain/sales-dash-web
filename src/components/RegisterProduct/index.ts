import axios from 'axios';

export function sendData(productName: string, description: string, value:number) {
  
  const url = 'http://localhost:8000/api/v1/products/register';

  const userData = {
    'name':productName,
    'description': description,
    'value': value
  };

  axios.post(url, userData)
    .then(response => {
      console.log('Dados enviados com sucesso:', response.data);
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}