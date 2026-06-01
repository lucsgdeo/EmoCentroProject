const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Helper to read users
const readUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

// Helper to write users
const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing users file:', err);
  }
};

// SEED DATA
const hemocentros = [
  {
    id: 1,
    nome: "Hosp. Estadual Diadema",
    endereco: "R. José Bonifácio, 1641 - Serraria, Diadema - SP",
    telefone: "(11) 3583-1475",
    lat: -23.6936,
    lng: -46.6111
  },
  {
    id: 2,
    nome: "Hosp. Mário Covas",
    endereco: "Rua Dr. Henrique Calderazzo, 321 - Santo André - SP",
    telefone: "(11) 2324-5780",
    lat: -23.6667,
    lng: -46.5333
  },
  {
    id: 3,
    nome: "Colsan SBC",
    endereco: "Rua Pedro Jacobucci, 440 - Jardim das Américas, SBC - SP",
    telefone: "(11) 2111-0007",
    lat: -23.6914,
    lng: -46.5647
  }
];

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

  // Login simples: retorna um token mockado e os dados do usuário
  res.json({ 
    token: 'mock-jwt-token', 
    user: { email: user.email },
    login: true 
  });
});

app.get('/api/hemocentros', (req, res) => {
  res.json(hemocentros);
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
