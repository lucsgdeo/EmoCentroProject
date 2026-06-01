const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    // Login simples: retorna um token mockado
    return res.json({ token: 'mock-jwt-token', user: { username } });
  }
  res.status(400).json({ error: 'Username and password required' });
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
