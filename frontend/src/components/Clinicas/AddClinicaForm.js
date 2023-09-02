import React, { useState, useEffect, useContext } from 'react';
import { ClinicaContext } from '../../contexts/ClinicaContext';

function UpdateClinicaForm({ initialData = {}, onFormSubmit }) {  // Renomeado para UpdateClinicaForm
    const { clinicData, setClinicData } = useContext(ClinicaContext);
    const defaultData = {
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        cep: '',
        endereco: ''
    };

    const [formData, setFormData] = useState({ ...defaultData, ...clinicData });

    useEffect(() => {
        setFormData(prev => ({ ...defaultData, ...clinicData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clinicData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onFormSubmit(formData);
        setClinicData(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />

            <label htmlFor="cpf">CNPJ:</label>
            <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />

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
                Atualizar Clínica  {/* Removido as aspas simples */}
            </button>
        </form>
    );
}

export default UpdateClinicaForm;  // Renomeado para UpdateClinicaForm
