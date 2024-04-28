import axios from 'axios';

export function enviarDadosParaBackend(title: string, percentage: number|undefined) {
  
  const url = 'http://localhost:8000/api/v1/commissions/register';

  const userData = {
    'title': title,
    'percentage': percentage
  };

  axios.post(url, userData)
    .then(response => {
      console.log('Dados enviados com sucesso:', response.data);
      
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    
    });
}