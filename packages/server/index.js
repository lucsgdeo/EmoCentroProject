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
const AGENDAMENTOS_FILE = path.join(__dirname, 'data', 'agendamentos.json');

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

// Helper to read agendamentos
const readAgendamentos = () => {
  try {
    if (!fs.existsSync(AGENDAMENTOS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(AGENDAMENTOS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    logger.error(`Erro ao ler arquivo agendamentos.json: ${err.stack}`);
    return [];
  }
};

// Helper to write agendamentos
const writeAgendamentos = (agendamentos) => {
  try {
    fs.writeFileSync(AGENDAMENTOS_FILE, JSON.stringify(agendamentos, null, 2), 'utf8');
  } catch (err) {
    logger.error(`Erro ao escrever arquivo agendamentos.json: ${err.stack}`);
  }
};

// Helper function to get user from token
const getUserByToken = (token) => {
  if (token === 'Bearer mock-jwt-token') {
    return { email: 'admin@example.com' }; 
  }
  if (token && token.startsWith('Bearer ')) {
    return { email: 'admin@example.com' }; // Simplificando para o ambiente acadêmico
  }
  return null;
};

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
  const user = getUserByToken(authHeader);
  if (!user) {
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

  logger.info(`Hemocentro ${nome} cadastrado por ${user.email} com sucesso`);
  res.status(201).json(novoHemocentro);
});

// AGENDAMENTOS ROUTES

app.get('/api/agendamentos', (req, res) => {
  const authHeader = req.headers.authorization;
  const user = getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const agendamentos = readAgendamentos();
  const userAgendamentos = agendamentos.filter(a => a.userEmail === user.email);
  res.json(userAgendamentos);
});

app.post('/api/agendamentos', (req, res) => {
  const authHeader = req.headers.authorization;
  const user = getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { hemocentroId, data, horario } = req.body;
  if (!hemocentroId || !data || !horario) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const agendamentos = readAgendamentos();
  const novoAgendamento = {
    id: agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1,
    userEmail: user.email,
    hemocentroId,
    data,
    horario
  };

  agendamentos.push(novoAgendamento);
  writeAgendamentos(agendamentos);

  logger.info(`Agendamento criado para ${user.email} no hemocentro ${hemocentroId} em ${data} ${horario}`);
  res.status(201).json(novoAgendamento);
});

app.put('/api/agendamentos/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  const user = getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { data, horario } = req.body;

  const agendamentos = readAgendamentos();
  const index = agendamentos.findIndex(a => a.id == id && a.userEmail === user.email);

  if (index === -1) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }

  agendamentos[index].data = data || agendamentos[index].data;
  agendamentos[index].horario = horario || agendamentos[index].horario;

  writeAgendamentos(agendamentos);

  logger.info(`Agendamento ${id} atualizado para ${user.email}`);
  res.json(agendamentos[index]);
});

app.delete('/api/agendamentos/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  const user = getUserByToken(authHeader);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  let agendamentos = readAgendamentos();
  const initialLength = agendamentos.length;
  
  agendamentos = agendamentos.filter(a => !(a.id == id && a.userEmail === user.email));

  if (agendamentos.length === initialLength) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }

  writeAgendamentos(agendamentos);

  logger.info(`Agendamento ${id} removido por ${user.email}`);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
