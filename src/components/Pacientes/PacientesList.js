import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Importação adicional
import api from 'C:/Users/andre/base_clinica/frontend/src/services/api';
import AddPatientForm from './AddPatientForm';

function PacientesList() {
    const [pacientes, setPacientes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    useEffect(() => {
        fetchPacientes();
    }, []);

    const fetchPacientes = async () => {
        try {
            const response = await api.get('/pacientes');
            setPacientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar os pacientes:', error);
        }
    }

    const handleNewPatient = async (patientData) => {
        try {
            if (editingPatient) {
                await api.put(`/pacientes/${editingPatient.id}`, patientData);
                setEditingPatient(null);
            } else {
                await api.post('/pacientes', patientData);
            }
            fetchPacientes();
            setShowForm(false);
        } catch (error) {
            console.error('Erro ao adicionar/atualizar paciente:', error);
            if (error.response && error.response.status === 409) {
                alert("CPF já existe na base de dados.");
            } else {
                alert("Ocorreu um erro ao adicionar/atualizar o paciente.");
            }
        }
    }

    const handleEdit = (id) => {
        const patientToEdit = pacientes.find(p => p.id === id);
        setEditingPatient(patientToEdit);
        setShowForm(true);
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/pacientes/${id}`);
            fetchPacientes();
        } catch (error) {
            console.error("Erro ao deletar paciente:", error);
            alert("Ocorreu um erro ao deletar o paciente.");
        }
    }

    return (
        <div>
            <h2>Pacientes</h2>

            {!showForm && <button onClick={() => setShowForm(true)}>Adicionar Novo Paciente</button>}

            {showForm && <AddPatientForm onFormSubmit={handleNewPatient} initialData={editingPatient} />}

            <ul>
                {pacientes.map(paciente => (
                    <li key={paciente.id}>
                        <Link to={`/pacientes/${paciente.id}`}>{paciente.nome}</Link>  {/* Link adicionado */}
                        <span onClick={() => handleEdit(paciente.id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>✎</span> 
                        <span onClick={() => handleDelete(paciente.id)} style={{ cursor: 'pointer', marginLeft: '5px' }}>🗑️</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PacientesList;
