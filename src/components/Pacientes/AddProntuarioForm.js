import React, { useState, useEffect } from 'react';

function AddProntuarioForm({ initialData = {}, onFormSubmit }) {
    const defaultData = {
        data: '',
        notas_sessao: ''
    };

    const formatInitialData = {
        ...initialData,
        data: initialData.data ? new Date(initialData.data).toISOString().split('T')[0] : ''
    };

    const [formData, setFormData] = useState({ ...defaultData, ...formatInitialData });

    useEffect(() => {
        setFormData({ ...defaultData, ...formatInitialData });
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
