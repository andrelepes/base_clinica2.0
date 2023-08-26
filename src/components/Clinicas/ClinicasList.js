import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from 'C:/Users/andre/base_clinica/frontend/src/services/api';
import AddClinicaForm from './AddClinicaForm'; // Importe ou crie este componente para adicionar clínicas

function ClinicasList() {
    const [clinicas, setClinicas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingClinica, setEditingClinica] = useState(null);

    useEffect(() => {
        fetchClinicas();
    }, []);

    const fetchClinicas = async () => {
        try {
            const response = await api.get('/clinicas');
            setClinicas(response.data);
        } catch (error) {
            console.error('Erro ao buscar as clínicas:', error);
        }
    }

    const handleNewClinica = async (clinicaData) => {
        try {
            if (editingClinica) {
                await api.put(`/clinicas/${editingClinica.id}`, clinicaData);
                setEditingClinica(null);
            } else {
                await api.post('/clinicas', clinicaData);
            }
            fetchClinicas();
            setShowForm(false);
        } catch (error) {
            console.error('Erro ao adicionar/atualizar clínica:', error);
            alert("Ocorreu um erro ao adicionar/atualizar a clínica.");
        }
    }

    const handleEdit = (id) => {
        const clinicaToEdit = clinicas.find(c => c.id === id);
        setEditingClinica(clinicaToEdit);
        setShowForm(true);
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/clinicas/${id}`);
            fetchClinicas();
        } catch (error) {
            console.error("Erro ao deletar clínica:", error);
            alert("Ocorreu um erro ao deletar a clínica.");
        }
    }

    return (
        <div>
            <h2>Clínica</h2>

            {!showForm && <button onClick={() => setShowForm(true)}>Adicionar Nova Clínica</button>}

            {showForm && <AddClinicaForm onFormSubmit={handleNewClinica} initialData={editingClinica} />}

            <ul>
                {clinicas.map(clinica => (
                    <li key={clinica.id}>
                        <Link to={`/clinicas/${clinica.id}`}>{clinica.nome}</Link>
                        <span onClick={() => handleEdit(clinica.id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>✎</span>
                        <span onClick={() => handleDelete(clinica.id)} style={{ cursor: 'pointer', marginLeft: '5px' }}>🗑️</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClinicasList;
