import React, { useState, useEffect } from 'react';

function getCurrentDateISO() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function AddProntuarioForm({ initialData = {}, onFormSubmit }) {

    const [formData, setFormData] = useState({
        data_hora_agendamento: getCurrentDateISO(),
        notas_sessao: ''
    });

    useEffect(() => {
        if (initialData) {
            const updatedFormData = { ...formData };
    
            if (initialData.data_hora_agendamento) {
                const formattedDate = new Date(initialData.data_hora_agendamento).toISOString().split('T')[0];
                updatedFormData.data_hora_agendamento = formattedDate;
            }
    
            if (initialData.notas_sessao) {
                updatedFormData.notas_sessao = initialData.notas_sessao;
            }
    
            setFormData(updatedFormData);
        }
    }, [initialData]);
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(`handleChange: Setting ${name} to ${value}`);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit:', formData);
        onFormSubmit(formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor='data_hora_agendamento'>Data da sessão:</label>
            <input type='date' id='data_hora_agendamento' name='data_hora_agendamento' value={formData.data_hora_agendamento} onChange={handleChange} required />

            <label htmlFor='notas_sessao'>Notas da Sessão:</label>
            <textarea id='notas_sessao' name='notas_sessao' value={formData.notas_sessao} onChange={handleChange} required></textarea>

            <button type='submit'>
                {(initialData && initialData.prontuario_id) ? 'Atualizar Prontuário' : 'Adicionar Prontuário'}
            </button>
        </form>
    );
}

export default AddProntuarioForm;
