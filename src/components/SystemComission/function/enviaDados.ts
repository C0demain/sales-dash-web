import axios from 'axios';

export default function enviarDadosParaBackend(title: String, percentage: String) {
  // Substitua 'url_do_seu_backend' pela URL do seu servidor backend
  const url = 'http://localhost:8000/api/v1/commissions/register';

  // Crie o objeto com os dados que você deseja enviar
  const userData = {
    'title': title,
    'percentage': percentage
  };

  // Faça a requisição POST
  axios.post(url, userData)
    .then(response => {
      console.log('Dados enviados com sucesso:', response.data);
      // Trate a resposta do servidor aqui
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
      // Trate o erro aqui
    });
}