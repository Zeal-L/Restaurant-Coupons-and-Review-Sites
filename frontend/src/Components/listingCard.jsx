import React, { useEffect, useState } from "react";
import { Favorite, FavoriteBorderRounded, PinDrop } from "@mui/icons-material";
import {
    Card,
    CardMedia,
    Grid,
    Rating,
    Tooltip
  } from "@mui/material";
import {pink} from "@mui/material/colors";
import { CallApiWithToken } from "../CallApi";
import Voucher from "./Voucher";

function ListingCard(props) {
    const { restaurantInfo: item, restaurantDetail, collect, cardStatus } = props
    const [like, setLike] = useState(false)
    const [voucherList, setVoucherList] = useState([])

    useEffect(() => {
        CallApiWithToken(`/users/favorites/check/${item.restaurant_id}`, "GET").then((res) => {
            if (res.status === 200) {
              setLike(res.data.is_favorite)
            }
        })
        CallApiWithToken(`/vouchers/get/template/by_restaurant/${item.restaurant_id}`, "GET").then((res) => {
          if (res.status === 200) {
            setVoucherList(res.data.info)
          } else {
            setVoucherList([])
          }
          console.log('res:', res)
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
              <Tooltip title={item.name} placement="top-start">
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontSize: "x-large"
                  }}
                  onClick={() => restaurantDetail(item.restaurant_id)}
                >
                  {item.name}
                </div>
              </Tooltip>
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
            <div style={{float: "left", marginTop: "10px", maxHeight: "60px"}}>
              {
                voucherList.slice(0, 2).map(voucher => (
                  <Voucher
                    key={voucher.template_id}
                    id={voucher.template_id}
                    type={voucher.type}
                    condition={voucher.condition}
                    discount={voucher.discount}
                    expire={voucher.expire}
                    isRestaurant={true}
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
