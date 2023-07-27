import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import {styles} from "../styles.js";
import ChangePasswordPop from "../Components/ChangePasswordPop";
// import {useParams} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {alpha, styled} from "@mui/material/styles";
import {Search as SearchIcon} from "@mui/icons-material";
import Divider from "@mui/material/Divider";
import Voucher from "../Components/Voucher";
import EditForm from "../Components/EditForm";

import DeletePop from "../Components/DeletePop.jsx";

// import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";

const voucherItems = [
  {
    id: "1",
    type: "Percentage",
    condition: "Percentage",
    discount: "10% OFF",
    expire: "2023-12-31",
    count: 109,
    description: "this is the description of Percentage voucher.",
    isClaimed: false,
    autoRelease: {
      range: 102,
      count: 10,
      start: dayjs().format("YYYY-MM-DD"),
      end: dayjs().add(1, "year").format("YYYY-MM-DD")
    },
    Restaurants: "Restaurant1"
  },
  {
    id: "2",
    type: "CFree",
    condition: "Spend $50 or more",
    discount: "10% OFF",
    expire: "2023-12-31",
    count: 10,
    description: "this is the description of Percentage voucher.",
    isClaimed: false,
    Restaurants: "Restaurant1"
  },
  {
    id: "3",
    type: "Free",
    condition: "Spend $50 or more",
    discount: "10% OFF",
    expire: "2023-12-31",
    count: 130,
    description: "this is the description of Percentage voucher.",
    isClaimed: false,
    autoRelease: {
      range: 102,
      count: 10,
      start: dayjs().format("YYYY-MM-DD"),
      end: dayjs().add(1, "year").format("YYYY-MM-DD")
    },
    Restaurants: "Restaurant2"
  },
  {
    id: "4",
    type: "CFree",
    condition: "Spend $60 or more",
    discount: "10% OFF",
    expire: "2023-12-31",
    count: 10,
    description: "this is the description of Percentage voucher.",
    isClaimed: false,
    Restaurants: "Restaurant2"
  }

];

const Search = styled("div")(({theme}) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    }
  },
}));

const profileData = {
  id: "1",
  name: "TestUser",
  avatar: "https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg",
  email: "test@test.com",
  gender: "male",
  password: "Dlf123456@"
};


function Profile() {
  useEffect(() => {
    document.title = 'Profile';
  }, []);
  const [ChangePasswordOpen, setChangePasswordOpen] = React.useState(false);
  // const {voucherId} = useParams();
  const [voucherList, setVoucherList] = React.useState(voucherItems);
  //const [voucherList, setVoucherList] = React.useState([]);
  const [voucherFilterType, setVoucherFilter] = useState("All");
  // const [open, setOpen] = useState(false);
  const [deletePopOpen, setDeletePopOpen] = useState(false);
  // const [selectVendor, setSelectVendor] = useState(voucherItems[0]);
  // const [isOwner, setIsOwner] = useState(true);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currImage, setCurrImage] = React.useState();

  useEffect(() => {
    setId(profileData.id);
    setName(profileData.name);
    setEmail(profileData.email);
    setAvatar(profileData.avatar);
    setGender(profileData.gender);
    setPassword(profileData.password);
    setCurrImage(profileData.avatar);
    console.log(id);
    console.log(avatar);
  }, []);


  const handleFilter = (event) => {
    console.log(event.target.value);
    setVoucherFilter(event.target.value);
  };

  const debounceFilter = (func, wait) => {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(arguments);
      }, wait);
    };
  };
  const updateImage = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        setCurrImage(reader.result);
      };
    }
  };

  // filter
  const handSearch = debounceFilter((data) => {
    if (data[0]) {
      const newVoucherList = [...voucherItems].filter((i) => i.type.includes(data[0])).filter(i => i);
      setVoucherList(newVoucherList);
    } else {
      console.log(1);
      setVoucherList(voucherItems);
    }
  }, 800);

  return (
    <>

      {deletePopOpen && <DeletePop open={deletePopOpen} setOpen={setDeletePopOpen}/>}
      {/* <a>展示用户信息，用户名，用户图片，性别，邮箱，都可以更改，密码不显示，但是也可以更改</a> */}
      <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: "80vh"}} padding="50px">
        <Card variant="outlined" sx={{width: "80%", maxWidth: 900, backgroundColor: "rgb(255, 243, 209)"}}>
          <CardContent>
            <Box fullWidth  display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <label htmlFor="contained-button-file">
                <IconButton component="span">
                  <Avatar alt={name} src={currImage} sx={{ width: 150, height: 150 }}/>
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
                  <EditForm label="Name" value={name} setValue={setName} saveValue={setName}/>
                </Grid>
              </Grid>
              
              <Grid item container alignItems="center">
                <Grid item marginLeft="30%">
                  <EmailIcon sx={{ fontSize: 30 }} color="white"/>
                </Grid>
                <Grid item marginLeft="25px">
                  <EditForm label="Email" value={email} setValue={setEmail} saveValue={setEmail}/>
                </Grid>
              </Grid>
              <Grid item container alignItems="center">
                <Grid item marginLeft="29.8%">
                  <PersonIcon sx={{ fontSize: 32 }} color="white" />
                </Grid>
                <Grid item marginLeft="25px">
                  <EditForm label="Gender" value={gender} setValue={setGender} saveValue={setGender}/>
                </Grid>
              </Grid>
              {/* <Grid item direction="column" marginTop="15px">
                  <Button type="button" variant="contained"  sx={styles.sameWidth} onClick={() => {
                      setEditPopopen(true)
                  }}>Edit</Button>
              </Grid> */}
              <Grid item direction="column" marginTop="15px">
                <Button type="button" variant="contained" sx={styles.sameWidth} onClick={() => {
                  setChangePasswordOpen(true);
                }}>Change Password</Button>
              </Grid>
            </Grid>
            {/* {editPopOpen &&
                <ProfileEditPop open={editPopOpen} profileInfo={profileInfo} setOpen={setEditPopopen}
                                setProfileInfo={setProfileInfo}/>} */}
            {ChangePasswordOpen &&
                <ChangePasswordPop open={ChangePasswordOpen} currentPassword={password}
                  setOpen={setChangePasswordOpen} setPassword={setPassword}/>}
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
            <Box margin="25px" display="flex" alignItems="center" justifyContent="left">
              <FormControl style={{width: "30%"}}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={voucherFilterType}
                  label="voucherFilterType"
                  onChange={handleFilter}
                >
                  <MenuItem value={"Fixed Amount"}>Fixed Amount</MenuItem>
                  <MenuItem value={"Percentage"}>Percentage</MenuItem>
                  <MenuItem value={"Free"}>Free</MenuItem>
                  <MenuItem value={"CFree"}>CFree</MenuItem>
                  <MenuItem value={"All"}>All</MenuItem>
                </Select>
              </FormControl>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon/>
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{"aria-label": "search"}}
                  onChange={(e) => handSearch(e.target.value)}
                />
              </Search>
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
              {voucherList.map((item) => (
                (voucherFilterType === "All" || item.type === voucherFilterType) &&
                  <Grid item key={item.id}>
                    {/* {isOwner &&
                          <>
                              <IconButton sx={{position: "relative"}} id="iconButtonS"
                                          onClick={() => {
                                              setDeletePopOpen(true);
                                          }}>
                                  <DeleteIcon color="white"/>
                              </IconButton>
                          </>
                      } */}

                    <Voucher
                      type={item.type}
                      condition={item.condition}
                      discount={item.discount}
                      expire={item.expire}
                      disabled={item.isClaimed}
                      isRestaurant={false}
                    />
                  </Grid>
              ))}
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
              {voucherList.map((item) => (
                (voucherFilterType === "All" || item.type === voucherFilterType) &&
                  <Grid item key={item.id*10}>
                    {/* {isOwner &&
                        <>
                            <IconButton sx={{position: "relative"}} id="iconButtonS"
                                        onClick={() => {
                                            setDeletePopOpen(true);
                                        }}>
                                <DeleteIcon color="white"/>
                            </IconButton>
                        </>
                    } */}
                    <Voucher
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