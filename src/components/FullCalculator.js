import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    Button, 
    FormControl, 
    FormControlLabel, 
    FormHelperText,
    Select,
    MenuItem,
    Checkbox,
    Radio,
    RadioGroup,
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2)
}));

const MonthlyPaymentBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
    textAlign: 'center'
}));

const FullCalculator = () => {
    const [formData, setFormData] = useState({
        amount: '',
        term: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        personalCode: '',
        city: '',
        gender: '',
        income: '',
        politicallyExposed: 'no',
        dependents: 'no',
        beneficiary: 'yes',
        acceptTerms: false,
        acceptMarketing: false
    });
    
    const [errors, setErrors] = useState({});
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setFormData(prev => ({
            ...prev,
            amount: params.get('amount') || '',
            term: params.get('term') || '',
            email: params.get('email') || '',
            phone: params.get('phone') || ''
        }));
    }, []);

    useEffect(() => {
        if (formData.amount && formData.term) {
            const annualRate = 12 / 100;
            const monthlyRate = annualRate / 12;
            const payment = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, formData.term)) / 
                          (Math.pow(1 + monthlyRate, formData.term) - 1);
            setMonthlyPayment(payment.toFixed(2));
        }
    }, [formData.amount, formData.term]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName) newErrors.firstName = 'Obligāti aizpildāms lauks';
        if (!formData.lastName) newErrors.lastName = 'Obligāti aizpildāms lauks';
        if (!formData.personalCode) newErrors.personalCode = 'Obligāti aizpildāms lauks';
        if (!formData.email) {
            newErrors.email = 'Obligāti aizpildāms lauks';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Nepareizs e-pasta formāts';
        }
        if (!formData.phone) {
            newErrors.phone = 'Obligāti aizpildāms lauks';
        } else if (!/^\d{8}$/.test(formData.phone)) {
            newErrors.phone = 'Nepareizs tālruņa numura formāts';
        }
        if (!formData.city) newErrors.city = 'Obligāti aizpildāms lauks';
        if (!formData.gender) newErrors.gender = 'Obligāti aizpildāms lauks';
        if (!formData.acceptTerms) newErrors.acceptTerms = 'Jums jāpiekrīt noteikumiem';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'submit_loan_application',
                        ...formData,
                        nonce: window.loanCalculatorData?.nonce
                    })
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = '/pieteikums-sanemts/';
                } else {
                    setErrors({ submit: data.message || 'Kļūda nosūtot pieteikumu' });
                }
            } catch (error) {
                setErrors({ submit: 'Kļūda nosūtot pieteikumu' });
            }
        }
    };

    return (
        <Container maxWidth="md">
            <StyledPaper elevation={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    Aizpildiet pieteikumu
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
                    saņemiet aizdevumu!
                </Typography>

                <MonthlyPaymentBox>
                    <Typography variant="h4" component="div" gutterBottom>
                        {monthlyPayment} €/mēn.
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Ikmēneša maksājums
                    </Typography>
                </MonthlyPaymentBox>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vārds"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Uzvārds"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Personas kods"
                                name="personalCode"
                                value={formData.personalCode}
                                onChange={handleInputChange}
                                error={!!errors.personalCode}
                                helperText={errors.personalCode || 'Nepieciešams identifikācijas procesam'}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="E-pasts"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tālrunis"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: '+371'
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.city}>
                                <InputLabel>Jūsu pilsētība</InputLabel>
                                <Select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    label="Jūsu pilsētība"
                                >
                                    <MenuItem value="">Izvēlieties pilsētu</MenuItem>
                                    <MenuItem value="riga">Rīga</MenuItem>
                                    <MenuItem value="daugavpils">Daugavpils</MenuItem>
                                    <MenuItem value="liepaja">Liepāja</MenuItem>
                                    <MenuItem value="jelgava">Jelgava</MenuItem>
                                    <MenuItem value="jurmala">Jūrmala</MenuItem>
                                    <MenuItem value="ventspils">Ventspils</MenuItem>
                                    <MenuItem value="rezekne">Rēzekne</MenuItem>
                                    <MenuItem value="valmiera">Valmiera</MenuItem>
                                </Select>
                                {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={!!errors.gender}>
                                <Typography variant="body1" gutterBottom>Dzimums</Typography>
                                <RadioGroup
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="female"
                                        control={<Radio />}
                                        label="Sieviete"
                                    />
                                    <FormControlLabel
                                        value="male"
                                        control={<Radio />}
                                        label="Vīrietis"
                                    />
                                </RadioGroup>
                                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Vai Jūs esat politiski nozīmīga persona?</InputLabel>
                                <Select
                                    name="politicallyExposed"
                                    value={formData.politicallyExposed}
                                    onChange={handleInputChange}
                                    label="Vai Jūs esat politiski nozīmīga persona?"
                                >
                                    <MenuItem value="no">Nē, es neesmu</MenuItem>
                                    <MenuItem value="yes">Jā, esmu</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Vai Jums ir apgādājamā/s personas?</InputLabel>
                                <Select
                                    name="dependents"
                                    value={formData.dependents}
                                    onChange={handleInputChange}
                                    label="Vai Jums ir apgādājamā/s personas?"
                                >
                                    <MenuItem value="no">Nē, man nav</MenuItem>
                                    <MenuItem value="yes">Jā, ir</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.acceptTerms}
                                            onChange={handleInputChange}
                                            name="acceptTerms"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            Apliecinu, ka sniegtā informācija ir patiesa un esmu iepazinies ar 
                                            <a href="/terms" style={{ color: '#1976d2', marginLeft: '4px' }}>
                                                datu apstrādes noteikumiem
                                            </a>
                                        </Typography>
                                    }
                                />
                                {errors.acceptTerms && <FormHelperText error>{errors.acceptTerms}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.acceptMarketing}
                                            onChange={handleInputChange}
                                            name="acceptMarketing"
                                        />
                                    }
                                    label="Piekrītu saņemt jaunumus un personalizētus piedāvājumus"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    {errors.submit && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
                            <Typography color="error">{errors.submit}</Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ minWidth: 200 }}
                        >
                            Iesniegt pieteikumu
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                        </svg>
                        <Typography variant="body2" color="textSecondary">
                            Mēs nodrošinām bankas līmeņa aizsardzību Jūsu datu drošībai
                        </Typography>
                    </Box>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default FullCalculator;