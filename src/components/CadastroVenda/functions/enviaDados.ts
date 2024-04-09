import axios from 'axios';

export default function enviarDadosParaBackend(cpf: string, dataCadastroCliente:string, clientName:string, Telefone:string, cep:string, bairro:string, cidade:string, estado:string, rua:string, numero:string, codigoProduto:string, dataVenda:string, codigoVendendor:string) {
  // Substitua 'url_do_seu_backend' pela URL do seu servidor backend
  const url = 'http://localhost:8000/api/v1/auth/CadastroVenda';

  // Crie o objeto com os dados que você deseja enviar
  const userData = {
    "cpf": cpf, 
    "registration_date": dataCadastroCliente, 
    "client_name": clientName, 
    "cell_phone": Telefone, 
    "cep": cep, 
    "neighborhood": bairro, 
    "city": cidade, 
    "state": estado, 
    "street": rua, 
    "number": numero, 
    "product_code": codigoProduto, 
    "date_sale": dataVenda, 
    "seller_code": codigoVendendor
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