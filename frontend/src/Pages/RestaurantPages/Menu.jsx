import React, {useState} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  SpeedDial,
  SpeedDialIcon,
  TextField,
  Typography
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {TransitionUp} from "../../styles.js";
import PropTypes from "prop-types";
import {useParams} from "react-router-dom";
import {CallApi, CallApiWithToken} from "../../CallApi";
import {Context, NotificationType, useContext} from "../../context";
import {LoadingButton} from "@mui/lab";

function Menu(props) {
  const restaurantId = props.id;
  const [menuItems, setMenuItems] = useState([]);
  const {getter, setter} = useContext(Context);
  const [popImage, setPopImage] = React.useState("");
  const [popName, setPopName] = React.useState("");
  const [popPrice, setPopPrice] = React.useState(0);
  const [popDescription, setPopDescription] = React.useState("");
  const [popOpen, setPopOpen] = React.useState(false);
  const [isOwner, setIsOwner] = useState(true);
  const [popType, setPopType] = React.useState("Add Dish");
  const [popLoading, setPopLoading] = React.useState(false);
  const [popDishId, setPopDishId] = React.useState("");


  React.useEffect(() => {
    CallApiWithToken("/restaurants/get/by_token", "GET").then((res) => {
        if (res.status === 200) {
          setIsOwner(res.data.restaurant_id.toString() === restaurantId);
        } else {
          setIsOwner(false);
        }
    })
  }, []);

  React.useEffect(() => {
    setMenuItems([]);
    let mi = [];
    CallApi(`/dishes/get/by_restaurant/${restaurantId}`, "GET").then((res) => {
        if (res.status === 200) {
          const dish_ids = res.data.dish_ids;
          for (let i = 0; i < dish_ids.length; i++) {
            CallApi(`/dishes/get/by_id/${dish_ids[i]}`, "GET").then((res) => {
              if (res.status === 200) {
                console.log(res.data);
                setMenuItems((prev) => [...prev, res.data]);
              } else {
                setter.showNotification(res.data.message, NotificationType.Error);
              }
            });
          }
        } else {
          setter.showNotification(res.data.message, NotificationType.Error);
        }
    });
  }, []);
  const EditDish = (id, image, name, price, description) => {
    image = image.replace(/^data:image\/[a-z]+;base64,/, "");
    // /dishes/reset/info/{dish_id}
    CallApiWithToken(`/dishes/reset/info/${menuItems[0].dish_id}`, "PUT", { image, name, price, description }).then((res) => {
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
        let tmpList = menuItems;
        // remove the old one
        tmpList = tmpList.filter((dish) => dish.dish_id !== id);
        // add the new one
        tmpList.push({ dish_id: id, image, name, price, description });
        setMenuItems(tmpList);
        setPopOpen(false);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
  };
  const AddDish = (image, name, price, description) => {
    setPopLoading(true)
    image = image.replace(/^data:image\/[a-z]+;base64,/, "");
    CallApiWithToken("/dishes/new", "POST", { image, name, price, description }).then((res) => {
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
        setMenuItems((prev) => [...prev, { image, name, price, description }]);
        setPopOpen(false);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
      setPopLoading(false)
    });
  };

  return (
    <>
      <Grid container spacing={2} style={{padding: "24px"}}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {isOwner &&
              <>
                <IconButton sx={{position: "relative"}} id="iconButtonS">
                  <EditIcon color="white" onClick={() => {
                    setPopImage(item.image);
                    setPopName(item.name);
                    setPopPrice(item.price);
                    setPopDescription(item.description);
                    setPopType("Edit Dish");
                    setPopDishId(item.dish_id);
                    setPopOpen(true);
                  }}/>
                </IconButton>
                <IconButton sx={{position: "relative"}} id="iconButtonS" onClick={() => {
                  // /dishes/delete/by_id/{dish_id}
                  CallApiWithToken(`/dishes/delete/by_id/${item.dish_id}`, "DELETE").then((res) => {
                    if (res.status === 200) {
                      setter.showNotification(res.data.message, NotificationType.Success);
                      setMenuItems((prev) => prev.filter((dish) => dish.dish_id !== item.dish_id));
                    } else {
                      setter.showNotification(res.data.message, NotificationType.Error);
                    }
                  });
                }}>
                  <DeleteIcon color="white"/>
                </IconButton>
              </>
            }
            <Card>
              <CardMedia component="img" src={`data:image/png;base64,${item.image}`} alt={item.name} height="200"/>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  ${item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
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
            onClick={() => {
              setPopImage("");
              setPopName("");
              setPopPrice(0);
              setPopDescription("");
                setPopType("Add Dish");
              setPopOpen(true);
            }}
          />
          <MenuDialog
            open={popOpen}
            setOpen={setPopOpen}
            title={popType}
            image={popImage}
            setImage={setPopImage}
            name={popName}
            setName={setPopName}
            price={popPrice}
            setPrice={setPopPrice}
            description={popDescription}
            setDescription={setPopDescription}
            loading={popLoading}
            handleSubmit={() => {
                if (popType === "Add Dish") {
                    AddDish(popImage, popName, popPrice, popDescription);
                } else {
                    EditDish(popDishId, popImage, popName, popPrice, popDescription);
                }
            }}
          />
        </>
      }
    </>
  );
}

Menu.propTypes = {
    id: PropTypes.string.isRequired,
}

const MenuDialog = (props) => {
  const updateImage = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {

        // image = image.replace(/^data:image\/[a-z]+;base64,/, "");
        props.setImage(reader.result.replace(/^data:image\/[a-z]+;base64,/, ""));
      };
    }
  };
  return (
    <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Button
          component="label"
          name="thumbnail-upload-input"
          fullWidth
        >
          {props.image === "" || props.image === undefined
            ? (
              <Box sx={{
                width: "100%",
                paddingTop: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "grey.300",
                color: "grey.600",
                borderRadius: "4px",
              }}>
                <AddIcon
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "grey.600",
                  }}/>
              </Box>
            )
            : (
              <img src={`data:image/png;base64,${props.image}`} alt="thumbnail" style={{width: "100%"}}/>
            )}
          <input hidden accept="image/*" type="file" onChange={updateImage}/>
        </Button>

        <TextField
          label="Name"
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="price"
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
        <TextField
          label="Description"
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={props.loading}
          onClick={props.handleSubmit} variant="contained" color="primary">
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

MenuDialog.prototype = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  setImage: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setPrice: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Menu;

