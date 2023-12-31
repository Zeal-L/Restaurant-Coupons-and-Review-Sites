import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import {useNavigate} from "react-router-dom";
import {ReactComponent as Logo} from "../Resource/logo.svg";
import {Divider} from "@mui/material";
import {Context, useContext} from "../context";
import LoginIcon from "@mui/icons-material/Login";
import {CallApiWithToken} from "../CallApi";

export default function TopBar() {

  const {getter, setter} = useContext(Context);
  const [pages, setPages] = React.useState(["My Restaurant", "Voucher verify"]);
  // eslint-disable-next-line no-unused-vars
  const [settings, setSettings] = React.useState(["Profile","liked Restaurant" ,"Logout"]);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  // eslint-disable-next-line no-unused-vars
  const [haveRestaurant, setHaveRestaurant] = React.useState(false);
  const [restaurantId, setRestaurantId] = React.useState("");
  const [userImage, setUserImage] = React.useState("");
  const [userName, setUserName] = React.useState("");
  React.useEffect(() => {
    if (!getter.login) {
      setPages([]);
    } else if (restaurantId !== "") {
      setPages(["My Restaurant", "Voucher verify"]);
    } else {
      setPages(["Create Restaurant"]);
    }
  }, [restaurantId, getter.login]);

  React.useEffect(() => {
    if (getter.currentUserRestaurantId) {
      setRestaurantId(getter.currentUserRestaurantId);
    }
  }, [getter.currentUserRestaurantId]);

  React.useEffect(() => {
    CallApiWithToken("/restaurants/get/by_token", "GET").then((res) => {
      if (res.status === 200) {
        setRestaurantId(res.data.restaurant_id);
      } else {
        setRestaurantId("");
      }
    });
  }, []);

  React.useEffect(() => {
    CallApiWithToken("users/get/by_token", "GET").then((result) => {
      if (result.status === 200) {
        setUserName(result.data.name);
        setUserImage(result.data.photo);
        setter.setLogin(true);
      } else {
        setter.setLogin(false);
      }
    });
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onClickMenu = (page) => {
    handleCloseNavMenu();
    switch (page) {
    case "My Restaurant":
      navigate("/restaurant/" + restaurantId);
      break;
    case "Voucher verify":
      navigate("/manage/voucher");
      break;
    case "Create Restaurant":
      navigate("/manage/create");
      break;
    default:
      break;
    }
  };

  const onClickSetting = (page) => {
    handleCloseUserMenu();
    switch (page) {
    case "Profile":
      navigate("/profile");
      break;
    case "Logout":
      localStorage.removeItem("token");
      setter.setLogin(false);
      navigate("/login");
      break;
    case "liked Restaurant":
      navigate("/user/likedRestaurant");
      break;
    default:
      break;
    }
  };
  return (
    // <Box sx={{ flexGrow: 1 , backgroundColor: 'rgb(255, 243, 209)'}}>
    <>
      <Box sx={{height: "68.5px", width: "100%"}}/>
      <AppBar sx={{flexGrow: 1, backgroundColor: "rgb(255, 243, 209)"}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/*<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />*/}
            <Logo style={{display: {xs: "none", md: "flex"}, mr: 1, width: "50px", height: "50px", cursor: "pointer"}}
              onClick={() => navigate("/")}/>
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => navigate("/")}
              sx={{
                mr: 2,
                display: {xs: "none", md: "flex"},
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "black",
                textDecoration: "none",
                cursor: "pointer"
              }}
            >
              Donut
            </Typography>

            <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="black"
              >
                <MenuIcon/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: {xs: "block", md: "none"},
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => onClickMenu(page)}>
                    <Typography style={{color: "black"}} textAlign="center">
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/*<AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />*/}
            {/*<Logo style={{ display: { xs: 'flex', md: 'none' }, mr: 1 , width: '50px', height: '50px'}} onClick={() => navigate('/')} />*/}

            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: {xs: "flex", md: "none"},
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "black",
                textDecoration: "none",
              }}
            >
              Donut
            </Typography>
            <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
              {pages.map((page, index) => (
                <>
                  <Button
                    key={page}
                    onClick={() => onClickMenu(page)}
                    sx={{my: 2, color: "white", display: "block"}}
                    style={{color: "black"}}
                  >
                    {page}
                  </Button>
                  {index !== pages.length - 1 && (
                    <Divider orientation="vertical" variant="middle" flexItem/>
                  )}
                </>
              ))}
            </Box>
            <Box sx={{flexGrow: 0}}>
              {getter.login ? (
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                  <Avatar alt={userName} src={`data:image/png;base64,${userImage}`}/>
                </IconButton>
              ) : (
                <Tooltip title="Login" arrow>
                  <IconButton aria-label="fingerprint" color="secondary" onClick={() => navigate("/login")}>
                    <LoginIcon />
                  </IconButton>
                </Tooltip>
              )
              }
              <Menu
                sx={{mt: "45px"}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => onClickSetting(setting)}>
                    <Typography textAlign="center">
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}