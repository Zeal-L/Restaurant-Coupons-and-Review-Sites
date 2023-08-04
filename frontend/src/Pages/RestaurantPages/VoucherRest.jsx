import React, {useContext, useEffect, useState} from "react";
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
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SpeedDial,
  SpeedDialIcon,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import Voucher from "../../Components/Voucher";
import CreateIcon from "@mui/icons-material/Create";
import {TransitionUp} from "../../styles.js";
import DeleteIcon from "@mui/icons-material/Delete";

import blueVoucher from "../../Resource/voucher/blue.png";
import greenVoucher from "../../Resource/voucher/green.png";
import purpleVoucher from "../../Resource/voucher/purple.png";
import yellowVoucher from "../../Resource/voucher/yellow.png";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import {CallApiWithToken} from "../../CallApi";
import {Context, NotificationType} from "../../context";

function VoucherRest(props) {
  const restaurantId = props.id;
  const [menuItems, setMenuItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const [selectVendor, setSelectVendor] = useState(menuItems[0]);
  const [isOwner, setIsOwner] = useState(false);
  React.useEffect(() => {
    CallApiWithToken("/restaurants/get/by_token", "GET").then((res) => {
      if (res.status === 200) {
        setIsOwner(res.data.restaurant_id.toString() === restaurantId);
      } else {
        setIsOwner(false);
      }
    });
  }, []);
  const {setter} = useContext(Context);
  React.useEffect(() => {
    CallApiWithToken("/vouchers/get/template/by_restaurant/" + restaurantId, "GET").then((res) => {
      if (res.status === 200) {
        setMenuItems(res.data.info.filter((item) => item.remain_amount > 0));
        console.log(res.data.info);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
  }, []);

  const addVoucher = (voucher) => {
    setMenuItems([...menuItems, voucher]);
  };
  return (
    <>
      <Grid
        container
        rowSpacing={4}
        columnSpacing={2}
        name="listings"
        alignItems="center"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          marginTop: 1,
        }}
      >
        {menuItems.map((item) => (
          <Grid item key={item.template_id}>
            {isOwner &&
              <>
                <IconButton sx={{position: "relative"}} id="iconButtonS" onClick={() => {
                  setSelectVendor(item);
                  setPopOpen(true);
                }}>
                  <EditIcon color="white"/>
                </IconButton>
                <IconButton sx={{position: "relative"}} id="iconButtonS" onClick={() => {
                  // /vouchers/reset/template
                  const remain_amount = 0;
                  const total_amount = item.total_amount - item.remain_amount;
                  CallApiWithToken("/vouchers/reset/template", "PUT",
                    {template_id: item.template_id, remain_amount, total_amount})
                    .then((res) => {
                      if (res.status === 200) {
                        setter.showNotification("Reset voucher successfully", NotificationType.Success);
                        setMenuItems(menuItems.filter((i) => i.template_id !== item.template_id));
                      } else {
                        setter.showNotification(res.data.message, NotificationType.Error);
                      }
                    });
                }}>
                  <DeleteIcon color="white"/>
                </IconButton>
              </>
            }
            <Voucher
              id={item.template_id}
              type={item.type}
              condition={item.condition}
              discount={item.discount}
              expire={item.expire}
              disabled={item.is_collected}
              isRestaurant={true}
            />
          </Grid>
        ))}
      </Grid>
      {isOwner &&
        <>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{position: "fixed", bottom: 16, right: 16}}
            name="newListingBtn"
            icon={<SpeedDialIcon openIcon={<CreateIcon/>}/>}
            onClick={() => setOpen(true)}
          />
          <CreateVoucher
            addVoucher={addVoucher}
            open={open}
            onClose={() => setOpen(false)}
          />
          {selectVendor &&
            <EditVoucher
              addVoucher={addVoucher}
              open={popOpen}
              onClose={() => setPopOpen(false)}
              defV={selectVendor}
              setDefV={setSelectVendor}/>
          }
        </>
      }
    </>
  );
}

const options = {
  "Free": {
    img: purpleVoucher,
    defV: {
      condition: "No condition",
      discount: "$20 OFF",
      expire: dayjs().add(1, "year").format("YYYY-MM-DD"),
      auto_release_info: {
        range: 500,
        count: 60,
        start: dayjs().format("YYYY-MM-DD"),
        end: dayjs().add(1, "year").format("YYYY-MM-DD")
      }
    }
  },
  "CFree": {
    img: yellowVoucher,
    defV: {
      condition: "Spend $50 or more",
      discount: "Free gift",
      expire: dayjs().add(1, "year").format("YYYY-MM-DD"),
      auto_release_info: {
        range: 102,
        count: 10,
        start: dayjs().format("YYYY-MM-DD"),
        end: dayjs().add(1, "year").format("YYYY-MM-DD")
      }
    }
  },
  "Fixed_Amount": {
    img: blueVoucher,
    defV: {
      condition: "Spend $50 or more",
      discount: "20$ OFF",
      expire: dayjs().add(1, "year").format("YYYY-MM-DD"),
      auto_release_info: {
        range: 300,
        count: 10,
        start: dayjs().format("YYYY-MM-DD"),
        end: dayjs().add(1, "year").format("YYYY-MM-DD")
      }
    }
  },
  "Percentage": {
    img: greenVoucher,
    defV: {
      condition: "Spend $50 or more",
      discount: "20% OFF",
      expire: dayjs().add(1, "year").format("YYYY-MM-DD"),
      auto_release_info: {
        range: 100,
        count: 20,
        start: dayjs().format("YYYY-MM-DD"),
        end: dayjs().add(1, "year").format("YYYY-MM-DD")
      }
    }
  },
};

VoucherRest.propTypes = {
  id : PropTypes.string.isRequired
};

const keys = ["Free", "CFree", "Fixed_Amount", "Percentage"];


function VoucherDialog(props) {
  const [openAutoReleaseDialog, setOpenAutoReleaseDialog] = useState(false);
  const [ReleasePeriod, setReleasePeriod] = useState("H");
  const [ReleasePeriodDay, setReleasePeriodDay] = useState(0);
  const [ReleasePeriodHour, setReleasePeriodHour] = useState(0);
  const [ReleasePeriodMinute, setReleasePeriodMinute] = useState(0);
  useEffect(() => {
    if (props.autoReleaseTimeRange === 30 * 24 * 60) {
      setReleasePeriod("M");
    } else if (props.autoReleaseTimeRange === 7 * 24 * 60) {
      setReleasePeriod("W");
    } else if (props.autoReleaseTimeRange === 24 * 60) {
      setReleasePeriod("D");
    } else if (props.autoReleaseTimeRange === 60) {
      setReleasePeriod("H");
    } else {
      setReleasePeriod("S");
      const dayFormat = coverMinuteToHour(props.autoReleaseTimeRange);
      setReleasePeriodDay(dayFormat.day);
      setReleasePeriodHour(dayFormat.hour);
      setReleasePeriodMinute(dayFormat.min);
    }
  }, [props.autoReleaseTimeRange]);
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
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
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
            if (props.condition === "") {
              props.setCondition("No condition");
            }
          }}
          fullWidth
          disabled={props.selectedOption === "Free" || props.editable === false}
          margin="normal"
        />

        <TextField
          label="Total Amount"
          value={props.count}
          onChange={(e) => {
            props.setCount(e.target.value);
          }}
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
          disabled={props.editable === false}
          margin="normal"
        />

        <TextField
          label="Description"
          value={props.description}
          onChange={(e) => {
            props.setDescription(e.target.value);
          }}
          fullWidth
          margin="normal"
          multiline
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={props.expire}
            onChange={props.handleExpireChange}
            sx={{width: "100%", marginTop: "16px"}}
            label="Expire"
            disabled={props.editable === false}
          />
        </LocalizationProvider>

        <FormControlLabel control={<Switch checked={props.isAutoRelease}
          disabled={props.editable === false}
          onClick={(event) => {
            props.setIsAutoRelease(event.target.checked);
          }}/>} label="Auto Release" sx={{marginLeft: 1}}/>
        <FormControlLabel control={<Switch checked={props.Shareable}
          onClick={(event) => {
            props.setShareable(event.target.checked);
          }}/>} label="is Shareable" sx={{marginLeft: 1}}/>
        {props.isAutoRelease &&
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={props.autoReleaseStart}
                onChange={(e) => {
                  props.setAutoReleaseStart(e);
                }}
                disabled={props.editable === false}
                sx={{width: "100%", marginTop: "16px"}}
                label="Auto Release Start"
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={props.autoReleaseEnd}
                onChange={(e) => {
                  props.setAutoReleaseEnd(e);
                }}
                disabled={props.editable === false}
                sx={{width: "100%", marginTop: "16px"}}
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
                  setReleasePeriod(e.target.value);
                  switch (e.target.value) {
                  case "S":
                    setOpenAutoReleaseDialog(true);
                    break;
                  case "M":
                    props.setAutoReleaseTimeRange(30 * 24 * 60);
                    break;
                  case "W":
                    props.setAutoReleaseTimeRange(7 * 24 * 60);
                    break;
                  case "D":
                    props.setAutoReleaseTimeRange(24 * 60);
                    break;
                  case "H":
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
                <FormControlLabel value="S" control={<Radio/>}
                  label={`${ReleasePeriodDay} Days ${ReleasePeriodHour} Hours ${ReleasePeriodMinute} Minutes`}
                  onClick={() => {
                    setOpenAutoReleaseDialog(true);
                  }}
                />
              </RadioGroup>
            </FormControl>

            <Dialog disableEscapeKeyDown open={openAutoReleaseDialog}
              onClose={() => {
                setOpenAutoReleaseDialog(false);
                props.setAutoReleaseTimeRange(ReleasePeriodDay * 24 * 60 + ReleasePeriodHour * 60 + ReleasePeriodMinute);
              }}>
              <DialogTitle>Release Period</DialogTitle>
              <DialogContent>
                <Box component="form" sx={{display: "flex", flexWrap: "wrap"}}>
                  <FormControl sx={{m: 1, minWidth: 120}}>
                    <TextField label="days" type="number"
                      disabled={props.editable === false}
                      value={ReleasePeriodDay}
                      onChange={(e) => {
                        if (e.target.value < 0) {
                          props.setAutoReleaseTimeRange(ReleasePeriodHour * 60 + ReleasePeriodMinute);
                        } else if (e.target.value > 365) {
                          props.setAutoReleaseTimeRange(365 * 24 * 60 + ReleasePeriodHour * 60 + ReleasePeriodMinute);
                        } else {
                          props.setAutoReleaseTimeRange(parseInt(e.target.value) * 1440 + parseInt(ReleasePeriodHour) * 60 + parseInt(ReleasePeriodMinute));
                        }
                      }}
                    />
                  </FormControl>
                  <FormControl sx={{m: 1, minWidth: 120}}>
                    <InputLabel
                      htmlFor="demo-dialog-native-hour">hour</InputLabel>
                    <Select
                      native
                      input={<OutlinedInput label="hour" id="demo-dialog-native-hour"/>}
                      value={ReleasePeriodHour}
                      onChange={(e) => {
                        console.log(e.target.value);
                        props.setAutoReleaseTimeRange(parseInt(ReleasePeriodDay) * 1440 + parseInt(e.target.value) * 60 + parseInt(ReleasePeriodMinute));
                      }}
                    >
                      {Array.from(Array(24).keys()).map((i) => {
                        return <option key={i} value={i}>{i}</option>;
                      })}
                    </Select>
                  </FormControl>
                  <FormControl
                    disabled={props.editable === false}
                    sx={{m: 1, minWidth: 120}}>
                    <InputLabel htmlFor="demo-dialog-native-Minute">Minute</InputLabel>
                    <Select
                      disabled={props.editable === false}
                      native
                      input={<OutlinedInput label="Minute" id="demo-dialog-native-Minute"/>}
                      value={ReleasePeriodMinute}
                      onChange={(e) => {
                        props.setAutoReleaseTimeRange(((parseInt(ReleasePeriodDay) * 1440) + (parseInt(ReleasePeriodHour) * 60) + parseInt(e.target.value)));
                      }}
                    >
                      {Array.from(Array(60).keys()).map((i) => {
                        return <option key={i} value={i}>{i}</option>;
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setOpenAutoReleaseDialog(false);
                  // props.setAutoReleaseTimeRange(ReleasePeriodDay * 24 * 60 + ReleasePeriodHour * 60 + ReleasePeriodMinute)
                }}>Ok</Button>
              </DialogActions>
            </Dialog>

            <TextField
              label="Number of Vouchers per Release"
              disabled={props.editable === false}
              value={props.autoReleaseCount}
              onChange={(e) => {
                props.setAutoReleaseCount(e.target.value);
              }}
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
}

function CreateVoucher(props) {
  const {setter} = useContext(Context);
  const [selectedOption, setSelectedOption] = useState("Free");
  const [condition, setCondition] = useState(options[selectedOption].defV.condition);
  const [discount, setDiscount] = useState(options[selectedOption].defV.discount);
  const [expire, setExpire] = useState(dayjs(options[selectedOption].defV.expire));
  const [count, setCount] = useState(10);
  const [description, setDescription] = useState("");
  const [isAutoRelease, setIsAutoRelease] = useState(false);
  const [isShareable, setIsShareable] = useState(false);
  const [autoReleaseTimeRange, setAutoReleaseTimeRange] = useState(10);
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
    setCondition(event.target.value);
  };

  const handleDiscountChange = (event) => {
    setDiscount(event.target.value);
  };

  const handleExpireChange = (newValue) => {
    setExpire(newValue);
  };

  const handleSubmit = () => {
    let body = {
      type: selectedOption,
      discount: discount,
      condition: condition,
      description: description,
      expire: dayjs(expire).unix(),
      shareable: isShareable,
      total_amount: count,
    };
    if (isAutoRelease) {
      body.auto_release = {
        amount: autoReleaseCount,
        start_date: autoReleaseStart.unix(),
        end_date: autoReleaseEnd.unix(),
        interval: autoReleaseTimeRange,
      };
    }
    console.log(expire);
    console.log(expire.unix());
    console.log(expire.format("YYYY-MM-DD HH:mm:ss"));
    console.log(body);
    CallApiWithToken("/vouchers/new", "POST", body).then((res) => {
      if (res.status === 200) {
        props.onClose();
        setter.showNotification("create success", NotificationType.Success);
        props.addVoucher(res.data);
        console.log(res);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
  };

  return (
    <VoucherDialog
      selectedOption={selectedOption}
      editable={true}
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
      description={description}
      setDescription={setDescription}
      Shareable={isShareable}
      setShareable={setIsShareable}
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
          <Grid item key={k} sx={{padding: "2px"}}>
            <Button
              onClick={() => handleOptionChange(k)}
              variant={selectedOption === k ? "contained" : "text"}
              color="info"
            >
              <Grid container sx={{
                width: `${336 * 0.7}px`,
                height: `${180 * 0.7}px`,
                padding: "2px",
                backgroundImage: `url(${options[k].img})`,
                backgroundSize: "contain",
              }}>
                <Grid item xs={12} sx={{alignSelf: "center"}}>
                  <Typography variant="subtitle1" color="white" sx={{
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    fontSize: "inherit",
                  }}>
                    {k === selectedOption ? condition : options[k].defV.condition}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{alignSelf: "center"}}>
                  <Typography variant="h4" component="h1" color="white"
                    sx={{textAlign: "center", fontWeight: 600}}>
                    {k === selectedOption ? discount : options[k].defV.discount}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{alignSelf: "center"}}>
                  <Typography variant="body1" color="white" sx={{textAlign: "center"}}>
                    {k === selectedOption ? dayjs(expire).format("YYYY-MM-DD") : options[k].defV.expire}
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

function EditVoucher(props) {
  const {setter} = useContext(Context);
  const handleSubmit = () => {
    // TODO
    console.log(props.defV.remain_amount);
    console.log(props.defV.shareable);
    const remain_amount = props.defV.remain_amount;
    const shareable = props.defV.shareable;
    const template_id = props.defV.template_id;
    const description = props.defV.description;
    CallApiWithToken("/vouchers/reset/template", "PUT", { template_id, remain_amount, shareable, description }).then((res) => {
      if (res.status === 200) {
        props.onClose();
        setter.showNotification("success", NotificationType.Success);
        console.log(res);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
  };

  console.log(props.defV);
  return (
    <VoucherDialog
      selectedOption={props.defV.type}
      editable={false}
      open={props.open}
      onClose={props.onClose}
      condition={props.defV.condition}
      handleConditionChange={(event) => {
        props.setDefV({...props.defV, condition: event.target.value});
      }}
      discount={props.defV.discount}
      handleDiscountChange={(event) => {
        props.setDefV({...props.defV, discount: event.target.value});
      }}
      expire={dayjs.unix(props.defV.expire)}
      handleExpireChange={(newValue) => {
        props.setDefV({...props.defV, expire: newValue});
      }}
      handleSubmit={handleSubmit}
      Shareable={props.defV.shareable}
      setShareable={(e) => {
        props.setDefV({...props.defV, shareable: e});
      }}
      description={props.defV.description}
      setDescription={(e) => {
        props.setDefV({...props.defV, description: e});
      }}
      count={props.defV.remain_amount}
      setCount={(e) => {
        props.setDefV({...props.defV, remain_amount: e});
      }}
      isAutoRelease={props.defV.auto_release_info.amount !== null}
      autoReleaseTimeRange={props.defV.auto_release_info.amount !== null ? props.defV.auto_release_info.interval : 60}
      autoReleaseCount={props.defV.auto_release_info.amount !== null ? props.defV.auto_release_info.amount : 10}
      autoReleaseStart={props.defV.auto_release_info.amount !== null ? dayjs.unix(props.defV.auto_release_info.start_date) : dayjs()}
      autoReleaseEnd={props.defV.auto_release_info.amount !== null ? dayjs.unix(props.defV.auto_release_info.end_date) : dayjs.unix(props.defV.expire)}
      setIsAutoRelease={() => {}}
      setAutoReleaseTimeRange={() => {}}
      setAutoReleaseCount={() => {}}
      setAutoReleaseStart={() => {}}
      setAutoReleaseEnd={() => {}}
    >
      <Grid item key={props.defV.template_id}>
        <Voucher
          type={props.defV.type}
          condition={props.defV.condition}
          discount={props.defV.discount}
          expire={props.defV.expire}
        />
      </Grid>
    </VoucherDialog>
  );

}

function coverMinuteToHour(minute) {
  console.log(minute);
  let day = Math.floor(minute / 1440);
  let hour = Math.floor((minute % 1440) / 60);
  let min = (minute % 1440) % 60;
  console.log(day, hour, min);
  return {day: day, hour: hour, min: min};
}


export default VoucherRest;

