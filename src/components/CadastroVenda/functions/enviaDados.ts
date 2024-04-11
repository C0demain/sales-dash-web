import axios from 'axios';

export default function enviarDadosParaBackend(cpf: string, registration_Date:string, clientName:string, cell_Phone:string, cep:string, neighborhood:string, city:string, state:string, street:string, number:string, product_Code:string, date_Sale:string, seller_Code:string) {
  // Substitua 'url_do_seu_backend' pela URL do seu servidor backend
  const url = 'http://localhost:3000/api/v1/auth/register';

  // Crie o objeto com os dados que você deseja enviar
  const userData = {
    "cpf": cpf, 
    "registration_date": registration_Date, 
    "client_name": clientName, 
    "cell_phone": cell_Phone, 
    "cep": cep, 
    "neighborhood": neighborhood, 
    "city": city, 
    "state": state, 
    "street": street, 
    "number": number, 
    "product_code": product_Code, 
    "date_sale": date_Sale, 
    "seller_code": seller_Code
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
