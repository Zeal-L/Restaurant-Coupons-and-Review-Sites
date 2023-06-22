import React, {useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Select,
    SpeedDial,
    SpeedDialIcon,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import Voucher_m from "../../Components/Voucher_m";
import CreateIcon from '@mui/icons-material/Create';
import {TransitionUp} from "../../styles.js";
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DeleteIcon from '@mui/icons-material/Delete';

import blueVoucher from '../../Resource/voucher/blue.png';
import greenVoucher from '../../Resource/voucher/green.png';
import purpleVoucher from '../../Resource/voucher/purple.png';
import yellowVoucher from '../../Resource/voucher/yellow.png';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import EditIcon from "@mui/icons-material/Edit";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });
function VoucherRest() {
    const menuItems = [
        {
            id: "1",
            type: "Percentage",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31"
        },
        {
            id: "2",
            type: "Fixed Amount",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31"
        },
        {
            id: "3",
            type: "Free",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31"
        },
        {
            id: "4",
            type: "CFree",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31"
        }

    ];
    const [open, setOpen] = useState(false);
    const [popOpen, setPopOpen] = useState(false);
    const [selectVendor, setSelectVendor] = useState(menuItems[0]);
    return (
        <>
            <Grid
                container
                rowSpacing={4}
                columnSpacing={2}
                name="listings"
                alignItems="center"
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    marginTop: 1,
                }}
            >
                {menuItems.map((item) => (
                    <Grid item key={item.id}>
                        <IconButton sx={{position: 'relative'}} id="iconButtonS">
                            <EditIcon color="white" onClick={() => {
                                setSelectVendor(item);
                                setPopOpen(true);
                            }}/>
                        </IconButton>
                        <IconButton sx={{position: 'relative'}} id="iconButtonS">
                            <DeleteIcon color="white"/>
                        </IconButton>
                        <Voucher_m
                            type={item.type}
                            condition={item.condition}
                            discount={item.discount}
                            expire={item.expire}
                        />
                    </Grid>
                ))}
            </Grid>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: 'fixed', bottom: 16, right: 16}}
                name="newListingBtn"
                icon={<SpeedDialIcon openIcon={<CreateIcon/>}/>}
                onClick={() => setOpen(true)}
            />
            <CreateVoucher open={open} onClose={() => setOpen(false)}/>
            <EditVoucher open={popOpen} onClose={() => setPopOpen(false)} defV={selectVendor}/>
        </>
    );
};

const options = {
    'Free': {
        img: blueVoucher, defV: {
            condition: "No condition",
            discount: "20$ OFF",
            expire: dayjs().add(1, 'year').format('YYYY-MM-DD'),
            autoRelease: {
                per: "D",
                count: 60,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        }
    },
    'CFree': {
        img: greenVoucher, defV: {
            condition: "Spend 50$ or more",
            discount: "Free gift",
            expire: dayjs().add(1, 'year').format('YYYY-MM-DD'),
            autoRelease: {
                per: "H",
                count: 10,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        }
    },
    'Fixed_Amount': {
        img: purpleVoucher, defV: {
            condition: "Spend 50$ or more",
            discount: "20$ OFF",
            expire: dayjs().add(1, 'year').format('YYYY-MM-DD'),
            autoRelease: {
                per: "W",
                count: 10,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        }
    },
    'Percentage': {
        img: yellowVoucher, defV: {
            condition: "Spend 50$ or more",
            discount: "20% OFF",
            expire: dayjs().add(1, 'year').format('YYYY-MM-DD'),
            autoRelease: {
                per: "M",
                count: 20,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        }
    },
};
const keys = ['Free', 'CFree', 'Fixed_Amount', 'Percentage']


const VoucherDialog = (props) => {
    const [openAutoReleaseDialog, setOpenAutoReleaseDialog] = useState(true);
    const [isAutoRelease, setIsAutoRelease] = useState(false);
    return (
        <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={props.onClose}>
            <DialogTitle>Select an Option</DialogTitle>
            <DialogContent>
                <Grid
                    container
                    rowSpacing={4}
                    columnSpacing={0}
                    name="listings"
                    alignItems="center"
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-evenly',
                        marginTop: 1,
                    }}>
                    {
                        props.children
                    }
                </Grid>
                <TextField
                    label="Condition"
                    value={props.condition}
                    onChange={props.handleConditionChange}
                    onBlur={() => {
                        if (props.condition === '') {
                            props.setCondition("No condition")
                        }
                    }}
                    fullWidth
                    disabled={props.selectedOption === 'Free'}
                    margin="normal"
                />

                <TextField
                    label="Count"
                    // value={props.price}
                    // onChange={(e) => props.setPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    type="number"
                    inputProps={{
                        min: "0",
                    }}
                />

                <TextField
                    label="Discount"
                    value={props.discount}
                    onChange={props.handleDiscountChange}
                    fullWidth
                    margin="normal"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={props.expire}
                        onChange={props.handleExpireChange}
                        sx={{width: '100%', marginTop: '16px'}}
                        label="Select a Date"
                    />
                </LocalizationProvider>

                <FormControlLabel control={<Switch value={isAutoRelease} onClick={() => {
                    setIsAutoRelease(!isAutoRelease);
                }}/>} label="Auto Release" sx={{marginLeft: 1}}/>
                {isAutoRelease &&
                    <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={props.expire}
                                onChange={props.handleExpireChange}
                                sx={{width: '100%', marginTop: '16px'}}
                                label="Auto Release Start"
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={props.expire}
                                onChange={props.handleExpireChange}
                                sx={{width: '100%', marginTop: '16px'}}
                                label="Auto Release End"
                            />
                        </LocalizationProvider>

                        <FormControl sx={{marginTop: 1}}>
                            <FormLabel id="demo-row-radio-buttons-group-label">Release Period</FormLabel>
                            <RadioGroup
                                row
                                fullWidth
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="H" control={<Radio/>} label="1 Hour"/>
                                <FormControlLabel value="D" control={<Radio/>} label="1 Day"/>
                                <FormControlLabel value="W" control={<Radio/>} label="1 Week"/>
                                <FormControlLabel value="M" control={<Radio/>} label="1 Month"/>
                                <FormControlLabel value="S" control={<Radio/>} label={<text>1h2w</text>}/>
                            </RadioGroup>
                        </FormControl>

                        <Dialog disableEscapeKeyDown open={openAutoReleaseDialog}
                                onClose={() => setOpenAutoReleaseDialog(false)}>
                            <DialogTitle>Fill the form</DialogTitle>
                            <DialogContent>
                                <Box component="form" sx={{display: 'flex', flexWrap: 'wrap'}}>
                                    <FormControl sx={{m: 1, minWidth: 120}}>
                                        <TextField label="days" type="number"/>
                                    </FormControl>
                                    <FormControl sx={{m: 1, minWidth: 120}}>
                                        <InputLabel id="demo-dialog-select-label">hour</InputLabel>
                                        <Select
                                            labelId="demo-dialog-select-label"
                                            id="demo-dialog-select"
                                            input={<OutlinedInput label="hour"/>}
                                        >
                                            {Array.from(Array(24).keys()).map((i) => {
                                                return <MenuItem value={i + 1}>{i + 1}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{m: 1, minWidth: 120}}>
                                        <InputLabel htmlFor="demo-dialog-native">Minute</InputLabel>
                                        <Select
                                            native
                                            // value={age}
                                            // onChange={handleChange}
                                            input={<OutlinedInput label="Minute" id="demo-dialog-native"/>}
                                        >
                                            {Array.from(Array(60).keys()).map((i) => {
                                                return <option value={i + 1}>{i + 1}</option>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenAutoReleaseDialog(false)}>Cancel</Button>
                                <Button onClick={() => setOpenAutoReleaseDialog(false)}>Ok</Button>
                            </DialogActions>
                        </Dialog>

                        <TextField
                            label="Number of Vouchers per Release"
                            value={props.price}
                            onChange={(e) => props.setPrice(e.target.value)}
                            fullWidth
                            margin="normal"
                            required
                            type="number"
                            inputProps={{
                                min: "0",
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">$</InputAdornment>,
                            }}
                        />
                    </>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const CreateVoucher = (props) => {
    const [selectedOption, setSelectedOption] = useState('Free');
    const [condition, setCondition] = useState(options[selectedOption].defV.condition);
    const [discount, setDiscount] = useState(options[selectedOption].defV.discount);
    const [expire, setExpire] = useState(dayjs(options[selectedOption].defV.expire));
    const [autoReleaseTime, setAutoReleaseTime] = useState(options[selectedOption].defV.autoRelease.per);
    const [autoReleaseCount, setAutoReleaseCount] = useState(options[selectedOption].defV.autoRelease.count);
    const handleOptionChange = (k) => {
        setSelectedOption(k);
        setCondition(options[k].defV.condition);
        setDiscount(options[k].defV.discount);
    };

    const handleConditionChange = (event) => {
        setCondition(event.target.value)
    };

    const handleDiscountChange = (event) => {
        setDiscount(event.target.value)
    };

    const handleExpireChange = (newValue) => {
        setExpire(newValue)
    }

    const handleSubmit = () => {
        // TODO
        console.log(selectedOption);
    };

    return (
        <VoucherDialog
            open={props.open}
            onClose={props.onClose}
            condition={condition}
            handleConditionChange={handleConditionChange}
            discount={discount}
            handleDiscountChange={handleDiscountChange}
            expire={expire}
            handleExpireChange={handleExpireChange}
            handleSubmit={handleSubmit}
        >
            {
                keys.map((k) => (
                    <Grid item key={k} sx={{padding: '2px'}}>
                        <Button
                            onClick={() => handleOptionChange(k)}
                            variant={selectedOption === k ? "contained" : "text"}
                            color="info"
                        >
                            <Grid container sx={{
                                width: `${336 * 0.7}px`,
                                height: `${180 * 0.7}px`,
                                padding: '2px',
                                backgroundImage: `url(${options[k].img})`,
                                backgroundSize: 'contain',
                            }}>
                                <Grid item xs={12} sx={{alignSelf: 'center'}}>
                                    <Typography variant="subtitle1" color="white" sx={{
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '100%',
                                        fontSize: 'inherit',
                                    }}>
                                        {k === selectedOption ? condition : options[k].defV.condition}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{alignSelf: 'center'}}>
                                    <Typography variant="h4" component="h1" color="white"
                                                sx={{textAlign: 'center', fontWeight: 600}}>
                                        {k === selectedOption ? discount : options[k].defV.discount}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{alignSelf: 'center'}}>
                                    <Typography variant="body1" color="white" sx={{textAlign: 'center'}}>
                                        {k === selectedOption ? dayjs(expire).format('YYYY-MM-DD') : options[k].defV.expire}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                ))
            }
        </VoucherDialog>
    );


}

const EditVoucher = (props) => {
    const [condition, setCondition] = useState(props.defV.condition);
    const [discount, setDiscount] = useState(props.defV.discount);
    const [expire, setExpire] = useState(dayjs(props.defV.expire));
    const handleConditionChange = (event) => {
        setCondition(event.target.value)
    };

    const handleDiscountChange = (event) => {
        setDiscount(event.target.value)
    };

    const handleExpireChange = (newValue) => {
        setExpire(newValue)
    }

    const handleSubmit = () => {
        // TODO
        // console.log(selectedOption);
    };

    return (
        <VoucherDialog
            open={props.open}
            onClose={props.onClose}
            condition={condition}
            handleConditionChange={handleConditionChange}
            discount={discount}
            handleDiscountChange={handleDiscountChange}
            expire={expire}
            handleExpireChange={handleExpireChange}
            handleSubmit={handleSubmit}
        >
            <Grid item key={props.defV.id}>
                <Voucher_m
                    type={props.defV.type}
                    condition={condition}
                    discount={discount}
                    expire={expire.format('YYYY-MM-DD')}
                />
            </Grid>
        </VoucherDialog>
    )

}


export default VoucherRest;

