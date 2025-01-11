import { styled } from '@mui/material/styles';
import {Box, Typography, Paper} from "@mui/material";

export const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'bottom',
    marginBottom: theme.spacing(1),
    color: '#5d4037',
  }));
  
export const StyledTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    display: "flex", 
  }));
  
  export const StyledPaper = styled(Paper)(({ theme }) => ({
    elevation: 24,
    marginTop: 10,
    padding: 3,
    borderRadius: 12,
    border: '2px solid transparent',
    background: 'linear-gradient(to right, #f0f4ff, #dce8ff)', // Màu xanh lam nhạt và dịu mắt
    color: theme.palette.text.primary,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', // Thêm hiệu ứng đổ bóng mềm mại
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, transparent 70%, rgba(173, 216, 230, 0.4) 100%)', // Hiệu ứng phủ nhẹ ở góc
      zIndex: -1,
    },
    '&:hover': {
      boxShadow: '0 6px 14px rgba(0, 0, 0, 0.2)', // Hiệu ứng đổ bóng khi hover
      transform: 'translateY(-2px)', // Hiệu ứng di chuyển nhẹ khi hover
      transition: 'all 0.3s ease',
    },
  }));
  

export const TitleTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '20px 0',
    padding: '5px',
    color: '#ffffff',
    background: 'linear-gradient(to right, rgb(84, 136, 178), rgb(27, 79, 122))',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    fontSize: '2rem',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
      opacity: 0.7,
      zIndex: 1,
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '10px',
      background: 'linear-gradient(to right, rgb(84, 136, 178), rgb(27, 79, 122))',
      filter: 'blur(5px)',
      zIndex: 0,
    },
  }));