import React, {useEffect, useState} from 'react';
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
import Voucher from "../../Components/Voucher";
import CreateIcon from '@mui/icons-material/Create';
import {TransitionUp} from "../../styles.js";
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
            condition: "Percentage",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 109,
            description: "this is the description of Percentage voucher.",
            autoRelease: {
                range: 102,
                count: 10,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        },
        {
            id: "2",
            type: "CFree",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 10,
            description: "this is the description of Percentage voucher.",
        },
        {
            id: "3",
            type: "Free",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 130,
            description: "this is the description of Percentage voucher.",
            autoRelease: {
                range: 102,
                count: 10,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        },
        {
            id: "4",
            type: "CFree",
            condition: "Spend $50 or more",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 10,
            description: "this is the description of Percentage voucher.",
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
                        <Voucher
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
            <EditVoucher open={popOpen} onClose={() => setPopOpen(false)} defV={selectVendor} setDefV={setSelectVendor}/>
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
                range: 500,
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
                range: 102,
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
                range: 300,
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
                range: 100,
                count: 20,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        }
    },
};
const keys = ['Free', 'CFree', 'Fixed_Amount', 'Percentage']


const VoucherDialog = (props) => {
    const [openAutoReleaseDialog, setOpenAutoReleaseDialog] = useState(false);
    const [ReleasePeriod, setReleasePeriod] = useState("H");
    const [ReleasePeriodDay, setReleasePeriodDay] = useState(0);
    const [ReleasePeriodHour, setReleasePeriodHour] = useState(0);
    const [ReleasePeriodMinute, setReleasePeriodMinute] = useState(0);
    useEffect(() => {
        if (props.autoReleaseTimeRange === 30 * 24 * 60) {
            setReleasePeriod("M")
        } else if (props.autoReleaseTimeRange === 7 * 24 * 60) {
            setReleasePeriod("W")
        } else if (props.autoReleaseTimeRange === 24 * 60) {
            setReleasePeriod('D')
        } else if (props.autoReleaseTimeRange === 60) {
            setReleasePeriod("H")
        } else {
            setReleasePeriod("S")
            const dayFormat = coverMinuteToHour(props.autoReleaseTimeRange)
            setReleasePeriodDay(dayFormat.day)
            setReleasePeriodHour(dayFormat.hour)
            setReleasePeriodMinute(dayFormat.min)
        }
    }, [props.autoReleaseTimeRange])
    console.log("210")
    console.log(props.isAutoRelease)
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
                    value={props.count}
                    onChange={(e) => {props.setCount(e.target.value)}}
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

                <FormControlLabel control={<Switch checked={props.isAutoRelease} onClick={(event) => {
                    // console.log(event.target.checked)
                    props.setIsAutoRelease(event.target.checked)
                }}/>} label="Auto Release" sx={{marginLeft: 1}}/>
                <FormControlLabel control={<Switch checked={props.isAutoRelease} onClick={(event) => {
                    props.setIsAutoRelease(event.target.checked)
                }}/>} label="is Shareable" sx={{marginLeft: 1}}/>
                {props.isAutoRelease &&
                    <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={props.autoReleaseStart}
                                onChange={(e) => {props.setAutoReleaseStart(e)}}
                                sx={{width: '100%', marginTop: '16px'}}
                                label="Auto Release Start"
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={props.autoReleaseEnd}
                                onChange={(e) => {
                                    props.setAutoReleaseEnd(e)
                                }}
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
                                value={ReleasePeriod}
                                onChange={(e) => {
                                    setReleasePeriod(e.target.value)
                                    switch (e.target.value) {
                                        case 'S':
                                            setOpenAutoReleaseDialog(true);
                                            break;
                                        case 'M':
                                            props.setAutoReleaseTimeRange(30 * 24 * 60);
                                            break;
                                        case 'W':
                                            props.setAutoReleaseTimeRange(7 * 24 * 60);
                                            break;
                                        case 'D':
                                            props.setAutoReleaseTimeRange(24 * 60);
                                            break;
                                        case 'H':
                                            props.setAutoReleaseTimeRange(60);
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            >
                                <FormControlLabel value="M" control={<Radio/>} label="1 Month"/>
                                <FormControlLabel value="W" control={<Radio/>} label="1 Week"/>
                                <FormControlLabel value="D" control={<Radio/>} label="1 Day"/>
                                <FormControlLabel value="H" control={<Radio/>} label="1 Hour"/>
                                <FormControlLabel value="S" control={<Radio/>} label={`${ReleasePeriodDay} Days ${ReleasePeriodHour} Hours ${ReleasePeriodMinute} Minutes`}
                                />
                            </RadioGroup>
                        </FormControl>

                        <Dialog disableEscapeKeyDown open={openAutoReleaseDialog}
                                onClose={() => {
                                    setOpenAutoReleaseDialog(false)
                                    props.setAutoReleaseTimeRange(ReleasePeriodDay * 24 * 60 + ReleasePeriodHour * 60 + ReleasePeriodMinute)
                                }}>
                            <DialogTitle>Release Period</DialogTitle>
                            <DialogContent>
                                <Box component="form" sx={{display: 'flex', flexWrap: 'wrap'}}>
                                    <FormControl sx={{m: 1, minWidth: 120}}>
                                        <TextField label="days" type="number"
                                                   value={ReleasePeriodDay}
                                                   onChange={(e) => {
                                                       if (e.target.value < 0) {
                                                           setReleasePeriodDay(0)
                                                       } else if (e.target.value > 365) {
                                                              setReleasePeriodDay(365)
                                                       } else {
                                                           setReleasePeriodDay(e.target.value)
                                                       }
                                                   }}
                                        />
                                    </FormControl>
                                    <FormControl sx={{m: 1, minWidth: 120}}>
                                        <InputLabel htmlFor="demo-dialog-native-hour">hour</InputLabel>
                                        <Select
                                            native
                                            input={<OutlinedInput label="hour" id="demo-dialog-native-hour"/>}
                                            value={ReleasePeriodHour}
                                            onChange={(e) => {
                                                setReleasePeriodHour(e.target.value)
                                            }}
                                        >
                                            {Array.from(Array(24).keys()).map((i) => {
                                                return <option value={i}>{i}</option>
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{m: 1, minWidth: 120}}>
                                        <InputLabel htmlFor="demo-dialog-native-Minute">Minute</InputLabel>
                                        <Select
                                            native
                                            input={<OutlinedInput label="Minute" id="demo-dialog-native-Minute"/>}
                                            value={ReleasePeriodMinute}
                                            onChange={(e) => {
                                                setReleasePeriodMinute(e.target.value)
                                            }}
                                        >
                                            {Array.from(Array(60).keys()).map((i) => {
                                                return <option value={i}>{i}</option>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {
                                    setOpenAutoReleaseDialog(false)
                                    props.setAutoReleaseTimeRange(ReleasePeriodDay * 24 * 60 + ReleasePeriodHour * 60 + ReleasePeriodMinute)
                                }}>Ok</Button>
                            </DialogActions>
                        </Dialog>

                        <TextField
                            label="Number of Vouchers per Release"
                            value={props.autoReleaseCount}
                            onChange={(e) => {props.setAutoReleaseCount(e.target.value)}}
                            fullWidth
                            margin="normal"
                            required
                            type="number"
                            inputProps={{
                                min: "0",
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
    const [count, setCount] = useState(10);
    const [isAutoRelease, setIsAutoRelease] = useState(false);
    const [autoReleaseTimeRange, setAutoReleaseTimeRange] = useState(dayjs().add(1, 'hour'));
    const [autoReleaseCount, setAutoReleaseCount] = useState(10);
    const [autoReleaseStart, setAutoReleaseStart] = useState(dayjs());
    const [autoReleaseEnd, setAutoReleaseEnd] = useState(dayjs(options[selectedOption].defV.expire));
    const handleOptionChange = (k) => {
        setSelectedOption(k);
        setCondition(options[k].defV.condition);
        setDiscount(options[k].defV.discount);
        setExpire(dayjs(options[k].defV.expire));
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
            count={count}
            setCount={setCount}
            isAutoRelease={isAutoRelease}
            autoReleaseTimeRange={autoReleaseTimeRange}
            autoReleaseCount={autoReleaseCount}
            autoReleaseStart={autoReleaseStart}
            autoReleaseEnd={autoReleaseEnd}
            setIsAutoRelease={setIsAutoRelease}
            setAutoReleaseTimeRange={setAutoReleaseTimeRange}
            setAutoReleaseCount={setAutoReleaseCount}
            setAutoReleaseStart={setAutoReleaseStart}
            setAutoReleaseEnd={setAutoReleaseEnd}
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

    const handleSubmit = () => {
        // TODO
        // console.log(selectedOption);
    };
    console.log(455)
    // console.log(isAutoRelease);

    return (
        <VoucherDialog
            open={props.open}
            onClose={props.onClose}
            condition={props.defV.condition}
            handleConditionChange={(event) => {props.setDefV({...props.defV, condition: event.target.value})}}
            discount={props.defV.discount}
            handleDiscountChange={(event) => {props.setDefV({...props.defV, discount: event.target.value})}}
            expire={dayjs(props.defV.expire)}
            handleExpireChange={(newValue) => {props.setDefV({...props.defV, expire: newValue})}}
            handleSubmit={handleSubmit}
            count={props.defV.count}
            setCount={(e) => {props.setDefV({...props.defV, count: e})}}
            isAutoRelease={props.defV.autoRelease !== undefined}
            autoReleaseTimeRange={props.defV.autoRelease !== undefined ? props.defV.autoRelease.range : 60}
            autoReleaseCount={props.defV.autoRelease !== undefined ? props.defV.autoRelease.count : 10}
            autoReleaseStart={props.defV.autoRelease !== undefined ? dayjs(props.defV.autoRelease.start) : dayjs()}
            autoReleaseEnd={props.defV.autoRelease !== undefined ? dayjs(props.defV.autoRelease.end) : dayjs(props.defV.expire)}
            setIsAutoRelease={(e) => {
                if (e) {
                    props.setDefV({
                        ...props.defV,
                        autoRelease: {
                            range: 120,
                            count: 10,
                            start:dayjs(),
                            end: dayjs(props.defV.expire),
                        }
                    })
                } else {
                    props.setDefV({...props.defV, autoRelease: undefined})
                }
            }}
            setAutoReleaseTimeRange={(e) => {
                props.setDefV({
                ...props.defV,
                autoRelease: {
                    range: e,
                    count: props.defV.autoRelease.count,
                    start: dayjs(props.defV.autoRelease.start),
                    end: dayjs(props.defV.autoRelease.end),
                }
                })
            }}
            setAutoReleaseCount={(e) => {
                props.setDefV({
                    ...props.defV,
                    autoRelease: {
                        range: props.defV.autoRelease.range,
                        count: e,
                        start: dayjs(props.defV.autoRelease.start),
                        end: dayjs(props.defV.autoRelease.end),
                    }
                })
            }}
            setAutoReleaseStart={
                (e) => {
                    props.setDefV({
                        ...props.defV,
                        autoRelease: {
                            range: props.defV.autoRelease.range,
                            count: props.defV.autoRelease.count,
                            start: e,
                            end: dayjs(props.defV.autoRelease.end),
                        }
                    })
                }
            }
            setAutoReleaseEnd={
                (e) => {
                    props.setDefV({
                        ...props.defV,
                        autoRelease: {
                            range: props.defV.autoRelease.range,
                            count: props.defV.autoRelease.count,
                            start: dayjs(props.defV.autoRelease.start),
                            end: e,
                        }
                    })
                }
            }
        >
            <Grid item key={props.defV.id}>
                <Voucher
                    type={props.defV.type}
                    condition={props.defV.condition}
                    discount={props.defV.discount}
                    expire={props.defV.expire}
                />
            </Grid>
        </VoucherDialog>
    )

}

function coverMinuteToHour(minute) {
    let day = Math.floor(minute / 1440);
    let hour = Math.floor((minute % 1440) / 60);
    let min = (minute % 1440) % 60;
    return { day: day, hour: hour, min: min };
}



export default VoucherRest;

