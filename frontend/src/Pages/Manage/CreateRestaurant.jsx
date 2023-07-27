import React, {Fragment, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Card, CardContent, Grid, Modal, Tab, Tabs, TextField, Tooltip, Typography} from "@mui/material";
import {createSvgIcon} from "@mui/material/utils";
import MenuCard from "../../Components/menuCard";
import {Context, NotificationType, useContext} from "../../context.js";
import {styles} from "../../styles.js";
import sampleMenuImage from "../../Resource/image/Dongpo pork.png";

const PlusIcon = createSvgIcon(
  // credit: plus icon from https://heroicons.com/
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

function CreateRestaurant() {
  useEffect(() => {
    document.title = "Create Restaurant";
  }, []);
  const {setter, getter} = useContext(Context);
  const navigate = useNavigate();

  const [nameErr, setNameErr] = React.useState(false);
  const [emailErr, setEmailErr] = React.useState(false);
  const [passwordErr, setPasswordErr] = React.useState(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = React.useState(false);
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [verificationErr, setVerificationErr] = React.useState(false);
  const [menuList, setMenuList] = useState([{
    id: Math.random(),
    name: "DongPo Pork",
    price: "20",
    image: sampleMenuImage,
    describe: "Top quality pork topped with secret sauce..."
  }]);
  const [updateMenuVis, setUpdateMenuVis] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [editMenu, setEditMenu] = useState({});
  const [restaurantImgUrl, setRestaurantImgUrl] = useState("");
  const [menuImgUrl, setMenuImgUrl] = useState("");
  const formRef = useRef(null);

  const submit = () => {
    console.log(formRef.current.name.value);
    console.log(formRef.current.address.value);
    const name = formRef.current.name.value;
    const address = formRef.current.address.value;
    setter.showNotification("Create Success!", NotificationType.Success);
  };

  const addMenuSubmit = (form) => {
    form.preventDefault();
    console.log(form.target.name.value);
    console.log(form.target.price.value);
    console.log(menuImgUrl);
    if (isAdd) {
      setMenuList([...menuList, {
        id: Math.random(),
        name: form.target.name.value,
        price: form.target.price.value,
        describe: form.target.describe.value,
        image: menuImgUrl
      }]);
    } else {
      const newList = [...menuList].map(item => {
        if (item.id === editMenu.id) return {
          ...item,
          name: form.target.name.value,
          price: form.target.price.value,
          describe: form.target.describe.value,
          image: menuImgUrl
        };
        return item;
      });
      setMenuList(newList);
    }
    setUpdateMenuVis(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const windowURL = window.URL || window.webkitURL;
      const dataURl = windowURL.createObjectURL(file);
      setRestaurantImgUrl(dataURl);
      let param = new FormData();
      param.append("file", file);
      console.log("param:", param);
    }
  };

  const handleMenuImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const windowURL = window.URL || window.webkitURL;
      const dataURl = windowURL.createObjectURL(file);
      setMenuImgUrl(dataURl);
      let param = new FormData();
      param.append("file", file);
      console.log("param:", param);
    }
  };

  const onDelete = (menuInfo, index) => {
    const newList = [...menuList];
    newList[index] = null;
    setMenuList(newList.filter(i => i));
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

  return (
    <Fragment>
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: "100vh"}}>
        <Grid item xs={8} sx={styles.sameColor}>
          <Card variant="outlined" sx={{maxWidth: 600, backgroundColor: "rgb(255, 243, 209)", minWidth: 600}}>
            <CardContent>
              <h2 style={{display: "flex", justifyContent: "center", marginTop: "0"}}>Create Your Restaurant</h2>
              <Grid container direction="row" sx={{marginBottom: "10px"}}>
                <Grid item xs={7} sx={{display: "flex", justifyContent: "center", paddingTop: "10px"}}>
                  <form onSubmit={submit} ref={formRef}>
                    <Grid container direction="column" justifyContent="center" spacing={2}>
                      <Grid item alignItems="center">
                        <TextField id="name" label="Restaurant Name" variant="outlined"
                          name="name"
                          sx={styles.sameWidth}
                          required
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          id="address"
                          label="Restaurant Address"
                          multiline
                          rows={4}
                          sx={styles.sameWidth}
                          required
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
                    <input hidden accept="image/*" type="file" onChange={handleImageChange}/>
                  </Button>
                </Grid>
              </Grid>
              <h3 style={{display: "flex", justifyContent: "center", marginTop: "0"}}>Update your menu</h3>
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
                      menuList.map((item, index) => (
                        <MenuCard
                          name={item.name}
                          price={item.price}
                          image={item.image}
                          desc={item.describe}
                          onDelete={() => onDelete(item, index)}
                          onEdit={() => {
                            setIsAdd(false);
                            setUpdateMenuVis(true);
                            setEditMenu(item);
                            setMenuImgUrl(item.image);
                          }}
                        />
                      ))
                    }
                  </TabPanel>
                </Box>
              </Grid>
              <Grid item sx={{display: "flex", justifyContent: "center"}}>
                <Button variant="contained" onClick={submit}>Create!</Button>
              </Grid>
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
                    id="price"
                    name="price"
                    label="Price"
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={styles.sameWidth}
                    required
                    defaultValue={isAdd ? "" : editMenu.price}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="describe"
                    label="describe"
                    multiline
                    rows={3}
                    sx={styles.sameWidth}
                    defaultValue={isAdd ? "" : editMenu.describe}
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
                          src={menuImgUrl} alt="thumbnail"/>
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
