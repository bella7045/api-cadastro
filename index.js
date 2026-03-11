const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const clientesFile = path.join(__dirname, 'clientes.json');

function lerClientes() {
    if (!fs.existsSync(clientesFile)) {
        return [];
    }

    const dados = fs.readFileSync(clientesFile, 'utf-8');
    return JSON.parse(dados || '[]');
}

function salvarClientes(clientes) {
    fs.writeFileSync(clientesFile, JSON.stringify(clientes, null, 2), 'utf-8');
}

app.post('/clientes', (req, res) => {

    const { cpf, nome, idade, endereco, bairro, contato } = req.body;

    if (!cpf || !nome || !idade || !endereco || !bairro || !contato) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const clientes = lerClientes();

    if (clientes.some(c => c.cpf === cpf)) {
        return res.status(400).json({ erro: "CPF já cadastrado" });
    }

    const novoCliente = { cpf, nome, idade, endereco, bairro, contato };

    clientes.push(novoCliente);
    salvarClientes(clientes);

    res.status(201).json({
        mensagem: "Cliente cadastrado com sucesso",
        cliente: novoCliente
    });

});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});