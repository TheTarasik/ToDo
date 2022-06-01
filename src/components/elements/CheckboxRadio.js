import React from 'react';

const CheckboxRadio = ({ theme = 'primary', onChange = () => {}, id, value, name, label, defaultChecked }) => {
    return (
        <div className={`checkbox-wrapper checkbox-radio checkbox-radio__${theme}`}>
            <label htmlFor={id} className="checkbox-wrapper__label">
                <input onChange={onChange} type="radio" id={id} className="checkbox" name={name} value={value} defaultChecked={defaultChecked} />
                <span>{label}</span>
            </label>
        </div>
    );
};

export default CheckboxRadio;