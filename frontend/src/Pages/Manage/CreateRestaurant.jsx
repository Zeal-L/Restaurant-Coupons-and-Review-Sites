import React, {Fragment, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Link
} from "@mui/material";
import {createSvgIcon} from "@mui/material/utils";
import { NumericFormat } from "react-number-format";
import MenuCard from "../../Components/menuCard";
import {Context, NotificationType, useContext} from "../../context.js";
import {styles} from "../../styles.js";
import { CallApi, CallApiWithToken } from "../../CallApi";

const PlusIcon = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
  </svg>,
  "Plus",
);
const steps = ["Edit restaurant information", "Edit restaurant menu"];
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function CreateRestaurant() {
  useEffect(() => {
    document.title = "Create Restaurant";
  }, []);
  const {setter} = useContext(Context);
  const [menuList, setMenuList] = useState([]);
  const [updateMenuVis, setUpdateMenuVis] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [editMenu, setEditMenu] = useState({});
  const [restaurantImgUrl, setRestaurantImgUrl] = useState("");
  const [menuImgUrl, setMenuImgUrl] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [forceRender, setForceRender] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const formRef = useRef(null);

  const queryMenuList = (id) => {
    CallApi(`/dishes/get/by_restaurant/${id}`, "GET").then((ress) => {
      if(ress.status === 200) {
        const ids = ress.data.dish_ids;
        setMenuList(ids);
        setForceRender(!forceRender);
      }
    });
  };

  useEffect(() => {
    CallApiWithToken("/restaurants/get/by_token", "GET").then((res) => {
      if (res.status === 200) {
        setRestaurantId(res.data.restaurant_id);
        queryMenuList(res.data.restaurant_id);
        setRestaurantInfo(res.data);
        setRestaurantImgUrl(`data:image/png;base64,${res.data.image}`);
      }
    });
  }, []);

  const submit = () => {
    const name = formRef.current.name.value;
    const address = formRef.current.address.value;
    const image = restaurantImgUrl.replace(/^data:image\/[a-z]+;base64,/, "");
    if (restaurantId) {
      CallApiWithToken(`/restaurants/reset/address/${address}`, "PUT");
      CallApiWithToken("/restaurants/reset/image", "PUT", {
        base64: image
      });
      CallApiWithToken(`/restaurants/reset/name/${name}`, "PUT");
      setter.showNotification("edit Success!", NotificationType.Success);
    } else {
      if (name && address && image) {
        CallApiWithToken("/restaurants/new", "POST", {
          name,
          address,
          image
        }).then((res) => {
          if (res.status === 200) {
            setter.showNotification("Create Success!", NotificationType.Success);
          } else {
            setter.showNotification(res.data.message, NotificationType.Error);
          }
        });
      } else {
        setter.showNotification("Incomplete information!", NotificationType.Error);
      }
    }
  };

  const addMenuSubmit = (form) => {
    if (!restaurantId) return setter.showNotification("Please create your restaurant first", NotificationType.Warning);
    form.preventDefault();
    if (isAdd) {
      CallApiWithToken("/dishes/new", "POST", {
        name: form.target.name.value,
        price: parseFloat(form.target.price.value.replace("$", "")),
        description: form.target.description.value,
        image: menuImgUrl.replace(/^data:image\/[a-z]+;base64,/, ""),
      }).then((res) => {
        if (res.status === 200) {
          setter.showNotification("Success!", NotificationType.Success);
          queryMenuList(restaurantId);
        } else {
          setter.showNotification(res.data.message, NotificationType.Error);
        }
      });
    } else {
      CallApiWithToken(`/dishes/reset/info/${editMenu.dish_id}`, "PUT", {
        name: form.target.name.value,
        price: parseFloat(form.target.price.value.replace("$", "")),
        description: form.target.description.value,
        image: menuImgUrl.replace(/^data:image\/[a-z]+;base64,/, ""),
      }).then((res) => {
        if (res.status === 200) {
          setter.showNotification("Success!", NotificationType.Success);
          queryMenuList(restaurantId);
        } else {
          setter.showNotification(res.data.message, NotificationType.Error);
        }
      });
    }
    setUpdateMenuVis(false);
  };

  const uploadFileHandle = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      //使用 FileReader() 构造器去创建一个新的 FileReader.
      const fr = new FileReader();
      fr.onload = (e) => {
        setRestaurantImgUrl(e.currentTarget.result);
      };
      fr.readAsDataURL(files[0]);
    }
  };

  const handleMenuImageChange = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      //使用 FileReader() 构造器去创建一个新的 FileReader.
      const fr = new FileReader();
      fr.onload = (e) => {
        setMenuImgUrl(e.currentTarget.result);
      };
      fr.readAsDataURL(files[0]);
    }
  };

  const onDelete = (id) => {
    CallApiWithToken(`/dishes/delete/by_id/${id}`, "DELETE").then((res) => {
      if (res.status === 200) {
        queryMenuList(restaurantId);
      }
    });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 245,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };


  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const name = formRef.current.name.value;
      const address = formRef.current.address.value;
      const image = restaurantImgUrl.replace(/^data:image\/[a-z]+;base64,/, "");
      if (restaurantId && name && address && image) {
        CallApiWithToken(`/restaurants/reset/address/${address}`, "PUT");
        CallApiWithToken("/restaurants/reset/image", "PUT", {
          base64: image
        });
        CallApiWithToken(`/restaurants/reset/name/${name}`, "PUT");
        setter.showNotification("edit Success!", NotificationType.Success);
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      } else {
        if (name && address && image) {
          CallApiWithToken("/restaurants/new", "POST", {
            name,
            address,
            image
          }).then((res) => {
            if (res.status === 200) {
              setter.showNotification("Create Success!", NotificationType.Success);
              setRestaurantId(res.data.restaurant_id);
              let newSkipped = skipped;
              if (isStepSkipped(activeStep)) {
                newSkipped = new Set(newSkipped.values());
                newSkipped.delete(activeStep);
              }
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
              setSkipped(newSkipped);
            } else {
              setter.showNotification(res.data.message, NotificationType.Error);
            }
          });
        } else {
          setter.showNotification("Incomplete information!", NotificationType.Error);
        }
      }
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
  
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
      setter.setCurrentUserRestaurantId(restaurantId);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };
  console.log(menuImgUrl);
  return (
    <Fragment>
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: "100vh"}}>
        <Grid item xs={8} sx={styles.sameColor}>
          <Card variant="outlined" sx={{maxWidth: 600, backgroundColor: "rgb(255, 243, 209)", minWidth: 600}}>
            <CardContent>
              <h2 style={{display: "flex", justifyContent: "center", marginTop: "0"}}>Create Your Restaurant</h2>
              <Box sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      Congratulations, your restaurant has been successfully created!
                      <br />
                      Click <Link href={`/restaurant/${restaurantId}`}>here</Link> to view your restaurant.
                    </Typography>
                    {/*<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>*/}
                    {/*  <Box sx={{ flex: "1 1 auto" }} />*/}
                    {/*  <Button onClick={handleReset}>Re edit</Button>*/}
                    {/*</Box>*/}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {
                      activeStep === 0 ? <>
                        <Grid container direction="row" sx={{marginBottom: "10px", justifyContent: "center"}}>
                          <Grid item xs={7} sx={{display: "flex", justifyContent: "center", paddingTop: "10px"}}>
                            <form onSubmit={submit} ref={formRef}>
                              <Grid container direction="column" justifyContent="center" spacing={2}>
                                <Grid item alignItems="center">
                                  <TextField
                                    key={restaurantInfo.name}
                                    id="name"
                                    label="Restaurant Name"
                                    variant="outlined"
                                    name="name"
                                    sx={styles.sameWidth}
                                    required
                                    defaultValue={restaurantInfo.name}
                                  />
                                </Grid>
                                <Grid item>
                                  <TextField
                                    key={restaurantInfo.address}
                                    id="address"
                                    label="Restaurant Address"
                                    multiline
                                    rows={4}
                                    sx={styles.sameWidth}
                                    required
                                    defaultValue={restaurantInfo.address}
                                  />
                                </Grid>
                              </Grid>
                            </form>
                          </Grid>
                          <Grid item xs={5}>
                            <Button
                              component="label"
                              name="thumbnail-upload-input"
                              fullWidth
                            >
                              {restaurantImgUrl === "" || restaurantImgUrl === undefined
                                ? (
                                  <Box
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      paddingTop: "100%",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      bgcolor: "grey.300",
                                      color: "grey.600",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    <PlusIcon
                                      sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        color: "grey.600",
                                      }}
                                    />
                                  </Box>
                                )
                                : (
                                  <img style={{width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%"}}
                                    src={restaurantImgUrl} alt="thumbnail"/>
                                )}
                              <input hidden accept="image/*" type="file" onChange={uploadFileHandle}/>
                            </Button>
                          </Grid>
                        </Grid>
                      </> : <>
                        <Grid container>
                          <Box sx={{width: "100%"}}>
                            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                              <Tabs value={0} aria-label="basic tabs example">
                                <Tab label="MENU" id="simple-tab-0" aria-controls="simple-tabpanel-0"/>
                                <div style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                  cursor: "pointer",
                                  marginLeft: "20px"
                                }}>
                                  <Tooltip title="add menu"><PlusIcon onClick={() => {
                                    setUpdateMenuVis(true);
                                    setIsAdd(true);
                                    setMenuImgUrl("");
                                  }}/></Tooltip>
                                </div>
                              </Tabs>
                            </Box>
                            <TabPanel value={0} index={0} style={{overflow: "auto", maxHeight: 250}}>
                              {
                                menuList.map((id, index) => (
                                  <MenuCard
                                    key={id}
                                    forceRender={forceRender}
                                    id={id}
                                    onDelete={() => onDelete(id, index)}
                                    onEdit={() => {
                                      setIsAdd(false);
                                      // setUpdateMenuVis(true);
                                      CallApi(`/dishes/get/by_id/${id}`, "GET").then((res) => {
                                        if (res.status === 200) {
                                          setEditMenu(res.data);
                                          setMenuImgUrl(res.data.image);
                                          setUpdateMenuVis(true);
                                        }
                                      });
                                    }}
                                  />
                                ))
                              }
                            </TabPanel>
                          </Box>
                        </Grid>
                      </>
                    }
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {isStepOptional(activeStep) && (
                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                          Skip
                        </Button>
                      )}

                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={updateMenuVis}
        onClose={() => setUpdateMenuVis(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isAdd ? "Add a new Menu" : "Edit Menu"}
          </Typography>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            <form onSubmit={addMenuSubmit}>
              <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item alignItems="center">
                  <TextField
                    id="name"
                    label="Dish name"
                    variant="outlined"
                    name="name"
                    sx={styles.sameWidth}
                    required
                    defaultValue={isAdd ? "" : editMenu.name}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Price"
                    name="price"
                    required
                    sx={styles.sameWidth}
                    id="price"
                    InputProps={{
                      inputComponent: NumericFormatCustom,
                    }}
                    variant="outlined"
                    defaultValue={isAdd ? "" : editMenu.price}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="description"
                    label="description"
                    multiline
                    rows={3}
                    sx={styles.sameWidth}
                    defaultValue={isAdd ? "" : editMenu.description}
                  />
                </Grid>
                <Grid item sx={{paddingLeft: "10px", height: "253px"}}>
                  <Button
                    component="label"
                    name="thumbnail-upload-input"
                    fullWidth
                  >
                    {menuImgUrl === "" || menuImgUrl === undefined
                      ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            paddingTop: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            bgcolor: "grey.300",
                            color: "grey.600",
                            borderRadius: "4px",
                          }}
                        >
                          <PlusIcon
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "grey.600",
                            }}
                          />
                        </Box>
                      )
                      : (
                        <img style={{width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%"}}
                          // src={menuImgUrl.includes(/^data:image\/[a-z]+;base64,/) ? menuImgUrl : `data:image/png;base64,${menuImgUrl}`}
                          src={menuImgUrl}
                          alt="thumbnail"/>
                      )}
                    <input hidden accept="image/*" type="file" onChange={handleMenuImageChange}/>
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={styles.sameWidth}
                  >
                    confirm
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Typography>
        </Box>
      </Modal>
    </Fragment>
  );
}

export default CreateRestaurant;
