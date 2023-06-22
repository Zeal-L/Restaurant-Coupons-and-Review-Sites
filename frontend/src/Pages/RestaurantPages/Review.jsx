import React, { useState } from 'react';
import {Avatar, Box, Typography, Rating, Button, Divider, TextField, Switch, FormControlLabel} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';
import StarIcon from '@mui/icons-material/Star';
import ReportIcon from '@mui/icons-material/Report';
import IconButton from "@mui/material/IconButton";
const comments = [
    {
        id: 1,
        user: {
            name: 'John Doe',
            avatar: 'https://example.com/avatar1.jpg',
        },
        rating: 4.5,
        timestamp: '2023-06-15',
        content: 'Great product! I highly recommend it.',
        likes: 10,
        dislikes: 2,
        reviews: [
            {
                id: 1,
                user: {
                    name: 'Jane Smith',
                    avatar: 'https://example.com/avatar2.jpg',
                },
                timestamp: '2023-06-15',
                content: 'Thanks for your review!',
            },

            {
                id: 1,
                user: {
                    name: 'Jane Smith',
                    avatar: 'https://example.com/avatar2.jpg',
                },
                timestamp: '2023-06-15',
                content: 'Thanks for your review!',
            }
        ]
    },
    {
        id: 2,
        user: {
            name: 'Jane Smith',
            avatar: 'https://example.com/avatar2.jpg',
        },
        rating: 5,
        timestamp: '2023-06-14',
        content: 'Excellent service. Will definitely buy again.',
        likes: 15,
        dislikes: 3,
        reviews: [
            {
                id: 1,
                user: {
                    name: 'Jane Smith',
                    avatar: 'https://example.com/avatar2.jpg',
                },
                timestamp: '2023-06-15',
                content: 'Thanks for your review!',
            }
        ]
    },
];


const currentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}-${month}-${day}`;
}

const Comment = ({ user, rating, timestamp, content, likes, dislikes, reviews }) => {
    const [likeCount, setLikeCount] = useState(likes);
    const [dislikeCount, setDislikeCount] = useState(dislikes);
    const [showReplies, setShowReplies] = useState(false);
    const [reply, setReply] = useState('');
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

    return (
        <Box display="flex" alignItems="flex-start" marginBottom={2} sx={{ padding: 2, borderRadius: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Avatar src={user.avatar} alt={user.name} />
            <Box marginLeft={2} flexGrow={1}>
                <Typography variant="subtitle1">{user.name}</Typography>
                <Box display="flex" alignItems="center">
                    <Rating
                        name="rating"
                        value={rating}
                        precision={0.5}
                        readOnly
                        emptyIcon={<StarIcon style={{ color: '#ccc' }} />}
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
                            startIcon={<ThumbUpIcon />}
                            onClick={handleLike}
                        >
                            {likeCount}
                        </Button>
                        <Button
                            variant="text"
                            color="secondary"
                            startIcon={<ThumbDownIcon />}
                            onClick={handleDislike}
                            sx={{ marginLeft: 1 }}
                        >
                            {dislikeCount}
                        </Button>
                    </Box>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <IconButton color="error">
                            <ReportIcon />
                        </IconButton>
                        <IconButton onClick={toggleReplies}>
                            <ReplyIcon />
                        </IconButton>
                    </Box>
                </Box>
                    <Box sx={{ marginLeft: 4 }}>
                        {reviews.map((review) => (
                            <Box
                                key={review.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 2,
                                    marginTop: 1,
                                }}
                            >
                                <Avatar src={review.user.avatar} alt={review.user.name} />
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
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    paddingLeft: 2,
                                    marginTop: 1,
                                }}
                            >
                                <Avatar src={'https://example.com/avatar2.jpg'} alt={'self'} />
                                <Box marginLeft={2} flexGrow={1}>
                                    <Typography variant="subtitle2">{'self'}</Typography>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            {currentDateTime()}
                                        </Typography>
                                        <FormControlLabel control={<Switch value={isAnonymous} onClick={() => {
                                            console.log(isAnonymous)
                                            setIsAnonymous(!isAnonymous)
                                        }}/>} label="Anonymous" sx={{ marginLeft: 1 }} />
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
                                        sx={{ marginTop: 1 }}
                                    />
                                    <Button variant="contained" color="primary" onClick={() => {}} sx={{ marginTop: 1 }}>
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



const Review = () => {
    const [ratingValue, setRatingValue] = useState(5);
    const [comment, setComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const userDetail = {
        name: 'Jane Smith',
        image: '',
    };
    const [userName, setUserName] = useState(userDetail.name);
    const [userImage, setUserImage] = useState(userDetail.image);
    return (
        <div>
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    user={comment.user}
                    rating={comment.rating}
                    timestamp={comment.timestamp}
                    content={comment.content}
                    likes={comment.likes}
                    dislikes={comment.dislikes}
                    reviews={comment.reviews} // 添加reviews属性
                />
            ))}

            <Box
                key={5}
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    paddingLeft: 2,
                    marginTop: 1,
                }}
            >
                <Avatar src={userImage} alt={userName} />
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
                            emptyIcon={<StarIcon style={{ color: '#ccc' }} />}
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
                            setIsAnonymous(!isAnonymous)
                            if (isAnonymous) {
                                setUserName(userDetail.name)
                                setUserImage(userDetail.image)
                            } else {
                                setUserName('Anonymous')
                                setUserImage('')
                            }
                        }}/>} label="Anonymous" sx={{ marginLeft: 1 }} />
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
                        sx={{ marginTop: 1 }}
                    />
                    <Button variant="contained" color="primary" onClick={() => {}} sx={{ marginTop: 1 }}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </div>
    );
};


export default Review;
