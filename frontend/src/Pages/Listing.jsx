import React, {useCallback, useEffect, useState, useRef} from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  InputBase,
  Radio,
  RadioGroup,
} from "@mui/material";
import {alpha, styled} from "@mui/material/styles";
import { Restaurant, Search as SearchIcon, Sort } from "@mui/icons-material";
import {styles} from "../styles.js";
import "./index.css";
import {useNavigate} from "react-router-dom";
import { CallApi, CallApiWithToken } from "../CallApi.js";
import ListingCard from "../Components/listingCard.jsx";

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

function Listing() {
  const scrollDivRef = useRef(null);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [maxWidth, setMaxWidth] = useState(1051);
  const [width, setWidth] = useState();
  const [cardStatus, forceRenderCard] = useState(false);
  const [sortValue, setSortValue] = React.useState("default");
  const navigate = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    const div = scrollDivRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    const div = scrollDivRef.current;
    if (div) {
      const atBottom = div.scrollHeight - div.scrollTop - div.clientHeight < 1;
      console.log("atBottom:", atBottom);
      setIsAtBottom(atBottom);
    }
  };
  // auto load
  useEffect(() => {
    if (isAtBottom) {
      setPageNum(pageNum+1);
      getRestInfo(pageNum+1);
    }
  }, [isAtBottom]);

  const getRestInfo = useCallback((num) => {
    CallApi("/restaurants/get/list/by_name", "POST", {
      name: "",
      start: 0,
      end: (num || pageNum) * 10
    }).then((res) => {
      if (res.status === 200) {
        setRestaurantsList(res.data.Restaurants || []);
      }
    });
  }, [pageNum]);

  useEffect(() => {
    document.title = "Listing";
    getRestInfo();
  }, []);

  const handleSort = (event, data) => {
    setSortValue(data);
    if (data === "default") {
      getRestInfo();
    } else if (data === "rate") {
      CallApi("/restaurants/get/list/by_rating", "POST", {
        ascending_order: true,
        start: 0,
        end: 10
      }).then((res) => {
        if (res.status === 200) {
          setRestaurantsList(res.data.Restaurants || []);
        }
      });
    }
  };

  const resizeWidth = (e) => {
    const w = e.target.innerWidth;
    setWidth(w);
  };

  useEffect(() => {
    const w = window.innerWidth;
    setWidth(w);
    window.addEventListener("resize", resizeWidth);
    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  useEffect(() => {
    if (width >= 1051) {
      setMaxWidth(1051);
    } else if (width < 1051 && width >= 716) {
      setMaxWidth(716);
    } else {
      setMaxWidth(360);
    }
  }, [width]);

  // collect/delete collect
  const collect = (type, id) => {
    if (type === "collect") {
      CallApiWithToken(`/users/favorites/add/${id}`, "POST").then((res) => {
        if (res.status === 200) {
          forceRenderCard(!cardStatus);
        }
      });
    } else {
      CallApiWithToken(`/users/favorites/remove/${id}`, "DELETE").then((res) => {
        if (res.status === 200) {
          forceRenderCard(!cardStatus);
        }
      });
    }
  };

  // enter detail page
  const restaurantDetail = (id) => {
    console.log("id:", id);
    navigate(`/restaurant/${id}`);
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

  // filter
  const handleChange = debounceFilter((data) => {
    CallApi("/restaurants/get/list/by_name", "POST", {
      name: data[0],
      start: 0,
      end: 10
    }).then((res) => {
      if (res.status === 200) {
        setRestaurantsList(res.data.Restaurants || []);
      }
    });
  }, 800);

  const sortBoxStyle = {
    display: "flex",
    background: "#fff",
    margin: "7px 10px -5px 10px",
    borderRadius: "10px",
    paddingLeft: "10px",
    alignItems: "center",
  };

  return (
    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
      <div style={{background: "rgb(255, 243, 209)", width: `${maxWidth}px`}}>
        <Box ref={scrollDivRef} sx={styles.sameColor} style={{height: "calc(100vh - 64px)", overflow: "auto"}}>
          <div style={{height: "calc(100% - 5px)", width: "100%", paddingTop: "5px"}}>
            <div className="list-nav" style={{margin: "0 10px", justifyContent: "space-between"}}>
              <div style={{display: "flex", alignItems: "center"}}>
                <div className="list-nav-icon">
                  <Restaurant sx={{color: "#ff8400"}}/>
                </div>
                <h2>Restaurant</h2>
              </div>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon/>
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{"aria-label": "search"}}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </Search>
            </div>
            <div style={sortBoxStyle}>
              <Sort sx={{marginRight: "10px"}}/>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={sortValue}
                  onChange={handleSort}
                >
                  <FormControlLabel value="default" control={<Radio/>} label="Default sorting"/>
                  <FormControlLabel value="rate" control={<Radio/>} label="High rating"/>
                </RadioGroup>
              </FormControl>
            </div>
            <div>
              {
                restaurantsList.map((item) => (
                  <ListingCard
                    key={item.restaurant_id}
                    restaurantInfo={item}
                    restaurantDetail={restaurantDetail}
                    collect={collect}
                    cardStatus={cardStatus}
                  />
                ))
              }
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}


export default Listing;