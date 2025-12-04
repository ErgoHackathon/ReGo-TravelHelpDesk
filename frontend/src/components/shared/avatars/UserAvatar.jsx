// components/shared/avatars/UserAvatar.jsx
import React from 'react';
import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAvatar = styled(Avatar)(({ theme, size = 'medium' }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 600,
  ...(size === 'small' && {
    width: 32,
    height: 32,
    fontSize: '0.875rem'
  }),
  ...(size === 'medium' && {
    width: 40,
    height: 40,
    fontSize: '1rem'
  }),
  ...(size === 'large' && {
    width: 56,
    height: 56,
    fontSize: '1.5rem'
  })
}));

const UserAvatar = ({ 
  firstName = '', 
  lastName = '', 
  size = 'medium',
  src,
  ...props 
}) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  return (
    <StyledAvatar
      src={src}
      size={size}
      {...props}
    >
      {!src && initials}
    </StyledAvatar>
  );
};

export default UserAvatar;