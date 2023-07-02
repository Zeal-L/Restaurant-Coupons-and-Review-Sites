import React from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Typography,
    CardMedia,
    CardActions,
    IconButton,
    Tooltip
} from "@mui/material";
import { Edit, Delete } from '@mui/icons-material'
import noPicture from '../Resource/image/no-upload-picture.png'

function MenuCard(props) {
    const { name, price, image, onEdit, onDelete } = props;

    return (
        <Card sx={{ width: 163, display: 'inline-block', marginRight: '5px' }}>
            <CardMedia
                component="img"
                height="100"
                image={image || noPicture}
                alt={name}
            />
            <CardContent sx={{ padding: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip title={name} placement="top">
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {name}
                    </Typography>
                </Tooltip>
                <Typography variant="body2" color="text.secondary" >
                    ${price}
                </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}>
                <Tooltip title="edit" placement="top">
                <IconButton aria-label="edit" sx={{ padding: '0 5px' }} onClick={onEdit}>
                    <Edit sx={{width: '0.5em'}} />
                </IconButton>
                </Tooltip>
                <Tooltip title="delete" placement="top">
                <IconButton aria-label="delete" sx={{padding: '0 5px'}} onClick={onDelete}>
                    <Delete sx={{width: '0.5em'}} />
                </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
    
}

MenuCard.protoType = {
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.string,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
}

export default MenuCard;