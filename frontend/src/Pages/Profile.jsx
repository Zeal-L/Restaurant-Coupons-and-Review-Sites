import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import {styles} from "../styles.js";
import ChangePasswordPop from "../Components/ChangePasswordPop";
import {Context, NotificationType, useContext} from "../context.js";
import React, {useState, useEffect} from "react";
import Divider from "@mui/material/Divider";
import Voucher from "../Components/Voucher";
import EditForm from "../Components/EditForm";
import DeletePop from "../Components/DeletePop.jsx";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import { CallApiWithToken } from "../CallApi";

function Profile() {
  useEffect(() => {
    document.title = "Profile";
  }, []);
  const [ChangePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const {setter} = useContext(Context);
  const [deletePopOpen, setDeletePopOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currImage, setCurrImage] = React.useState();
  const [allVoucher, setAllVoucher] = useState([]);

  useEffect(() => {
    CallApiWithToken("/users/get/by_token", "GET").then((res) => {
      if (res.status === 200) {
        setId(res.data.id);
        setName(res.data.name);
        setEmail(res.data.email);
        setCurrImage(res.data.photo);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
    CallApiWithToken("/vouchers/get/voucher/by_user", "GET").then((res) => {
      if (res.status === 200) {
        setAllVoucher(res.data.info);
        console.log(res.data.info);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });

  }, []);

  const updateImage = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        setCurrImage(reader.result.replace(/^data:image\/[a-z]+;base64,/, ""),);
        const data = {
          "base64": reader.result.replace(/^data:image\/[a-z]+;base64,/, ""),
        };
        CallApiWithToken("/users/reset/photo", "PUT", data) .then((res) => {
          if (res.status === 200) {
            setter.showNotification(res.data.message, NotificationType.Success);
          } else {
            setter.showNotification("Unknown error: " + res.data.message, NotificationType.Error);
          }
        });
      };
    }
  };

  const saveName = (name) =>{
    CallApiWithToken(`/users/reset/name/${name}`, "PUT").then((res) => {
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
      } else {
        setter.showNotification("Unknown error: " + res.data.message, NotificationType.Error);
      }
    });
  };
  return (
    <>
      {deletePopOpen && <DeletePop open={deletePopOpen} setOpen={setDeletePopOpen}/>}
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: "80vh"}} padding="50px">
        <Card variant="outlined" sx={{width: "80%", maxWidth: 900, backgroundColor: "rgb(255, 243, 209)"}}>
          <CardContent>
            <Box fullWidth  display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <label htmlFor="contained-button-file">
                <IconButton component="span">
                  <Avatar alt={name}
                    src={`data:image/png;base64,${currImage}`} sx={{ width: 150, height: 150 }}/>
                </IconButton>
              </label>
              <input accept="image/*" id="contained-button-file" hidden multiple type="file" onChange={updateImage}/>
            </Box>                        
            <Grid
              container
              direction="column"
              alignItems="center"
              spacing={2}
              marginTop="10px" padding="15px">
              <Grid item container alignItems="center">
                <Grid item marginLeft="30%">
                  <BadgeIcon sx={{ fontSize: 30 }} color="white"/>
                </Grid>
                <Grid item marginLeft="25px">
                  <EditForm label="Name" value={name} setValue={setName} saveValue={saveName}/>
                </Grid>
              </Grid>
              <Grid item container alignItems="center">
                <Grid item marginLeft="30%">
                  <EmailIcon sx={{ fontSize: 30 }} color="white"/>
                </Grid>
                <Grid item marginLeft="22px">
                  <Typography>
                    {email}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item direction="column" marginTop="15px">
                <Button type="button" variant="contained" sx={styles.sameWidth} onClick={() => {
                  setChangePasswordOpen(true);
                }}>Change Password</Button>
              </Grid>
            </Grid>
            {ChangePasswordOpen &&
                <ChangePasswordPop open={ChangePasswordOpen}
                  setOpen={setChangePasswordOpen} />}
            <Box
              component="div"
              style={{
                position: "relative",
                width: "100%",
                height: "80px",
                fontWeight: "500",
                overflow: "hidden",
                variant: "h2",
              }}
            >
              <Box height="20px">
              </Box>
              <Divider/>
              <Typography variant="h5" fontFamily="Helvetica" fontWeight="bold" display="flex"
                justifyContent="center" sx={{marginTop: "8px", marginLeft: "25px"}}>
                  Vouchers
              </Typography>
            </Box>
            <Box margin="0px" display="flex" alignItems="center" justifyContent="left">
            </Box>
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
              {
                allVoucher.map((item) => {
                  console.log(item); // Print the item object to the console

                  return (
                    !item.is_used && (
                      <Grid item key={item.id}>
                        <Voucher
                          id={item.voucher_id}
                          type={item.type}
                          condition={item.condition}
                          discount={item.discount}
                          expire={item.expire}
                          disabled={item.isClaimed}
                          isRestaurant={false}
                        />
                      </Grid>
                    )
                  );
                })
              }


            </Grid>
            <Box
              component="div"
              style={{
                position: "relative",
                width: "100%",
                height: "80px",
                fontWeight: "500",
                overflow: "hidden",
                variant: "h2",
              }}
            >
              <Box height="20px">
              </Box>
              <Divider/>
              <Typography variant="h5" fontFamily="Helvetica" fontWeight="bold" display="flex"
                justifyContent="center" sx={{
                  marginTop: "8px",
                  marginLeft: "25px",
                }}>
                  Used Vouchers
              </Typography>
            </Box>

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
              {allVoucher.map((item) => (
                item.is_used &&
                  <Grid item key={item.id*10}>
                    <Voucher
                      id={item.voucher_id}
                      type={item.type}
                      condition={item.condition}
                      discount={item.discount}
                      expire={item.expire}
                      disabled={true}
                      isRestaurant={false}
                      used={true}
                    />
                  </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default Profile;