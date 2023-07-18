import React, {useState} from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    SpeedDial,
    SpeedDialIcon,
    Dialog,
    DialogTitle, DialogContent, TextField, DialogActions, Button, InputAdornment
} from '@mui/material';
import CreateIcon from "@mui/icons-material/Create";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from '@mui/icons-material/Add';
import {TransitionUp} from "../../styles.js";
import PropTypes from "prop-types";

function Menu() {
    const menuItems = [
        {
            name: 'dish 1',
            price: '9.99',
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
            description: 'this is the description of dish 1.',
        },
        {
            name: 'dish 2',
            price: '12.99',
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
            description: 'this is the description of dish 2.',
        },
        {
            name: 'dish 3',
            price: '8.99',
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
            description: 'this is the description of dish 3.',
        },
    ];
    const [popImage, setPopImage] = React.useState('');
    const [popName, setPopName] = React.useState('');
    const [popPrice, setPopPrice] = React.useState(0);
    const [popDescription, setPopDescription] = React.useState('');
    const [popOpen, setPopOpen] = React.useState(false);
    const [isOwner, setIsOwner] = useState(true);

    return (
        <>
            <Grid container spacing={2} style={{ padding: '24px' }}>
                {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        {isOwner &&
                            <>
                                <IconButton sx={{ position: 'relative'}} id="iconButtonS">
                                    <EditIcon color="white" onClick={() => {
                                        setPopImage(item.image);
                                        setPopName(item.name);
                                        setPopPrice(item.price);
                                        setPopDescription(item.description);
                                        setPopOpen(true);
                                    }}/>
                                </IconButton>
                                <IconButton sx={{ position: 'relative'}} id="iconButtonS">
                                    <DeleteIcon color="white" />
                                </IconButton>
                            </>
                        }
                        <Card>
                            <CardMedia component="img" src={item.image} alt={item.name} height="200" />
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
                sx={{position: 'fixed', bottom: 16, right: 16}}
                name="newListingBtn"
                icon={<SpeedDialIcon openIcon={<CreateIcon />}/>}
                onClick={() => {
                    setPopImage('');
                    setPopName('');
                    setPopPrice(0);
                    setPopDescription('');
                    setPopOpen(true);
                }}
            />
            <MenuDialog
                open={popOpen}
                setOpen={setPopOpen}
                title="Add Menu Item"
                image={popImage}
                setImage={setPopImage}
                name={popName}
                setName={setPopName}
                price={popPrice}
                setPrice={setPopPrice}
                description={popDescription}
                setDescription={setPopDescription}
            />
       </>
}
        </>
    );
};

const MenuDialog = (props) => {
    const updateImage = (e) => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onloadend = () => {
                props.setImage(reader.result);
            };
        }
    }
    return (
        <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>

                <Button
                    component="label"
                    name="thumbnail-upload-input"
                    fullWidth
                >
                    {props.image === '' || props.image === undefined
                        ? (
                            <Box   sx={{
                                width: '100%',
                                paddingTop: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: 'grey.300',
                                color: 'grey.600',
                                borderRadius: '4px',
                            }}>
                                <AddIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        color: 'grey.600',
                                    }}/>
                            </Box>
                        )
                        : (
                            <img src={props.image} alt="thumbnail" style={{width: '100%'}}/>
                        )}
                    <input hidden accept="image/*" type="file"  onChange={updateImage}/>
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
                <Button onClick={props.handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
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

