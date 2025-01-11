import React, { useState, useEffect } from "react";
import "./Header.scss";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Icon hình ba thanh ngang
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import { useContext } from "react";
import userServices from "../services/userServices";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();


  const { isUserLogin, setIsUserLogin } = useContext(AppContext); // Lấy isUserLogin từ AppContext

  const [sidebarOpen, setSidebarOpen] = useState(false); // Quản lý trạng thái mở/đóng Sidebar
  const [userType, setUserType] = useState(-1); // Lấy userType từ localStorage
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // Quản lý trạng thái hiển thị dialog xác nhận
  const [isOpenAccountMenu, setIsOpenAccountMenu] = useState(false); // Quản lý trạng thái hiển thị menu tài khoản
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(parseInt(storedUserType));
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Đảo ngược trạng thái mở/đóng Sidebar
  };

  const handleLogout = () => {
    setOpenLogoutDialog(true); // Hiển thị dialog xác nhận trước khi đăng xuất
  };

  const confirmLogout = async () => {
    setUserType(-1); // Cập nhật userType về -1
    localStorage.removeItem("userType"); // Xóa userType khỏi localStorage
    setOpenLogoutDialog(false); // Đóng dialog
    // Đăng xuất
    try {
      await userServices.logout();
      setIsUserLogin(false);
      navigate("/");
    } catch (error) {
      console.error("Error while logging out", error);
    }
  };

  const cancelLogout = () => {
    setOpenLogoutDialog(false); // Đóng dialog mà không đăng xuất
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background:
            "linear-gradient(to right,rgb(84, 136, 178),rgb(27, 79, 122))",
          color: "rgb(219, 223, 227)",
        }}
      >
        <Toolbar>
          {/* Nút menu */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {userType === -1 || userType === 2
              ? "AIR TICKET SALES SYSTEM"
              : "AIR TICKET PURCHASE MANAGEMENT SYSTEM"}
          </Typography>
          <Box display="flex" alignItems="center">
            {isUserLogin ? (
              <IconButton
                color="inherit"
                className="account-btn"
                // onClick={() => setIsOpenAccountMenu(!isOpenAccountMenu)}
              >
                <Avatar></Avatar>
                <div className="user-services-modal">
                  <li className="account-service-item">
                    <Link to={"/"} className="account-service-link">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="account-service-icon"
                      >
                        <g>
                          <path
                            d="M15.7542 11.9999C16.9962 11.9999 18.003 13.0068 18.003 14.2488V14.8242C18.003 15.7185 17.6835 16.5833 17.1019 17.2627C15.5326 19.0962 13.1454 20.0011 10 20.0011C6.85414 20.0011 4.46812 19.0959 2.90182 17.2617C2.32206 16.5827 2.00354 15.7193 2.00354 14.8265V14.2488C2.00354 13.0068 3.0104 11.9999 4.25242 11.9999H15.7542ZM15.7542 13.4999H4.25242C3.83882 13.4999 3.50354 13.8352 3.50354 14.2488V14.8265C3.50354 15.3621 3.69465 15.8802 4.04251 16.2876C5.29582 17.7553 7.26169 18.5011 10 18.5011C12.7383 18.5011 14.7059 17.7552 15.9624 16.2873C16.3113 15.8797 16.503 15.3608 16.503 14.8242V14.2488C16.503 13.8352 16.1678 13.4999 15.7542 13.4999ZM10 0.00462341C12.7614 0.00462341 15 2.2432 15 5.00462C15 7.76605 12.7614 10.0046 10 10.0046C7.23857 10.0046 5 7.76605 5 5.00462C5 2.2432 7.23857 0.00462341 10 0.00462341ZM10 1.50462C8.067 1.50462 6.5 3.07163 6.5 5.00462C6.5 6.93762 8.067 8.50462 10 8.50462C11.933 8.50462 13.5 6.93762 13.5 5.00462C13.5 3.07163 11.933 1.50462 10 1.50462Z"
                            fill="#090D14"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_757_20663">
                            <rect width="20" height="20" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      Account
                    </Link>
                  </li>
                  <li className={"account-service-item"}>
                    <button
                      className={"account-service-link"}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        // setIsOpenLogoutPopup(true);
                        handleLogout();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={"account-service-icon"}
                      >
                        <path
                          d="M8.50215 11.5C9.05562 11.5 9.5043 11.9487 9.5043 12.5022C9.5043 13.0556 9.05562 13.5043 8.50215 13.5043C7.94868 13.5043 7.5 13.0556 7.5 12.5022C7.5 11.9487 7.94868 11.5 8.50215 11.5ZM12 4.35418V10.5L12.0005 11.005L19.442 11.004L17.7196 9.28026C17.4534 9.01395 17.4292 8.59728 17.6471 8.3037L17.7198 8.2196C17.9861 7.95338 18.4027 7.92924 18.6963 8.14715L18.7804 8.21978L21.777 11.2174C22.043 11.4835 22.0674 11.8997 21.85 12.1933L21.7775 12.2774L18.7809 15.2808C18.4884 15.5741 18.0135 15.5746 17.7203 15.282C17.4537 15.0161 17.429 14.5994 17.6465 14.3056L17.7191 14.2214L19.432 12.504L12.0005 12.505L12 19.25C12 19.7164 11.5788 20.0697 11.1196 19.9886L2.61955 18.4873C2.26121 18.424 2 18.1126 2 17.7487V5.75002C2 5.38271 2.26601 5.06945 2.62847 5.00993L11.1285 3.6141C11.5851 3.53911 12 3.89145 12 4.35418ZM10.5 5.23739L3.5 6.3869V17.1196L10.5 18.3559V5.23739ZM13 18.5013L13.7652 18.5015L13.867 18.4946C14.2335 18.4448 14.5158 18.1304 14.5152 17.7502L14.508 13.5H13V18.5013ZM13.002 10L13 8.72536V5.00001L13.7453 5.00002C14.1245 5.00002 14.4381 5.28154 14.4883 5.64713L14.4953 5.74878L14.502 10H13.002Z"
                          fill="#090D14"
                        ></path>
                      </svg>
                      Logout
                    </button>
                  </li>
                </div>
              </IconButton>
            ) : (
              <>
                <Link to="/login" style={{ marginRight: "8px" }}>
                  Login
                </Link>
                <Link to="/signup">Signup</Link>
              </>
            )}

            {/* {userType === -1 ? (
              <>
                <Link to="/login" style={{ marginRight: "8px" }}>
                  Login
                </Link>
                <Link to="/signup">Signup</Link>
              </>
            ) : (
              <IconButton color="inherit">
                <Avatar></Avatar>
              </IconButton>
            )} */}
            {/* {userType !== -1 && (
              <IconButton color="inherit" onClick={handleLogout}>
                <Link
                  to="/logout"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Logout
                </Link>
              </IconButton>
            )} */}
          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Dialog xác nhận đăng xuất */}
      <Dialog open={openLogoutDialog} onClose={cancelLogout}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="secondary">
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
