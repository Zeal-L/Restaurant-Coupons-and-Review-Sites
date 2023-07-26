import React, {useState} from "react";
import {Avatar, Box, Button, FormControlLabel, Rating, Switch, TextField, Typography} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from "@mui/icons-material/Reply";
import StarIcon from "@mui/icons-material/Star";
import ReportIcon from "@mui/icons-material/Report";
import IconButton from "@mui/material/IconButton";
import {CallApiWithToken} from "../../CallApi";
import PropTypes from "prop-types";
import {Context, NotificationType, useContext} from "../../context";

// const comments = [
//   {
//     id: 1,
//     user: {
//       name: "John Doe",
//       avatar: "https://example.com/avatar1.jpg",
//     },
//     rating: 4.5,
//     timestamp: "2023-06-15",
//     content: "Great product! I highly recommend it.",
//     likes: 10,
//     dislikes: 2,
//     reviews: [
//       {
//         id: 1,
//         user: {
//           name: "Jane Smith",
//           avatar: "https://example.com/avatar2.jpg",
//         },
//         timestamp: "2023-06-15",
//         content: "Thanks for your review!",
//       },
//
//       {
//         id: 1,
//         user: {
//           name: "Jane Smith",
//           avatar: "https://example.com/avatar2.jpg",
//         },
//         timestamp: "2023-06-15",
//         content: "Thanks for your review!",
//       }
//     ]
//   },
//   {
//     id: 2,
//     user: {
//       name: "Jane Smith",
//       avatar: "https://example.com/avatar2.jpg",
//     },
//     rating: 5,
//     timestamp: "2023-06-14",
//     content: "Excellent service. Will definitely buy again.",
//     likes: 15,
//     dislikes: 3,
//     reviews: [
//       {
//         id: 1,
//         user: {
//           name: "Jane Smith",
//           avatar: "https://example.com/avatar2.jpg",
//         },
//         timestamp: "2023-06-15",
//         content: "Thanks for your review!",
//       }
//     ]
//   },
// ];


const currentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}-${month}-${day}`;
};

const Comment = ({user, rating, timestamp, content, likes, dislikes, reviews}) => {
  console.log(user);
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleLike = () => {
    setLikeCount(likeCount + 1);
  };

  const handleDislike = () => {
    setDislikeCount(dislikeCount + 1);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  console.log(rating);
  return (
    <Box display="flex" alignItems="flex-start" marginBottom={2}
      sx={{padding: 2, borderRadius: 4, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"}}>
      <Avatar src={user.avatar} alt={user.name}/>
      <Box marginLeft={2} flexGrow={1}>
        <Typography variant="subtitle1">{user.name}</Typography>
        <Box display="flex" alignItems="center">
          <Rating
            name="rating"
            value={rating}
            precision={0.5}
            readOnly
            emptyIcon={<StarIcon style={{color: "#ccc"}}/>}
          />
          <Typography variant="body2" color="text.secondary" marginLeft={1}>
            {rating}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {timestamp}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {content}
        </Typography>
        <Box display="flex" alignItems="center">
          <Box>
            <Button
              variant="text"
              color="primary"
              startIcon={<ThumbUpIcon/>}
              onClick={handleLike}
            >
              {likeCount}
            </Button>
            <Button
              variant="text"
              color="secondary"
              startIcon={<ThumbDownIcon/>}
              onClick={handleDislike}
              sx={{marginLeft: 1}}
            >
              {dislikeCount}
            </Button>
          </Box>
          <Box sx={{marginLeft: "auto"}}>
            <IconButton color="error">
              <ReportIcon/>
            </IconButton>
            <IconButton onClick={toggleReplies}>
              <ReplyIcon/>
            </IconButton>
          </Box>
        </Box>
        <Box sx={{marginLeft: 4}}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{
                display: "flex",
                alignItems: "center",
                paddingLeft: 2,
                marginTop: 1,
              }}
            >
              <Avatar src={review.user.avatar} alt={review.user.name}/>
              <Box marginLeft={2}>
                <Typography variant="subtitle2">{review.user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {review.timestamp}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {review.content}
                </Typography>
              </Box>
            </Box>
          ))}
          {showReplies && (
            <Box
              key={5}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                paddingLeft: 2,
                marginTop: 1,
              }}
            >
              <Avatar src={"https://example.com/avatar2.jpg"}
                alt={isAnonymous ? "Anonymous" : "Jane Smith"} /*Anonymous Setting*/ />
              <Box marginLeft={2} flexGrow={1}>
                <Typography variant="subtitle2">{isAnonymous ? "Anonymous" : "Jane Smith"}</Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {currentDateTime()}
                  </Typography>
                  <FormControlLabel control={<Switch value={isAnonymous} onClick={() => {
                    setIsAnonymous(!isAnonymous);
                  }}/>} label="Anonymous" sx={{marginLeft: 1}}/>
                </Box>
                <TextField
                  id="comment-input"
                  label="Write a comment"
                  variant="outlined"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  sx={{marginTop: 1}}
                />
                <Button variant="contained" color="primary" onClick={() => {
                }} sx={{marginTop: 1}}>
                  Submit
                </Button>
              </Box>
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  );
};


function Review (props){
  const restaurantId = props.id;
  const {getter, setter} = useContext(Context);
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const userDetail = {
    name: "Jane Smith",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/220px-KFC_logo.svg.png",
  };
  const [userName, setUserName] = useState(userDetail.name);
  const [userImage, setUserImage] = useState(userDetail.image);
  const [comments, setComments] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [maxComments, setMaxComments] = useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      setIsAtBottom( (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight === document.documentElement.scrollHeight);
      console.log(isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  React.useEffect(() => {
    CallApiWithToken(`/users/get/by_token`, "GET", ).then((response) => {
      if (response.status === 200) {
        setUserName(response.data.name);
        setUserImage(response.data.image);
      } else {
        setter.showNotification(response.data.message, NotificationType.Error);
      }
    });
  }, [restaurantId]);

  const updateReview = () => {
    const restaurant_id = restaurantId;
    const start = numberOfComments;
    const end = numberOfComments + 5 < maxComments ? numberOfComments + 5 : maxComments;
    console.log(start, end);
    if(end === 0 || start >= end) return;
    CallApiWithToken(`/comments/get/by_restaurant`, "POST",{restaurant_id,start,end}).then((response) => {
      if (response.status === 200) {
        const comment_ids = response.data.comment_ids;
        console.log(comment_ids);
        for (let i = 0; i < comment_ids.length; i++) {
          console.log(comment_ids);
          getReviews(comment_ids[i]).then((comment) => {
            setComments((comments) => [...comments, comment]);
          });
        }
      } else {
        setter.showNotification(response.data.message, NotificationType.Error);
      }
    });
  };

  React.useEffect(() => {
    updateReview();
  }, [restaurantId,maxComments]);

  React.useEffect(() => {
    CallApiWithToken(`/comments/get/count/by_restaurant/${restaurantId}`, "GET").then((response) => {
      if (response.status === 200) {
        setMaxComments(response.data.count);
        updateReview();
      } else {
        setter.showNotification(response.data.message, NotificationType.Error);
      }
    });
  }, [restaurantId]);

  // auto load
  React.useEffect(() => {
    if (isAtBottom) {
      setNumberOfComments((numberOfComments) => numberOfComments + 5);
      updateReview();
    }
  }, [isAtBottom]);
  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          user={comment.user}
          rating={comment.rate}
          timestamp={comment.date}
          content={comment.content}
          likes={comment.likes}
          dislikes={comment.dislikes}
          reviews={comment.reviews} /*Adding Commpents' properties*/
        />
      ))}

      <Box
        key={5}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          paddingLeft: 2,
          marginTop: 1,
        }}
      >
        <Avatar src={userImage} alt={userName}/>
        <Box marginLeft={2} flexGrow={1}>
          <Typography variant="subtitle2">{userName}</Typography>
          <Box display="flex" alignItems="center">
            <Rating
              name="rating"
              value={ratingValue}
              precision={0.5}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
              }}
              emptyIcon={<StarIcon style={{color: "#ccc"}}/>}
            />
            <Typography variant="body2" color="text.secondary" marginLeft={1}>
              {ratingValue}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {currentDateTime()}
            </Typography>
            <FormControlLabel control={<Switch value={isAnonymous} onClick={() => {
              setIsAnonymous(!isAnonymous);
              if (isAnonymous) {
                setUserName(userDetail.name);
                setUserImage(userDetail.image);
              } else {
                setUserName("Anonymous");
                setUserImage("");
              }
            }}/>} label="Anonymous" sx={{marginLeft: 1}}/>
          </Box>
          <TextField
            id="comment-input"
            label="Write a comment"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            sx={{marginTop: 1}}
          />
          <Button variant="contained" color="primary" onClick={() => {
            CallApiWithToken(`/comments/new`, "POST", {
              restaurant_id: restaurantId,
              content: comment,
              rate: ratingValue,
              anonymity: isAnonymous,
              }
            ).then((response) => {
              if (response.status === 200) {
                  let comment = response.data;
                  console.log(comment);
                  getReviews(comment.comment_id).then((commentData) => {
                      setComments((comments) => [...comments, commentData]);
                  });
                  setter.showNotification("Comment added successfully", NotificationType.Success);
              } else {
                  setter.showNotification(response.data.message, NotificationType.Error);
              }
              });
            setComment("");
          }} sx={{marginTop: 1}}>
            Submit
          </Button>
        </Box>
      </Box>
    </div>
  );
};

async function getReviews (comment_id){
  const response = await CallApiWithToken(`comments/get/by_id/${comment_id}`, "GET");
  if (response.status !== 200) {
    return null;
  }
  if (response.data.anonymity === true) {
    response.data.user = {
      name: "Anonymous",
      avatar: "",
    };
  } else {
    const userResponse = await CallApiWithToken(`users/get/by_id/${response.data.user_id}`, "GET");
    if (userResponse.status !== 200) {
      response.data.user = {
        name: "Anonymous",
        avatar: "",
      };
    }
    else {
      response.data.user = {
        name: userResponse.data.name,
        avatar: userResponse.data.photo,
      };
    }
  }
  let replice = [];
  let repliceCount = await CallApiWithToken(`replies/get/count/by_comment/${comment_id}`, "GET");
  if (repliceCount.status !== 200) {
      return null;
  }
  repliceCount = repliceCount.data.count;

  if (repliceCount !== 0) {
    const repliceList = await CallApiWithToken(`/replies/get/by_comment`, "POST", {comment_id, start: 0, end: repliceCount});
    if (repliceList.status === 200) {
      const repliceIds = repliceList.data.reply_ids;
      console.log(repliceList);
      for (let i = 0; i < repliceIds.length; i++) {
          const repliceResponse = await CallApiWithToken(`replies/get/by_id/${repliceIds[i]}`, "GET");
          if (repliceResponse.status === 200) {
              replice.push(repliceResponse.data);
          }
      }
    }
  }
  response.data.reviews = replice;
  return response.data;
}

Review.propTypes = {
    id: PropTypes.string.isRequired,
}


export default Review;
