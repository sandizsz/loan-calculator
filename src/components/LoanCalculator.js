const LoanCalculator = () => {
    const config = window.calculatorConfig || {};
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(config.default_amount || 3000);
    const [term, setTerm] = React.useState(config.default_term || 36);
    const [monthlyPayment, setMonthlyPayment] = React.useState(92.49);
    const kredits = window.loanCalculatorData?.kredits || [];
    const [selectedKredit, setSelectedKredit] = React.useState(kredits[0] || null);

    React.useEffect(() => {
        const annualRate = (config.interest_rate || 12) / 100;
        const monthlyRate = annualRate / 12;
        const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                       (Math.pow(1 + monthlyRate, term) - 1);
        setMonthlyPayment(payment.toFixed(2));
    }, [amount, term]);

    return React.createElement('div', { 
        className: 'bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto'
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
            }, kredits.map(kredit => 
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
            ))
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
                    min: config.min_amount || 500,
                    max: config.max_amount || 25000,
                    value: amount,
                    onChange: (e) => setAmount(Number(e.target.value)),
                    className: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500'
                }),
                React.createElement('div', {
                    className: 'absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-500'
                }, [
                    React.createElement('span', null, `${config.min_amount || 500}€`),
                    React.createElement('span', null, `${config.max_amount || 25000}€`)
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
                    className: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500'
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
            className: 'bg-blue-50 p-4 rounded-lg mb-6 flex justify-between items-center'
        }, [
            React.createElement('div', null, [
                React.createElement('div', {
                    className: 'text-2xl font-medium'
                }, `${monthlyPayment} €/mēn.`),
                React.createElement('div', {
                    className: 'text-sm text-gray-600'
                }, 'Ikmēneša maksājums')
            ]),
            React.createElement('svg', {
                className: 'w-5 h-5 text-blue-500',
                viewBox: '0 0 20 20',
                fill: 'currentColor'
            }, React.createElement('path', {
                fillRule: 'evenodd',
                d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
            }))
        ]),

        // Form
        React.createElement('div', {
            key: 'form',
            className: 'grid grid-cols-2 gap-4'
        }, [
            React.createElement('input', {
                type: 'email',
                placeholder: 'Jūsu e-pasts',
                className: 'p-3 border rounded-lg w-full col-span-2 md:col-span-1'
            }),
            React.createElement('input', {
                type: 'tel',
                placeholder: '+371 Jūsu tālrunis',
                className: 'p-3 border rounded-lg w-full col-span-2 md:col-span-1'
            })
        ]),

        // Submit Button
        React.createElement('button', {
            key: 'submit',
            type: 'submit',
            className: 'w-full bg-green-500 text-white py-3 rounded-lg mt-4 font-medium hover:bg-green-600 transition-colors'
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