const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const HEMOCENTROS_FILE = path.join(__dirname, 'data', 'hemocentros.json');

// Helper to read users
const readUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    logger.error(`Erro ao ler arquivo users.json: ${err.stack}`);
    return [];
  }
};

// Helper to write users
const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    logger.error(`Erro ao escrever arquivo users.json: ${err.stack}`);
  }
};

// Helper to read hemocentros
const readHemocentros = () => {
  try {
    if (!fs.existsSync(HEMOCENTROS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(HEMOCENTROS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    logger.error(`Erro ao ler arquivo hemocentros.json: ${err.stack}`);
    return [];
  }
};

// Helper to write hemocentros
const writeHemocentros = (hemocentros) => {
  try {
    fs.writeFileSync(HEMOCENTROS_FILE, JSON.stringify(hemocentros, null, 2), 'utf8');
  } catch (err) {
    logger.error(`Erro ao escrever arquivo hemocentros.json: ${err.stack}`);
  }
};

const agendamentos = [];

// ROUTES

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  const users = readUsers();
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'E-mail já cadastrado' });
  }

  users.push({ email, password });
  writeUsers(users);

  logger.info(`Usuário ${email} criado com sucesso`);
  res.status(201).json({ message: 'Usuário criado com sucesso' });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  logger.info(`Usuário ${email} logou no sistema`);
  // Login simples: retorna um token mockado e os dados do usuário
  res.json({ 
    token: 'mock-jwt-token', 
    user: { email: user.email },
    login: true 
  });
});

app.get('/api/hemocentros', (req, res) => {
  const hemocentros = readHemocentros();
  res.json(hemocentros);
});

app.post('/api/hemocentros', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-jwt-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { nome, endereco, telefone, lat, lng } = req.body;
  if (!nome || !endereco || !telefone || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const hemocentros = readHemocentros();
  const novoHemocentro = {
    id: hemocentros.length > 0 ? Math.max(...hemocentros.map(h => h.id)) + 1 : 1,
    nome,
    endereco,
    telefone,
    lat,
    lng
  };

  hemocentros.push(novoHemocentro);
  writeHemocentros(hemocentros);

  logger.info(`Hemocentro ${nome} cadastrado com sucesso`);
  res.status(201).json(novoHemocentro);
});

app.post('/api/agendamentos', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer mock-jwt-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { hemocentroId, data, horario } = req.body;
  if (!hemocentroId || !data || !horario) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const novoAgendamento = {
    id: agendamentos.length + 1,
    hemocentroId,
    data,
    horario,
    usuario: 'usuario-logado'
  };

  agendamentos.push(novoAgendamento);
  res.status(201).json(novoAgendamento);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
