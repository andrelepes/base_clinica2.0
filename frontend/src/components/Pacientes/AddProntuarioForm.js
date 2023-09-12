import React, { useState, useEffect, useMemo } from 'react';

function AddProntuarioForm({ initialData = {}, onFormSubmit }) {
    const defaultData = useMemo(() => ({
        data_prontuario: '',
        notas_sessao: ''
    }), []);

    const [formData, setFormData] = useState(defaultData);

    useEffect(() => {
        const formatInitialData = {
            ...initialData,
            data_prontuario: initialData.data_prontuario ? new Date(initialData.data_prontuario).toISOString().split('T')[0] : ''
        };
        setFormData({ ...defaultData, ...formatInitialData });
    }, [initialData, defaultData]);

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
            <label htmlFor='data_prontuario'>Data:</label>
            <input type='date' id='data_prontuario' name='data_prontuario' value={formData.data_prontuario} onChange={handleChange} required />

            <label htmlFor='notas_sessao'>Notas da Sessão:</label>
            <textarea id='notas_sessao' name='notas_sessao' value={formData.notas_sessao} onChange={handleChange} required></textarea>

            <button type='submit'>
                {(initialData && initialData.prontuario_id) ? 'Atualizar Prontuário' : 'Adicionar Prontuário'}
            </button>
        </form>
    );
}

export default AddProntuarioForm;
