import React, { useEffect, useState, useRef } from 'react';

const Input = ({ onChange= () => {}, onFocus = () => {}, onBlur = () => {}, theme, placeholder, defaultValue, validation, validationCallback = () => {}, prepend, append }) => {

    const inputRef = useRef(null);

    const [inputValue, setInputValue] = useState('');
    const [inputValidation, setInputValidation] = useState({
        mount: false,
        valid: null,
        message: {
            show: null,
            code: 0,
            text: ''
        },
        clear: () => {
            setInputValidation((prev) => ({
                ...prev,
                mount: false
            }));
            setInputValue('');
        }
    });
    
    useEffect(() => {
        if (validation) {
            validator();
        }
    }, [inputValue]); 

    useEffect(() => {
        validationCallback({ ...inputValidation, value: inputValue, input: inputRef });
    }, [inputValidation]);

    useEffect(() => {
        if (defaultValue !== undefined) {
            setInputValue(defaultValue);
        }
    }, [defaultValue]);

    const validator = () => {
        const valid = {
            length: (options) => {
                if (options.min) {
                    if (options.min.validOnMount && !inputValidation.mount || !options.min.validOnMount && inputValidation.mount || inputValidation.mount) {
                        if (inputValue.length < options.min.value) {
                            setInputValidation((prev) => ({ 
                                ...prev, 
                                valid: false,
                                message: {
                                    show: options.min.message.show,
                                    code: options.min.message.code,
                                    text: options.min.message.text
                                }
                            }));
                            return {
                                status: false
                            }
                        }
                        setInputValidation((prev) => ({ 
                            ...prev, 
                            valid: true,
                            message: {
                                show: options.min.message.show,
                                code: 0,
                                text: ''
                            }
                        }));
                    }
                }

                if (options.max) {
                    if (options.max.validOnMount && !inputValidation.mount || !options.max.validOnMount && inputValidation.mount || inputValidation.mount) {
                        if (inputValue.length > options.max.value) {
                            setInputValidation((prev) => ({ 
                                ...prev, 
                                valid: false,
                                message: {
                                    show: options.max.message.show,
                                    code: options.max.message.code,
                                    text: options.max.message.text
                                }
                            }));
                            return {
                                status: false
                            }
                        }
                        setInputValidation((prev) => ({ 
                            ...prev, 
                            valid: true,
                            message: {
                                show: options.max.message.show,
                                code: 0,
                                text: ''
                            }
                        }));
                    }
                }

                return {
                    status: true
                }
            },
            regExp: (options) => {
                if (options.validOnMount && !inputValidation.mount || !options.validOnMount && inputValidation.mount || inputValidation.mount) {
                    if (!options.expression.test(inputValue)) {
                        setInputValidation((prev) => ({ 
                            ...prev, 
                            valid: false,
                            message: {
                                show: options.message.show,
                                code: options.message.code,
                                text: options.message.text
                            }
                        }));
                        return {
                            status: false
                        }
                    }
                    setInputValidation((prev) => ({ 
                        ...prev, 
                        valid: true,
                        message: {
                            show: options.message.show,
                            code: 0,
                            text: ''
                        }
                    }));
                }

                return {
                    status: true
                }
            }
        }

        for (const key in validation) {
            if (valid[key]) {
                const result = valid[key](validation[key]);
                if (!result.status) break;
            } else {
                console.log('Validation type not found');
            }
        }

        setInputValidation((prev) => ({ 
            ...prev, 
            mount: true
        }));
    };

    const changeHandler = (e) => {
        setInputValue(e.target.value);
        onChange(e);
    };

    const focusHandler = (e) => {
        onFocus(e);
    };

    const blurHandler = (e) => {
        onBlur(e);
    };

    return (
        <div className={`input-wrapper input-${theme} ${`input-wrapper__status-code__${inputValidation.message.code}`}`}>
            <div className="input-wrapper__content">
                <div className="input-wrapper__content-prepend">
                    {prepend}
                </div>
                <input 
                    onChange={changeHandler} 
                    onFocus={focusHandler} 
                    onBlur={blurHandler} 
                    type="text" 
                    className="input input-full__width" 
                    placeholder={placeholder} 
                    spellCheck="false" 
                    value={inputValue}
                    ref={inputRef}
                />
                <div className="input-wrapper__content-append">
                    {append}
                </div>
            </div>
            <div className="input-wrapper__status-message">
                <span>{inputValidation.message.text}</span>
            </div>
        </div>
    );
};

export default Input;