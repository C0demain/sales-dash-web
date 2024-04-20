import axios from 'axios';

export function sendData(userName: string, segment: string, cpf: string) {
  // Substitua 'url_do_seu_backend' pela URL do seu servidor backend
  const url = 'http://localhost:8000/api/v1/clients/register';

  // Crie o objeto com os dados que você deseja enviar
  const userData = {
    'name':userName,
    'segment': segment,
    'cpf': cpf
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

export function isValidCPF(value: string): boolean {
    if (typeof value !== 'string') {
        return false;
    }

    value = value.replace(/[^\\d]+/g, '');

    if ((value.length !== 11 && value.length !== 14) || !!value.match(/(\\d)\\1 {10}/)) {
        return false;
    }

    const values = value.split('').map(el => +el);
    const rest = (count: number) => (values.slice(0, count - 12).reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10;

    return rest(10) === values[9] && rest(11) === values[10];
}