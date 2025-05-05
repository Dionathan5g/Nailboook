document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('form-agendamento');
    const lista = document.getElementById('lista-agendamentos');
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    // Atualiza a lista na tela
    function atualizarLista() {
        lista.innerHTML = '';
        
        if (agendamentos.length === 0) {
            lista.innerHTML = '<p class="vazio">Nenhum agendamento cadastrado</p>';
            return;
        }

        // Ordena por data e hora
        agendamentos.sort((a, b) => {
            const dataA = new Date(`${a.data}T${a.hora}`);
            const dataB = new Date(`${b.data}T${b.hora}`);
            return dataA - dataB;
        });

        agendamentos.forEach((agendamento, index) => {
            const item = document.createElement('div');
            item.className = 'agendamento-item';
            item.innerHTML = `
                <div class="agendamento-info">
                    <p>${agendamento.nome}</p>
                    <p>${agendamento.servico} - ${formatarData(agendamento.data)} às ${agendamento.hora}</p>
                </div>
                <button onclick="cancelarAgendamento(${index})" class="btn-cancelar">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            `;
            lista.appendChild(item);
        });
    }

    // Formata a data para exibição
    function formatarData(dataString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    }

    // Formulário de agendamento
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoAgendamento = {
            nome: document.getElementById('nome').value.trim(),
            servico: document.getElementById('servico').value,
            data: document.getElementById('data').value,
            hora: document.getElementById('hora').value
        };

        // Validação simples
        if (!novoAgendamento.nome || !novoAgendamento.servico || !novoAgendamento.data || !novoAgendamento.hora) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        agendamentos.push(novoAgendamento);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        
        form.reset();
        atualizarLista();
        
        // Feedback visual
        alert('Agendamento realizado com sucesso! ✅');
    });

    // Função global para cancelar agendamentos
    window.cancelarAgendamento = function(index) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            agendamentos.splice(index, 1);
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
            atualizarLista();
        }
    };

    // Define a data atual como padrão
    document.getElementById('data').valueAsDate = new Date();
    
    // Inicializa a lista
    atualizarLista();
});