import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';

function Menu() {
    const menuItems = [
        {
            name: '菜品一',
            price: '$9.99',
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
            description: '这是菜品一的介绍。',
        },
        {
            name: '菜品二',
            price: '$12.99',
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
            description: '这是菜品二的介绍。',
        },
        {
            name: '菜品三',
            price: '$8.99',
            image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
            description: '这是菜品三的介绍。',
        },
    ];

    return (
        <Grid container spacing={2} style={{ padding: '24px' }}>
            {menuItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardMedia component="img" src={item.image} alt={item.name} height="200" />
                        <CardContent>
                            <Typography variant="h5" component="div" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {item.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Menu;

