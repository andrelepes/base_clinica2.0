import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function PsicologoSelector({ onPsicologoSelected }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [psicologos, setPsicologos] = useState([]);
    const [filteredPsicologos, setFilteredPsicologos] = useState([]);
    const { clinicaId } = useAuth();

    useEffect(() => {
        const fetchPsicologos = async () => {
            try {
                const response = await api.get(`/usuarios/linked-psychologists/${clinicaId}`);
                const activePsicologos = response.data.filter(psicologo => psicologo.status_usuario !== 'inativo'); // Supondo que você tenha um campo 'status' para os psicólogos
                setPsicologos(activePsicologos);
            } catch (error) {
                console.error("Erro ao buscar psicólogos:", error);
            }
        };
        fetchPsicologos();
    }, [clinicaId]);
    

    useEffect(() => {
        // Filtrar psicólogos com base no termo de pesquisa
        const results = psicologos.filter(psicologo =>
            psicologo.nome_usuario && psicologo.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPsicologos(results);
    }, [searchTerm, psicologos]);

    const handlePsicologoClick = (psicologoId) => {
        onPsicologoSelected(psicologoId);
        setSearchTerm(''); // Limpar o termo de pesquisa após seleção
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Digite o nome do psicólogo"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredPsicologos.map(psicologo => (
                    <li key={psicologo.usuario_id} onClick={() => handlePsicologoClick(psicologo.usuario_id)}>
                        {psicologo.nome_usuario}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default PsicologoSelector;
