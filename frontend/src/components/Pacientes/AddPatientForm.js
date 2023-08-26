import React, { useState, useEffect } from 'react';

function AddPatientForm({ initialData = {}, onFormSubmit }) {
    const defaultData = {
        cpf: '',
        nome: '',
        data_nascimento: '',
        telefone: '',
        email: '',
        cep: '',
        endereco: ''
    };

    const [formData, setFormData] = useState({ ...defaultData, ...initialData });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const formattedInitialData = initialData ? {
            ...initialData,
            data_nascimento: initialData.data_nascimento ? initialData.data_nascimento.split("T")[0] : ""
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

        const formattedCPF = formData.cpf.replace(/[.-]/g, '');
        const newPatientData = {
            ...formData,
            cpf: formattedCPF
        };

        onFormSubmit(newPatientData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
            <label htmlFor="cpf">CPF:</label>
            <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />

            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />

            <label htmlFor="data_nascimento">Data de Nascimento:</label>
            <input type="date" id="data_nascimento" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />

            <label htmlFor="telefone">Telefone:</label>
            <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="cep">CEP:</label>
            <input type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} required />

            <label htmlFor="endereco">Endereço:</label>
            <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required />

            <div></div> {/* Espaço vazio para alinhar o botão à direita */}
            <button type="submit">
                {(initialData && initialData.id) ? 'Atualizar Paciente' : 'Adicionar Paciente'}
            </button>
        </form>
    );
}

export default AddPatientForm;
