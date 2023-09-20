import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from 'C:/Users/andre/base_clinica/frontend/src/services/api';
import AddPatientForm from './AddPatientForm';
import { useClinicaId } from '../../contexts/ClinicaIdContext';  // Importação adicional

function PacientesList() {
    const [pacientes, setPacientes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const { clinicaId, usuarioId } = useClinicaId();  // Usar o contexto para obter clinicaId e usuarioId

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
            const newPatientData = {
                ...patientData,
                clinica_id: clinicaId  // incluir o clinica_id aqui
            };
            if (editingPatient) {
                await api.put(`/pacientes/${editingPatient.id}`, newPatientData);
                setEditingPatient(null);
            } else {
                await api.post('/pacientes', newPatientData);
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
                        <Link to={`/pacientes/${paciente.id}`}>{paciente.nome}</Link>
                        <span onClick={() => handleEdit(paciente.id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>✎</span>
                        <span onClick={() => handleDelete(paciente.id)} style={{ cursor: 'pointer', marginLeft: '5px' }}>🗑️</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PacientesList;