const LoanCalculator = () => {
    // Add style tag for range input styling
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .calculator-container {
                background: rgba(255, 255, 255, 0.90);
               
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(4px);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.18);
                padding: 1.5rem;
            }
            .range-input::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 24px;
                background-color: #FFC600;
                border: 2px solid white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .range-input::-moz-range-thumb {
                width: 24px;
                height: 24px;
                background-color: #FFC600;
                border: 2px solid white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .input-wrapper {
                position: relative;
            }
            .phone-input-container {
                position: relative;
            }
            .phone-prefix {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #000;
                font-size: 16px;
                font-weight: normal;
                z-index: 1;
                pointer-events: none;
            }
            .form-input {
                height: 48px;
                font-size: 16px;
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #D1D5DB;
                border-radius: 6px;
                outline: none;
                transition: border-color 0.2s ease;
            }
            .form-input.phone {
                padding-left: 55px;
            }
            .form-input:focus {
                border-color: #FFC600;
            }
            .form-input.error {
                border-color: #EF4444;
            }
            .error-text {
                color: #EF4444;
                font-size: 14px;
                margin-top: 4px;
            }
            .tooltip-trigger {
                position: relative;
                display: inline-flex;
                align-items: center;
            }
            .tooltip-content {
                visibility: hidden;
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                padding: 8px 12px;
                background-color: #111827;
                color: white;
                font-size: 14px;
                border-radius: 6px;
                white-space: nowrap;
                opacity: 0;
                transition: all 0.2s ease;
                margin-bottom: 8px;
                z-index: 50;
            }
            .tooltip-content::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border-width: 4px;
                border-style: solid;
                border-color: #111827 transparent transparent transparent;
            }
            .tooltip-trigger:hover .tooltip-content {
                visibility: visible;
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const config = window.calculatorConfig || {};
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(config.default_amount || 3000);
    const [term, setTerm] = React.useState(config.default_term || 36);
    const [monthlyPayment, setMonthlyPayment] = React.useState(92.49);
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [errors, setErrors] = React.useState({});

    const validateForm = () => {
        const newErrors = {};
        
        // Email validation
        if (!email) {
            newErrors.email = 'Obligāti aizpildāms lauks';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Nepareizs e-pasta formāts';
        }

        // Phone validation
        if (!phone) {
            newErrors.phone = 'Obligāti aizpildāms lauks';
        } else if (!/^\d{8}$/.test(phone)) {
            newErrors.phone = 'Nepareizs tālruņa numura formāts';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Construct the URL with query parameters
            const queryParams = new URLSearchParams({
                amount: amount,
                term: term,
                email: email,
                phone: phone
            }).toString();
    
            // Redirect to the full calculator page
            window.location.href = `/forma/?${queryParams}`;
        }
    };

    const currentPostId = parseInt(config.post_id);
    const allKredits = window.loanCalculatorData?.kredits || [];
    
    console.log('Current Post ID:', currentPostId);
    console.log('All Kredits:', allKredits);
    console.log('Current URL:', window.location.href);
    
    // Try to find matching kredit based on URL
    const currentUrl = window.location.href;
    const matchingKredit = allKredits.find(kredit => currentUrl.includes(kredit.url));
    
    console.log('Matching Kredit:', matchingKredit);
    
    const kredits = [...allKredits];
    if (matchingKredit) {
        // Move matching kredit to the front
        const index = kredits.findIndex(k => k.url === matchingKredit.url);
        if (index > -1) {
            kredits.unshift(kredits.splice(index, 1)[0]);
        }
    }
    
    const [selectedKredit, setSelectedKredit] = React.useState(matchingKredit || kredits[0] || null);

    React.useEffect(() => {
        const annualRate = (config.interest_rate || 12) / 100;
        const monthlyRate = annualRate / 12;
        const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                       (Math.pow(1 + monthlyRate, term) - 1);
        setMonthlyPayment(payment.toFixed(2));
    }, [amount, term]);

    return React.createElement('div', { 
        className: 'calculator-container'
    }, [
        // Dropdown Header
        React.createElement('div', {
            key: 'dropdown',
            className: 'relative mb-8'
        }, [
            React.createElement('div', {
                onClick: () => setIsDropdownOpen(!isDropdownOpen),
                className: 'flex items-center justify-between cursor-pointer'
            }, [
                React.createElement('div', { 
                    className: 'flex items-center gap-2'
                }, [
                    React.createElement('img', {
                        src: selectedKredit?.icon || '',
                        alt: '',
                        className: 'w-6 h-6 text-blue-500'
                    }),
                    React.createElement('span', { 
                        className: 'text-gray-800 font-medium'
                    }, selectedKredit?.title)
                ]),
                React.createElement('svg', {
                    className: `w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`,
                    viewBox: '0 0 20 20',
                    fill: 'currentColor'
                }, React.createElement('path', {
                    fillRule: 'evenodd',
                    d: 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                }))
            ]),
            isDropdownOpen && React.createElement('div', {
                className: 'absolute w-full mt-2 bg-white rounded-lg shadow-lg z-50 py-1'
            }, [
                // Show selected kredit first
                React.createElement('a', {
                    key: selectedKredit.url,
                    href: selectedKredit.url,
                    className: 'flex items-center gap-2 p-3 hover:bg-gray-50'
                }, [
                    React.createElement('img', {
                        src: selectedKredit.icon,
                        alt: '',
                        className: 'w-6 h-6'
                    }),
                    React.createElement('span', {
                        className: 'text-gray-800'
                    }, selectedKredit.title)
                ]),
                // Show rest of the kredits, excluding the selected one
                ...kredits
                    .filter(kredit => kredit.url !== selectedKredit.url)
                    .map(kredit => 
                        React.createElement('a', {
                            key: kredit.url,
                            href: kredit.url,
                            className: 'flex items-center gap-2 p-3 hover:bg-gray-50'
                        }, [
                            React.createElement('img', {
                                src: kredit.icon,
                                alt: '',
                                className: 'w-6 h-6'
                            }),
                            React.createElement('span', {
                                className: 'text-gray-800'
                            }, kredit.title)
                        ])
                    )
            ])
        ]),

        // Amount Slider
        React.createElement('div', { 
            key: 'amount',
            className: 'mb-8'
        }, [
            React.createElement('div', {
                className: 'flex justify-between mb-2'
            }, [
                React.createElement('span', { className: 'text-gray-700' }, 'Aizdevuma summa'),
                React.createElement('span', { className: 'font-medium' }, `${amount} ${config.currency || '€'}`)
            ]),
            React.createElement('div', { className: 'relative' }, [
                React.createElement('input', {
                    type: 'range',
                    min: config.min_amount || 100,
                    max: config.max_amount || 10000,
                    value: amount,
                    onChange: (e) => setAmount(Number(e.target.value)),
                    style: {
                        width: '100%',
                        height: '6px',
                        WebkitAppearance: 'none',
                        background: `linear-gradient(to right, #FFC600 ${(amount - (config.min_amount || 100)) / ((config.max_amount || 10000) - (config.min_amount || 100)) * 100}%, #e5e7eb ${(amount - (config.min_amount || 100)) / ((config.max_amount || 10000) - (config.min_amount || 100)) * 100}%)`,
                        borderRadius: '5px',
                        outline: 'none',
                        opacity: '1',
                        transition: 'opacity .2s'
                    },
                    className: 'range-input'
                }),
                React.createElement('div', {
                    className: 'absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500'
                }, [
                    React.createElement('span', null, `${config.min_amount || 100}€`),
                    React.createElement('span', null, `${config.max_amount || 10000}€`)
                ])
            ])
        ]),

        // Term Slider
        React.createElement('div', {
            key: 'term',
            className: 'mb-8'
        }, [
            React.createElement('div', {
                className: 'flex justify-between mb-2'
            }, [
                React.createElement('span', { className: 'text-gray-700' }, 'Aizdevuma termiņš'),
                React.createElement('span', { className: 'font-medium' }, `${term} mēn.`)
            ]),
            React.createElement('div', { className: 'relative' }, [
                React.createElement('input', {
                    type: 'range',
                    min: config.min_term || 3,
                    max: config.max_term || 120,
                    value: term,
                    onChange: (e) => setTerm(Number(e.target.value)),
                    style: {
                        width: '100%',
                        height: '6px',
                        WebkitAppearance: 'none',
                        background: `linear-gradient(to right, #FFC600 ${(term - (config.min_term || 3)) / ((config.max_term || 120) - (config.min_term || 3)) * 100}%, #e5e7eb ${(term - (config.min_term || 3)) / ((config.max_term || 120) - (config.min_term || 3)) * 100}%)`,
                        borderRadius: '5px',
                        outline: 'none',
                        opacity: '1',
                        transition: 'opacity .2s'
                    },
                    className: 'range-input'
                }),
                React.createElement('div', {
                    className: 'absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500'
                }, [
                    React.createElement('span', null, `${config.min_term || 3} mēn.`),
                    React.createElement('span', null, `${config.max_term || 120} mēn.`)
                ])
            ])
        ]),

        // Monthly Payment Box
        React.createElement('div', {
            key: 'payment',
            className: 'bg-blue-50 p-4 rounded-lg mb-6'
        }, [
            React.createElement('div', {
                className: 'flex items-center'
            }, [
                React.createElement('span', {
                    className: 'text-2xl font-medium'
                }, `${monthlyPayment} €/mēn.`),
                React.createElement('div', {
                    className: 'tooltip-trigger ml-1'
                }, [
                    React.createElement('svg', {
                        className: 'w-4 h-4 text-blue-500 cursor-help',
                        viewBox: '0 0 20 20',
                        fill: 'currentColor'
                    }, React.createElement('path', {
                        fillRule: 'evenodd',
                        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
                        clipRule: 'evenodd'
                    })),
                    React.createElement('div', {
                        className: 'tooltip-content'
                    }, 'Kredīta kalkulatoram ir ilustratīva nozīme')
                ])
            ]),
            React.createElement('div', {
                className: 'text-sm text-gray-600 mt-1'
            }, 'Ikmēneša maksājums')
        ]),

        // Form
        React.createElement('div', {
            key: 'form',
            className: 'grid grid-cols-2 gap-4 mt-6'
        }, [
            React.createElement('div', {
                className: 'col-span-2 md:col-span-1'
            }, [
                React.createElement('div', {
                    className: 'input-wrapper'
                }, [
                    React.createElement('input', {
                        type: 'email',
                        placeholder: 'Jūsu e-pasts',
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        className: `form-input ${errors.email ? 'error' : ''}`
                    }),
                    errors.email && React.createElement('div', {
                        className: 'error-text'
                    }, errors.email)
                ])
            ]),
            React.createElement('div', {
                className: 'col-span-2 md:col-span-1'
            }, [
                React.createElement('div', {
                    className: 'input-wrapper'
                }, [
                    React.createElement('div', {
                        className: 'phone-input-container'
                    }, [
                        React.createElement('span', {
                            className: 'phone-prefix'
                        }, '+371'),
                        React.createElement('input', {
                            type: 'tel',
                            placeholder: 'Jūsu tālrunis',
                            value: phone,
                            onChange: (e) => {
                                const value = e.target.value;
                                const digits = value.replace(/\D/g, '');
                                if (digits.length <= 8) {
                                    setPhone(digits);
                                }
                            },
                            className: `form-input phone ${errors.phone ? 'error' : ''}`
                        })
                    ]),
                    errors.phone && React.createElement('div', {
                        className: 'error-text'
                    }, errors.phone)
                ])
            ])
        ]),

        // Submit Button
        React.createElement('button', {
            key: 'submit',
            type: 'submit',
            onClick: handleSubmit,
            className: 'text-white py-3 rounded-lg mt-4 font-medium',
            style: {
                backgroundColor: '#22c55e',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                width: '100%',
                display: 'inline-block',
                transition: 'background-color 0.2s ease',
                ':hover': {
                    backgroundColor: '#16a34a'
                }
            }
        }, 'Pieteikties'),

        // Security Note
        React.createElement('div', {
            key: 'security',
            className: 'mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2'
        }, [
            React.createElement('svg', {
                className: 'w-4 h-4',
                viewBox: '0 0 20 20',
                fill: 'currentColor'
            }, React.createElement('path', {
                fillRule: 'evenodd',
                d: 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
            })),
            'Nodrošinām bankas līmeņa aizsardzību Jūsu datiem'
        ])
    ]);
};



document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('loan-calculator-root');
    if (container) {
        ReactDOM.render(React.createElement(LoanCalculator), container);
    }
});

const FullCalculator = () => {
    const [amount, setAmount] = React.useState(0);
    const [term, setTerm] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [personalCode, setPersonalCode] = React.useState('');
    const [income, setIncome] = React.useState('');
    const [politicallyExposed, setPoliticallyExposed] = React.useState(false);
    const [dependents, setDependents] = React.useState(false);
    const [beneficiary, setBeneficiary] = React.useState(false);

    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setAmount(queryParams.get('amount') || 0);
        setTerm(queryParams.get('term') || 0);
        setEmail(queryParams.get('email') || '');
        setPhone(queryParams.get('phone') || '');
    }, []);

    return React.createElement('div', { className: 'full-calculator-container p-6 bg-white rounded-lg shadow-md' }, [
        React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Aizpildiet pieteikumu'),

        // Personal Information
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6' }, [
            React.createElement('div', { className: 'input-wrapper' }, [
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Vārds'),
                React.createElement('input', {
                    type: 'text',
                    value: firstName,
                    onChange: (e) => setFirstName(e.target.value),
                    className: 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                    placeholder: 'Jūsu vārds'
                })
            ]),
            React.createElement('div', { className: 'input-wrapper' }, [
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Uzvārds'),
                React.createElement('input', {
                    type: 'text',
                    value: lastName,
                    onChange: (e) => setLastName(e.target.value),
                    className: 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                    placeholder: 'Jūsu uzvārds'
                })
            ]),
            React.createElement('div', { className: 'input-wrapper' }, [
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Personas kods'),
                React.createElement('input', {
                    type: 'text',
                    value: personalCode,
                    onChange: (e) => setPersonalCode(e.target.value),
                    className: 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                    placeholder: 'Personas kods'
                })
            ]),
            React.createElement('div', { className: 'input-wrapper' }, [
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Ienākumi'),
                React.createElement('input', {
                    type: 'number',
                    value: income,
                    onChange: (e) => setIncome(e.target.value),
                    className: 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                    placeholder: 'Ienākumi'
                })
            ])
        ]),

        // Loan Details
        React.createElement('div', { className: 'mb-6' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Aizdevuma summa'),
            React.createElement('input', {
                type: 'number',
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                className: 'form-input block w-full rounded-md border-gray-300 shadow-sm',
                placeholder: 'Aizdevuma summa'
            })
        ]),
        React.createElement('div', { className: 'mb-6' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Aizdevuma termiņš'),
            React.createElement('input', {
                type: 'number',
                value: term,
                onChange: (e) => setTerm(e.target.value),
                className: 'form-input block w-full rounded-md border-gray-300 shadow-sm',
                placeholder: 'Aizdevuma termiņš'
            })
        ]),

        // Contact Information
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6' }, [
            React.createElement('div', { className: 'input-wrapper' }, [
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'E-pasts'),
                React.createElement('input', {
                    type: 'email',
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    className: 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                    placeholder: 'Jūsu e-pasts'
                })
            ]),
            React.createElement('div', { className: 'input-wrapper' }, [
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Tālrunis'),
                React.createElement('input', {
                    type: 'tel',
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    className: 'form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                    placeholder: 'Jūsu tālrunis'
                })
            ])
        ]),

        // Additional Questions
        React.createElement('div', { className: 'mb-6' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Vai Jūs esat politiski nozīmīga persona?'),
            React.createElement('div', { className: 'flex items-center gap-4' }, [
                React.createElement('label', { className: 'flex items-center' }, [
                    React.createElement('input', {
                        type: 'radio',
                        checked: politicallyExposed,
                        onChange: () => setPoliticallyExposed(true),
                        className: 'form-radio'
                    }),
                    React.createElement('span', { className: 'ml-2' }, 'Jā')
                ]),
                React.createElement('label', { className: 'flex items-center' }, [
                    React.createElement('input', {
                        type: 'radio',
                        checked: !politicallyExposed,
                        onChange: () => setPoliticallyExposed(false),
                        className: 'form-radio'
                    }),
                    React.createElement('span', { className: 'ml-2' }, 'Nē')
                ])
            ])
        ]),
        React.createElement('div', { className: 'mb-6' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Vai Jums ir apgādājamās personas?'),
            React.createElement('div', { className: 'flex items-center gap-4' }, [
                React.createElement('label', { className: 'flex items-center' }, [
                    React.createElement('input', {
                        type: 'radio',
                        checked: dependents,
                        onChange: () => setDependents(true),
                        className: 'form-radio'
                    }),
                    React.createElement('span', { className: 'ml-2' }, 'Jā')
                ]),
                React.createElement('label', { className: 'flex items-center' }, [
                    React.createElement('input', {
                        type: 'radio',
                        checked: !dependents,
                        onChange: () => setDependents(false),
                        className: 'form-radio'
                    }),
                    React.createElement('span', { className: 'ml-2' }, 'Nē')
                ])
            ])
        ]),
        React.createElement('div', { className: 'mb-6' }, [
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Esmu patiess labuma guvējs:'),
            React.createElement('div', { className: 'flex items-center gap-4' }, [
                React.createElement('label', { className: 'flex items-center' }, [
                    React.createElement('input', {
                        type: 'radio',
                        checked: beneficiary,
                        onChange: () => setBeneficiary(true),
                        className: 'form-radio'
                    }),
                    React.createElement('span', { className: 'ml-2' }, 'Jā')
                ]),
                React.createElement('label', { className: 'flex items-center' }, [
                    React.createElement('input', {
                        type: 'radio',
                        checked: !beneficiary,
                        onChange: () => setBeneficiary(false),
                        className: 'form-radio'
                    }),
                    React.createElement('span', { className: 'ml-2' }, 'Nē')
                ])
            ])
        ]),

        // Submit Button
        React.createElement('button', {
            type: 'submit',
            className: 'w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200',
            onClick: () => {
                // Handle form submission
            }
        }, 'Pieteikties')
    ]);
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('full-calculator-root');
    if (container) {
        ReactDOM.render(React.createElement(FullCalculator), container);
    }
});