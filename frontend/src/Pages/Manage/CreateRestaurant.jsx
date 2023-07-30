import React, {Fragment, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Card, CardContent, Grid, Modal, Tab, Tabs, TextField, Tooltip, Typography} from "@mui/material";
import {createSvgIcon} from "@mui/material/utils";
import MenuCard from "../../Components/menuCard";
import {Context, NotificationType, useContext} from "../../context.js";
import {styles} from "../../styles.js";
import sampleMenuImage from "../../Resource/image/Dongpo pork.png";
import { CallApi, CallApiWithToken } from "../../CallApi";

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
  const [menuList, setMenuList] = useState([]);
  const [updateMenuVis, setUpdateMenuVis] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [editMenu, setEditMenu] = useState({});
  const [restaurantImgUrl, setRestaurantImgUrl] = useState("");
  const [menuImgUrl, setMenuImgUrl] = useState("");
  const [restaurantId, setRestaurantId] = useState("")
  const [forceRender, setForceRender] = useState(false)
  const [restaurantInfo, setRestaurantInfo] = useState({})
  const formRef = useRef(null);

  const queryMenuList = (id) => {
    CallApi(`/dishes/get/by_restaurant/${id}`, "GET").then((ress) => {
      if(ress.status === 200) {
        const ids = ress.data.dish_ids
        setMenuList(ids)
        setForceRender(!forceRender)
      }
    })
  }

  useEffect(() => {
    CallApiWithToken("/restaurants/get/by_token", "GET").then((res) => {
      if (res.status === 200) {
        setRestaurantId(res.data.restaurant_id)
        queryMenuList(res.data.restaurant_id)
        console.log('form:', formRef)
        // formRef.current.setFieldsValue({
        //   name: res.data.name,
        //   address: res.data.address,
        // })
        setRestaurantInfo(res.data)
        setRestaurantImgUrl(`data:image/png;base64,${res.data.image}`)
      } else (
        setter.showNotification(res.data.message, NotificationType.Error)
      )
    })
  }, [])

  const submit = () => {
    const name = formRef.current.name.value;
    const address = formRef.current.address.value;
    const image = restaurantImgUrl.replace(/^data:image\/[a-z]+;base64,/, "");
    if (restaurantId) {
      CallApiWithToken(`/restaurants/reset/address/${address}`, "PUT")
      CallApiWithToken(`/restaurants/reset/image`, "PUT", {
        base64: image
      })
      CallApiWithToken(`/restaurants/reset/name/${name}`, "PUT")
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
        })
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
        price: form.target.price.value,
        description: form.target.description.value,
        image: menuImgUrl.replace(/^data:image\/[a-z]+;base64,/, ""),
      }).then((res) => {
        if (res.status === 200) {
          setter.showNotification('Success!', NotificationType.Success);
          queryMenuList(restaurantId)
        } else {
          setter.showNotification(res.data.message, NotificationType.Error);
        }
      })
    } else {
      CallApiWithToken(`/dishes/reset/info/${editMenu.dish_id}`, "PUT", {
        name: form.target.name.value,
        price: form.target.price.value,
        description: form.target.description.value,
        image: menuImgUrl.replace(/^data:image\/[a-z]+;base64,/, ""),
      }).then((res) => {
        if (res.status === 200) {
          setter.showNotification('Success!', NotificationType.Success);
          queryMenuList(restaurantId)
        } else {
          setter.showNotification(res.data.message, NotificationType.Error);
        }
      })
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
  }

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

  const onDelete = (id, index) => {
    CallApiWithToken(`/dishes/delete/by_id/${id}`, "DELETE").then((res) => {
      if (res.status === 200) {
        queryMenuList(restaurantId)
      }
    })
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
                <Grid item sx={{ marginTop: '25px' }}>
                  <Button variant="contained" onClick={submit}>Create!</Button>
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
                      menuList.map((id, index) => (
                        <MenuCard
                          forceRender={forceRender}
                          id={id}
                          onDelete={() => onDelete(id, index)}
                          onEdit={() => {
                            setIsAdd(false);
                            // setUpdateMenuVis(true);
                            CallApi(`/dishes/get/by_id/${id}`, "GET").then((res) => {
                              if (res.status === 200) {
                                setEditMenu(res.data)
                                setMenuImgUrl(res.data.image);
                                setUpdateMenuVis(true);
                              }
                            })
                          }}
                        />
                      ))
                    }
                  </TabPanel>
                </Box>
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
                          src={`data:image/png;base64,${menuImgUrl}`} alt="thumbnail"/>
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
