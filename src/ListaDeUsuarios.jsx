import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import './listadeusuarios.css';
import axios from 'axios';

//Pegando as informações da API pelo GET
const ListaDeUsuarios = () => {
    const [infos, setInfos] = useState([])
    useEffect(() => {
        axios.get('https://www.mocky.io/v2/5d531c4f2e0000620081ddce', {
            method: 'GET',
        }).then((resposta) => {setInfos(resposta.data)})
    }, [])

// Mock com lista de cartões para teste
const cards = [
    // cartão válido
    {
      card_number: '1111111111111111',
      cvv: 789,
      expiry_date: '01/18',
    },
    // cartão inválido
    {
      card_number: '4111111111111234',
      cvv: 123,
      expiry_date: '01/20',
    },
];

// Função para pegar a escolha do cartão do input select
const escolhaDoCartao = (event) => {
    setValorCartao(event.target.value);
}

// Ações dos modals
const [abrirPagamento, setAbrirPagamento] = useState("none"); // Para abrir modal de pagamento
const [pegarUsuario, setPegarUsuario] = useState(""); // Para pegar o nome do usuário
const [abrirPagou, setAbrirPagou] = useState("none"); // Para abrir modal com recibo de pagamento
const [abrirRecebeu, setAbrirRecebeu] = useState("flex"); // Para msg de erro de pagamento
const [abrirNaoRecebeu, setAbrirNaoRecebeu] = useState("none"); // Para msg de erro de pagamento
const [valorCartao, setValorCartao] = useState("1"); // Para pegar o cartão escolhido para pagamento
const [valorDinheiro, setValorDinheiro] = useState(""); // Para pegar o valor de pagamento digitado
const [validarCampo, setValidarCampo] = useState("none"); // Para validar campo de valor digitado
const [validarSaldo, setValidarSaldo] = useState("none"); // Para validar Saldo de valor digitado
const [saldoCaixa, setSaldoCaixa] = useState(3000); // Valor da carteira

// Função para abrir o modal de pagamento do usuário
const abrirModalPagar = (name) => {
    setAbrirPagamento("flex")
    setPegarUsuario(name)
}

const fecharPrimeiroModal = (name) => {
    setAbrirPagamento("none")
    setValidarCampo("none")
    setValidarSaldo("none")
    setValorDinheiro("")
}

// Função que abre o modal de recibo de pagamento 
const abrirModalPagou = () => {
    if (valorDinheiro === "") {
        setValidarCampo("flex");
    } else {
        if (valorCartao === "1") {
            let y = validarPagamento()
            console.log(y);
            if (y === true) {
                setAbrirRecebeu("flex");
                setAbrirNaoRecebeu("none")
                setAbrirPagou("flex");
            }
        } else {
            setAbrirRecebeu("none");
            setAbrirNaoRecebeu("flex")
            setAbrirPagou("flex");
        }
        /* setAbrirPagamento("none"); */        
        /* setValorDinheiro(""); */
        setValidarCampo("none");
    }
}

const validarPagamento = (param) => {
    let x = valorDinheiro.replace('R$', '')
    x = parseInt(x.replace(',', ''))
    if (x <= saldoCaixa) {
        setSaldoCaixa(saldoCaixa - x)
        setValidarSaldo("none")
        param = true
        return param
    } else {
        setValidarSaldo("flex")
        param = false
        return param
    }
}

// Função para fechar o modal do recibo de pagamento
const fecharModal = () => {
    setAbrirPagou("none");
    setValidarCampo("none")
    setValidarSaldo("none")
    setAbrirPagamento("none");
    setValorDinheiro("")
}

// Função para validar campo de valor para pagamento do usuário
const valorInput = (event) => {
    setValorDinheiro(event.target.value);
    setValidarCampo("none");
}

// Renderizando na tela as informações recebidas da API 
    return (
        <>
        <header>
            <div className='header'>
                <div className='class-user'>
                    <img className='user-logo' src="https://img.icons8.com/small/128/000000/user-male-circle.png"/>
                    <h3 className='user-title'>Felippe Alves de Paula</h3>
                </div>
                <div className='class-saldo'>
                    <p>Saldo:</p>
                    <p className='saldo-caixa'>{saldoCaixa}</p>
                </div>
            </div>
        </header>
        <div className='desktop-layout'>
            {infos.map(item => (
                
                <div className="container" key={item.index}>
                    <div className="content">
                        <img className="thumbnail" src={item.img} alt="Foto do usuário" />
                        <div className="infos">   
                            <p>Nome do Usuário: {item.name}</p>
                            <p>Username: {item.username}</p>
                        </div>
                        <button className="botao-pagar" onClick={()=>{abrirModalPagar(item.name)}}>Pagar</button>
                    </div>
                </div>
            ))}
        </div>

            {/*--------------------------------Abrir Modal de pagamento----------------------------------*/}
            <div className="abrirModal" style={{display: abrirPagamento}}>
                <div className="texto-cabecalho-modal">
                    <p className='modal-title'>Pagamento para <span>{pegarUsuario}</span></p>
                    <div>
                        <button className="btn-fechar" onClick={()=>{fecharPrimeiroModal()}}>X</button>
                    </div>
                </div>
                <div className="valorInput">
                    <NumberFormat thousandSeparator={true} value={valorDinheiro} onChange={valorInput} prefix={'R$ '} inputmode="numeric" placeholder="R$ 0,00"/>
                    <p style={{display:validarCampo}}>Campo obrigatório</p>
                    <p style={{display:validarSaldo}}>Você não tem saldo suficiente</p>
                </div>
                <select value={valorCartao} onChange={escolhaDoCartao}>
                <option value="1">Cartão com final {cards[0].card_number.substr(-4)}</option>
                <option value="2">Cartão com final {cards[1].card_number.substr(-4)}</option>
                </select>
                <button className='btn-pagar' onClick={()=>{abrirModalPagou ()}}>Pagar</button>
            </div>  

            {/*------------------------------Abrir Modal de recibo de pagamento--------------------------------*/}
            <div className="abrirModal" style={{display: abrirPagou}}>
                <p className="texto-cabecalho-modal">Recibo de pagamento</p>
                <p className="pagamento-sucess" style={{display: abrirRecebeu}}>O Pagamento foi concluído com <span className='letter-sucess'>sucesso</span>!</p>
                <p className="pagamento-negative" style={{display: abrirNaoRecebeu}}>O Pagamento <span className='letter-negative'>não</span> foi concluído!</p>
                <button className='btn-pagar' onClick={()=>{fecharModal()}}>Fechar</button>
            </div>
        </>
    )
}

export default ListaDeUsuarios