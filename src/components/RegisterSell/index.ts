import axios from 'axios';

export function sendData(date: string, seller: string, client: string, product: number, value: number) {

  const url = 'http://localhost:8000/api/v1/sells/register';

  const userData = {
    'date': date,
    'seller_cpf': seller,
    'cpf_client': client,
    'product_id': product,
    'value' : value
  };

  axios.post(url, userData)
    .then(response => {
      console.log('Dados enviados com sucesso:', response.data);
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}