import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {Card, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import noPicture from "../Resource/image/no-upload-picture.png";
import { CallApi } from "../CallApi";

function MenuCard(props) {
  const {onEdit, onDelete, id, forceRender} = props;
  const [dishInfo, setDishInfo] = useState({});
  const { name, price, image, description } = dishInfo;

  useEffect(() => {
    CallApi(`/dishes/get/by_id/${id}`, "GET").then((res) => {
      if (res.status === 200) {
        setDishInfo(res.data);
      }
    });
  }, [forceRender]);

  return (
    <Card sx={{width: 163, display: "inline-block", marginRight: "5px"}}>
      <CardMedia
        component="img"
        height="100"
        image={`data:image/png;base64,${image}` || noPicture}
      />

      <CardContent sx={{padding: "5px", display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>

        <Tooltip title={name} placement="top">
          <Typography variant="body2" color="text.secondary"
            sx={{maxWidth: "65%", overflow: "hidden", textOverflow: "ellipsis"}}>
            {name}
          </Typography>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          ${price}
        </Typography>
        <Tooltip title={description} placement="top">
          <div
            style={{
              fontSize: "12px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "35px",
              color: "#afabab",
              width: "100%"
            }}
          >
            {description}
          </div>
        </Tooltip>
      </CardContent>
      <CardActions disableSpacing sx={{display: "flex", justifyContent: "flex-end", padding: 0}}>
        <Tooltip title="edit" placement="top">
          <IconButton aria-label="edit" sx={{padding: "0 5px"}} onClick={onEdit}>
            <Edit sx={{width: "0.8em"}}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="delete" placement="top">
          <IconButton aria-label="delete" sx={{padding: "0 5px"}} onClick={onDelete}>
            <Delete sx={{width: "0.8em"}}/>
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );

}

MenuCard.protoType = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  image: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MenuCard;