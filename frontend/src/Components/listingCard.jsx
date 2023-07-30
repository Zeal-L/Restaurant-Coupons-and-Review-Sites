import React, { useEffect, useState } from "react";
import {Favorite, FavoriteBorderRounded, PinDrop, Search as SearchIcon } from "@mui/icons-material";
import {
    Card,
    CardMedia,
    Grid,
    Rating,
    Tooltip
  } from "@mui/material";
import {pink} from "@mui/material/colors";
import { CallApiWithToken } from "../CallApi";

function ListingCard(props) {
    const { restaurantInfo: item, restaurantDetail, collect, cardStatus } = props
    const [like, setLike] = useState(false)

    useEffect(() => {
        CallApiWithToken(`/users/favorites/check/${item.restaurant_id}`, "get").then((res) => {
            if (res.status === 200) {
              setLike(res.data.is_favorite)
            }
        })
    }, [cardStatus, JSON.stringify(item)])

    return (
        <Card
        sx={{width: "320px", height: "388px", display: "inline-block", boxShadow: "none", margin: "10px"}}>
        <Grid container>
          <Grid item xs={12} sx={{height: 200, padding: "10px"}}>
            <CardMedia
              component="img"
              image={`data:image/png;base64,${item.image}`}
              onClick={() => restaurantDetail(item.restaurant_id)}
              sx={{cursor: "pointer", maxHeight: "100%", maxWidth: "100%"}}
            />
          </Grid>
          <Grid item xs={12} className="restaurant-introduction">
            <div style={{display: "flex", alignItems: "end"}}>
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  fontSize: "x-large"
                }}
                onClick={() => restaurantDetail(item.restaurant_id)}
              >
                {item.name}
              </div>
              {
                like ?
                  <Favorite
                    onClick={() => collect('unCollect', item.restaurant_id)}
                    sx={{
                      width: "1.2em",
                      height: "1.2em",
                      marginLeft: "10px",
                      color: pink[500],
                      cursor: "pointer"
                    }}
                  /> :
                  <FavoriteBorderRounded
                    onClick={() => collect('collect', item.restaurant_id)}
                    sx={{width: "1.2em", height: "1.2em", marginLeft: "10px", cursor: "pointer"}}
                  />
              }
            </div>
            <div style={{fontSize: "x-small", display: "flex", margin: "8px 0"}}>
              <Rating sx={{fontSize: "1rem", marginRight: "8px"}} name="read-only" value={item.rating}
                readOnly/>
              {`${item.comment_count} evaluations`}
            </div>
            <Tooltip title={item.address} placement="top-start">
              <div style={{display: "flex", alignItems: "center"}}>
                <PinDrop sx={{width: "0.9rem", marginRight: "5px"}}/>
                <div style={{fontSize: "small", overflow: "hidden", textOverflow: "ellipsis"}}>
                  {item.address}
                </div>
              </div>
            </Tooltip>
            {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}> */}
            <div style={{float: "left", marginTop: "10px", maxHeight: "60px"}}>
              {/* voucher  */}
              {
                item.vouchersInfo?.length > 0 && item.vouchersInfo.map(voucher => (
                  <Voucher
                    type={voucher.type}
                    condition={voucher.condition}
                    discount={voucher.discount}
                    expire={voucher.expire}
                    transform={0.3}
                    isListing
                    sx={{marginRight: "10px", display: "inline-block"}}
                  />
                ))
              }
            </div>
          </Grid>
        </Grid>
      </Card>
    )
}

export default ListingCard;
