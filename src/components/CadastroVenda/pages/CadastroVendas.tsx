import { useState } from 'react'
import React from 'react'
import './CadastroVendas.css'
import isValidCPF from '../functions/validarCPF'
import enviarDadosParaBackend from '../functions/enviaDados'

function CadastroVendas() {

    const [cpf, setCpf] = useState('')
      const [registration_date,setRegistration_date ] = useState('')
      const [client_name, setClient_name] = useState('')
      const [cell_phone, setCell_phone] = useState('')
      const [cep, setCEP ] = useState('')
      const [neighborhood, setNeighborhood ] = useState('')
      const [city, setCity] = useState('')
      const [state, setState ] = useState('')
      const [street, setStreet] = useState('')
      const [number, setNumber] = useState('')
      const [product_code, setProduct_code ] = useState('')
      const [date_sale, setDate_sale ] = useState('')
      const [seller_code, setSeller_code ] = useState('')
      const [errors, setErrors] = useState({cpf: '', registration_date: '', client_name: '', cell_phone: '', cep:'', neighborhood:'', city:'', state:'', street:'', number:'', product_code: '', date_sale: '', seller_code: ''})
  
      const validate = () => {
          let isValid = true;
          const errors = { cpf: '', registration_date: '', client_name: '', cell_phone: '', cep:'', neighborhood:'', city:'', state:'', street:'', number:'', product_code: '', date_sale: '', seller_code: ''};
  
          if(!cpf){
            errors.cpf = 'É obrigatório confirmar um CPF.'
            isValid = false
        }  else if(isValidCPF(cpf)){
            errors.cpf = 'Esse CPF é inválido, e não precisa dos pontos.'
            isValid = false
        } 


          if (!registration_date) {
              errors.registration_date = 'O Data do cadastro do cliente é obrigatório.';
              isValid = false
          } else if (registration_date.length !== 8 ) {
              errors.registration_date = 'A data tem que possuir o dia, mês e ano, e não precisa dos pontos.';
              isValid = false
          }
  
          if (!client_name) {
            errors.client_name = 'O nome do cliente é obrigatório.';
            isValid = false
        } else if (client_name.length < 3) {
            errors.client_name = 'O nome deve ter mais de 3 caracteres.';
            isValid = false
        }

        if (!cell_phone) {
            errors.cell_phone = 'O telefone é obrigatório.';
            isValid = false
        } else if (cell_phone.length !== 11 ) {
            errors.cell_phone = 'O telefone tem que possuir 11 caracteres, e não precisa dos pontos';
            isValid = false
        }

        if (!cep) {
            errors.cep = 'O CEP é obrigatório.';
            isValid = false
        } else if (cep.length !== 8 ) {
            errors.cep = 'O CEP tem que possuir 8 caracteres, e não precisa dos pontos';
            isValid = false
        }
  
        if (!neighborhood) {
            errors.neighborhood = 'O bairro é obrigatório.';
            isValid = false
        } else if (neighborhood.length < 3 ) {
            errors.neighborhood = 'O bairro deve ter mais que 3 caracteres';
            isValid = false
        }

        if (!city) {
            errors.city = 'A cidade é obrigatório.';
            isValid = false
        } else if (city.length < 3 ) {
            errors.city = 'A cidade deve ter mais que 3 caracteres';
            isValid = false
        }

        if (!state) {
            errors.state = 'O estado é obrigatório.';
            isValid = false
        } else if (state.length < 3 ) {
            errors.state = 'o estado deve ter mais que 3 caracteres';
            isValid = false
        }

        if (!street) {
            errors.street = 'A rua é obrigatório.';
            isValid = false
        } else if (street.length < 3 ) {
            errors.street = 'A rua deve ter mais que 3 caracteres';
            isValid = false
        }

        if (!number) {
            errors.number = 'O numero é obrigatório.';
            isValid = false
        } else if (number.length === 0 ) {
            errors.number = 'O numero não pode ter nenhuma valor.';
            isValid = false
        }
        
        if (!product_code) {
            errors.product_code = 'O código do produto é obrigatório.';
            isValid = false
        } else if (product_code.length === 0 ) {
            errors.product_code = 'O código do produto não pode ter nenhuma valor.';
            isValid = false
        }
        if (!date_sale) {
            errors.date_sale = 'A data de venda é obrigatório.';
            isValid = false
        } else if (date_sale.length !== 8 ) {
            errors.date_sale = 'A data de venda não pode ter nenhuma valor.';
            isValid = false
        }

        if (!seller_code) {
            errors.seller_code = 'O código do vendedor é obrigatório.';
            isValid = false
        } else if (seller_code.length === 0 ) {
            errors.seller_code = 'O código do vendedir não pode ser nulo.';
            isValid = false
        }

  
          setErrors(errors)
          return isValid
      }
      const handleSubmit = (event: any) => {
          event.preventDefault();
          if (validate()) {
              // Lógica de submissão do formulário
              
              enviarDadosParaBackend(cpf, registration_date, client_name, cell_phone, cep, neighborhood, city, state, street, number, product_code, date_sale, seller_code)
          }
      }
  
    return (
    <div className='container1'>
  
        <div className="box">
           
          <form onSubmit={handleSubmit}>
          <h1 className='titulo' color=''>Cadastro de Vendas</h1>
            <div className='alignment'>
            <div className='insertText'>
              <label>CPF:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setCpf(e.target.value)} required />
              {errors.cpf && <p style={{ color: 'red' }}>{errors.cpf}</p>}
            </div>
            
            <div className='insertText' >
              <label>Data do cadastro do cliente:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setRegistration_date(e.target.value)} required/>
              {errors.registration_date && <p style={{ color: 'red' }}>{errors.registration_date}</p>}
            </div>

            <div className='insertText'>
              <label>Nome do cliente:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setClient_name(e.target.value)} required/>
              {errors.client_name && <p style={{ color: 'red' }}>{errors.client_name}</p>}
            </div>
          
            <div className='insertText'>
              <label>Telefone/Celular:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setCell_phone(e.target.value)} required/>
              {errors.cell_phone && <p style={{ color: 'red' }}>{errors.cell_phone}</p>}
            </div>
           
            <div className='insertText'>
              <label>CEP:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setCEP(e.target.value)} required/>
              {errors.cep && <p style={{ color: 'red' }}>{errors.cep}</p>}
            </div>
           
            <div className='insertText'>
              <label>Bairro:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setNeighborhood(e.target.value)} required/>
              {errors.neighborhood && <p style={{ color: 'red' }}>{errors.neighborhood}</p>}
            </div>
            
            <div className='insertText'>
              <label>Cidade:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setCity(e.target.value)} required/>
              {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
            </div>
            
            <div className='insertText'>
              <label>Estado:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setState(e.target.value)} required/>
              {errors.state && <p style={{ color: 'red' }}>{errors.state}</p>}
            </div>
            
            <div className='insertText'>
              <label>Rua:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setStreet(e.target.value)} required/>
              {errors.street && <p style={{ color: 'red' }}>{errors.street}</p>}
            </div>
           
            <div className='insertText'>
              <label>Número:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setNumber(e.target.value)} required/>
              {errors.number && <p style={{ color: 'red' }}>{errors.number}</p>}
            </div>
            
            <div className='insertText'>
              <label>Código do produto:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setProduct_code(e.target.value)} required/>
              {errors.product_code && <p style={{ color: 'red' }}>{errors.product_code}</p>}
            </div>
            
            <div className='insertText'>
              <label>Data da venda:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setDate_sale(e.target.value)} required/>
              {errors.date_sale && <p style={{ color: 'red' }}>{errors.date_sale}</p>}
            </div>
            
            <div className='insertText'>
              <label>Código do vendedor:</label>
  
              <input type="text" placeholder='' onChange={(e)=> setSeller_code(e.target.value)} required/>
              {errors.seller_code && <p style={{ color: 'red' }}>{errors.seller_code}</p>}
            </div>
            </div>
            <div className='botaoEnvia'>
              <button type='submit'>Cadastrar Venda</button>
            </div>
          
          </form>
        </div>
      </div>
    )
} 
  export default CadastroVendas
