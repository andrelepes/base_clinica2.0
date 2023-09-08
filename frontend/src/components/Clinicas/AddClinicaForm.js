import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ClinicaContext } from '../../contexts/ClinicaContext';
import { useClinicaId } from '../../contexts/ClinicaIdContext';  // Import the new context

function UpdateClinicaForm({ initialData = {}, onFormSubmit }) {
    const { clinica, setClinica } = useContext(ClinicaContext);
    const { clinicaId, setClinicaId } = useClinicaId();  // Use the new context

    const defaultData = useMemo(() => ({
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        cep: '',
        endereco: ''
    }), []);

    const [formData, setFormData] = useState({ ...defaultData, ...clinica });

    useEffect(() => {
        console.log('Dados da clínica do contexto:', clinica);
        const mappedClinica = { ...clinica, cpf: clinica.cpfCnpj }; // Mapeando cpfcnpj para cpf
        setFormData(prev => ({ ...defaultData, ...mappedClinica }));
        console.log('Dados do formulário:', formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clinica, defaultData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mappedFormData = { ...formData, cpfCnpj: formData.cpf }; // Mapeando cpf para cpfcnpj
        onFormSubmit(mappedFormData);
        setClinica(mappedFormData);

        // Update clinicaId if needed
        setClinicaId(mappedFormData.id || clinica.id);

        // Forçar um recarregamento da página
        window.location.reload();
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem' }}>
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="cpf">CNPJ:</label>
            <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />

            <label htmlFor="cep">CEP:</label>
            <input type="text" id="cep" name="cep" value={formData.cep} onChange={handleChange} required />

            <label htmlFor="endereco">Endereço:</label>
            <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required />

            <label htmlFor="telefone">Telefone:</label>
            <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />

            <div></div> {/* Espaço vazio para alinhar o botão à direita */}
            <button type="submit">
                Atualizar Clínica
            </button>
        </form>
    );
}

export default UpdateClinicaForm;

