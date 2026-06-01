const API_URL = 'http://localhost:3000/api';
let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    fetchHemocentros();

    document.getElementById('search-btn').addEventListener('click', () => {
        const query = document.getElementById('search-input').value.toLowerCase();
        filterHemocentros(query);
    });
});

function initMap() {
    // Centralizado em Diadema por padrão
    map = L.map('map').setView([-23.6898, -46.6217], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

let allHemocentros = [];

async function fetchHemocentros() {
    try {
        const response = await fetch(`${API_URL}/hemocentros`);
        allHemocentros = await response.json();
        renderHemocentros(allHemocentros);
        updateMarkers(allHemocentros);
    } catch (error) {
        console.error('Erro ao buscar hemocentros:', error);
        document.getElementById('hemocentros-list').innerHTML = '<p>Erro ao carregar dados. Verifique se o servidor está rodando.</p>';
    }
}

function renderHemocentros(list) {
    const container = document.getElementById('hemocentros-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p>Nenhum hemocentro encontrado.</p>';
        return;
    }

    list.forEach(h => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${h.nome}</h3>
            <p><strong>Endereço:</strong> ${h.endereco}</p>
            <p><strong>Telefone:</strong> ${h.telefone}</p>
            <button onclick="window.location.href='agendamento.html?id=${h.id}'">Agendar Doação</button>
        `;
        container.appendChild(card);
    });
}

function updateMarkers(list) {
    // Limpa marcadores existentes
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    list.forEach(h => {
        if (h.lat && h.lng) {
            const marker = L.marker([h.lat, h.lng]).addTo(map)
                .bindPopup(`<b>${h.nome}</b><br>${h.endereco}<br><a href="agendamento.html?id=${h.id}">Agendar Agora</a>`);
            markers.push(marker);
        }
    });

    if (list.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function filterHemocentros(query) {
    const filtered = allHemocentros.filter(h => 
        h.nome.toLowerCase().includes(query) || 
        h.endereco.toLowerCase().includes(query)
    );
    renderHemocentros(filtered);
    updateMarkers(filtered);
}
