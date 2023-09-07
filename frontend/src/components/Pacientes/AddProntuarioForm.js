import React, { useState, useEffect, useMemo } from 'react';

function AddProntuarioForm({ initialData = {}, onFormSubmit }) {
    const defaultData = useMemo(() => ({
        data: '',
        notas_sessao: ''
    }), []); // Usando useMemo para memorizar defaultData

    const [formData, setFormData] = useState(defaultData);

    useEffect(() => {
        const formatInitialData = {
            ...initialData,
            data: initialData.data ? new Date(initialData.data).toISOString().split('T')[0] : ''
        };
        setFormData({ ...defaultData, ...formatInitialData });
    }, [initialData, defaultData]); // Adicionado defaultData aqui

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
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="data">Data:</label>
            <input type="date" id="data" name="data" value={formData.data} onChange={handleChange} required />

            <label htmlFor="notas_sessao">Notas da Sessão:</label>
            <textarea id="notas_sessao" name="notas_sessao" value={formData.notas_sessao} onChange={handleChange} required></textarea>

            <button type="submit">
                {(initialData && initialData.id) ? 'Atualizar Prontuário' : 'Adicionar Prontuário'}
            </button>
        </form>
    );
}

export default AddProntuarioForm;

