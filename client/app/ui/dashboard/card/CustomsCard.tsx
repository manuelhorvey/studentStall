import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';

interface CustomCardProps {
  image: string;
  price: string;
  title: string;
  description: string;
  altText: string;
}

const CustomsCard: React.FC<CustomCardProps> = ({ image, title, price, description, altText }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          height="150"
          image={image}
          alt={altText}
          loading="lazy"
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box>
            <Typography gutterBottom variant="h5" component="div">
              {price}
            </Typography>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CustomsCard;
