const express = require('express'); //servidor web
const fs = require('fs'); //manipulação de arquivos
const path = require('path'); //manipulação de caminhos
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

/*
CLIENTES ENDEPOINTS
*/
const clientesFile = path.join(__dirname, 'clientes.json');

function lerclientes() {
    if (!fs.existsSync(clientesFile)) {
        return [];

    }
    const dados = fs.readFileSync(clientesFile, 'utf-8');
    try {
        return JSON.parse(dados) || [];
    } catch (e) {
        return [];
    }

}

function salvarClientes(clientes) {
    fs.writeFileSync(clientesFile, JSON.stringify(clientes, null, 2), 'utf-8');
}

app.post('/clientes', (req, res) => {

    const { cpf, nome, idade, endereco, bairro, contato } = req.body;

    if (!cpf || !nome || !idade || !endereco || !bairro || !contato) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    app.get('/clientes', (req, res) => {


    });
    const clientes = lerclientes();

    if (clientes.some(c => c.cpf === cpf)) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
    }

    const novoCliente = { cpf, nome, idade, endereco, bairro, contato };
    clientes.push(novoCliente);
    salvarClientes(clientes);

    res.status(201).json({ message: 'Cliente cadastrado com sucesso', cliente: novoCliente });


});

app.get('/clientes', (req, res) => {
    const clientes = lerclientes();
    res.status(200).send(clientes);

});


/*
PRODUTOS ENDPOINTS
*/
const produtosFile = path.join(__dirname, 'produtos.json');

function lerProdutos() {
    if (!fs.existsSync(produtosFile)) {
        return [];
    }
    const dados = fs.readFileSync(produtosFile, 'utf-8');
    try {
        return JSON.parse(dados) || [];
    } catch (e) {
        return [];
    }
}

function salvarProdutos(produtos) {
    fs.writeFileSync(produtosFile, JSON.stringify(produtos, null, 2), 'utf-8');
}

app.post('/produtos', (req, res) => {
    const { id, nome, valor, descricao } = req.body;

    if (!id || !nome || !valor || !descricao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const produtos = lerProdutos();

    if (produtos.some(p => p.id === id)) {
        return res.status(400).json({ error: 'Produto já cadastrado' });
    }

    const novoProduto = { id, nome, valor, descricao };
    produtos.push(novoProduto);
    salvarProdutos(produtos);

    res.status(201).json({ message: 'Produto cadastrado com sucesso', produto: novoProduto });
});

// GET – listar produtos
app.get('/produtos', (req, res) => {
    const produtos = lerProdutos();
    res.status(200).json(produtos);
});

// GET – buscar produto por ID
app.get('/produtos/:id', (req, res) => {
    const produtos = lerProdutos();
    const produto = produtos.find(p => p.id == req.params.id);

    if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json(produto);
});

/**
 * USUARIOS ENDPOINTS
 */
const usuariosFile = path.join(__dirname, 'usuarios.json');

function lerUsuarios() {
    if (!fs.existsSync(usuariosFile)) {
        return [];

    }
    const dados = fs.readFileSync(usuariosFile, 'utf-8');
    try {
        return JSON.parse(dados) || [];
    } catch (e) {
        return [];
    }

}

function salvarUsuarios(usuarios) {
    fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2), 'utf-8');
}


app.post('/usuarios', (req, res) => {
    const { codigo, nome, email, senha } = req.body;

    if (!codigo || !nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const usuarios = lerUsuarios();

    if (usuarios.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const novoUsuario = { codigo, nome, email, senha };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    res.status(201).json({ message: 'Usuario cadastrado com sucesso', usuario: novoUsuario });
});

app.get('/usuarios', (req, res) => {
    const usuarios = lerUsuarios();
    res.status(200).send(usuarios);
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost: ${port}`);
});
