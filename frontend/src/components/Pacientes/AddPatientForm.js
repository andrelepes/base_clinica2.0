import React, { useState, useEffect } from 'react';
import { useClinicaId } from '../../contexts/ClinicaIdContext';  // Importar o contexto

function AddPatientForm({ initialData = {}, onFormSubmit }) {
    const { clinicaId, usuarioId } = useClinicaId();  // Usar o contexto para obter clinicaId e usuarioId

    const defaultData = {
        cpf_paciente: '',
        nome_paciente: '',
        data_nascimento_paciente: '',
        telefone_paciente: '',
        email_paciente: '',
        cep_paciente: '',
        endereco_paciente: ''
    };

    const [formData, setFormData] = useState({ ...defaultData, ...initialData });

    useEffect(() => {
        const formattedInitialData = initialData ? {
            ...initialData,
            data_nascimento_paciente: initialData.data_nascimento_paciente ? initialData.data_nascimento_paciente.split('T')[0] : ''
        } : {};

        setFormData(prev => ({ ...defaultData, ...formattedInitialData }));
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedCPF = formData.cpf_paciente.replace(/[.-]/g, '');
        const newPatientData = {
            ...formData,
            cpf_paciente: formattedCPF,
            usuario_id: usuarioId,  // Incluindo o usuario_id aqui
            clinica_id: clinicaId
        };

        onFormSubmit(newPatientData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>

            <label htmlFor='cpf_paciente'>CPF:</label>
            <input type='text' id='cpf_paciente' name='cpf_paciente' value={formData.cpf_paciente} onChange={handleChange} required />

            <label htmlFor='nome_paciente'>Nome:</label>
            <input type='text' id='nome_paciente' name='nome_paciente' value={formData.nome_paciente} onChange={handleChange} required />

            <label htmlFor='data_nascimento_paciente'>Data de Nascimento:</label>
            <input type='date' id='data_nascimento_paciente' name='data_nascimento_paciente' value={formData.data_nascimento_paciente} onChange={handleChange} required />

            <label htmlFor='telefone_paciente'>Telefone:</label>
            <input type='tel' id='telefone_paciente' name='telefone_paciente' value={formData.telefone_paciente} onChange={handleChange} required />

            <label htmlFor='email_paciente'>Email:</label>
            <input type='email' id='email_paciente' name='email_paciente' value={formData.email_paciente} onChange={handleChange} required />

            <label htmlFor='cep_paciente'>CEP:</label>
            <input type='text' id='cep_paciente' name='cep_paciente' value={formData.cep_paciente} onChange={handleChange} required />

            <label htmlFor='endereco_paciente'>Endereço:</label>
            <input type='text' id='endereco_paciente' name='endereco_paciente' value={formData.endereco_paciente} onChange={handleChange} required />

            <div></div>
            <button type='submit'>
                {(initialData && initialData.paciente_id) ? 'Atualizar Paciente' : 'Adicionar Paciente'}
            </button>
        </form>
    );
}

export default AddPatientForm;
