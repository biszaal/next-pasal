import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
  Badge,
  Button,
  Menu,
  MenuItem,
  Box,
  LinearProgress,
  Divider,
  ListItem,
  List,
  Drawer,
  IconButton,
  ListItemText,
  Snackbar,
  InputBase,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import MuiAlert from "@material-ui/lab/Alert";
import useStyles from "../utils/styles";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { getError } from "../utils/error";
import axios from "axios";

const Layout = ({ title, description, children, isLoading }) => {
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const router = useRouter();

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      body1: {
        fontWeight: "normal",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#426aff",
      },
      secondary: {
        main: "#ff4081",
      },
    },
  });
  const classes = useStyles();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      setShowSnackbar(true);
      setErrorMessage(getError(err));
    }
  };

  const [query, setQuery] = useState("");
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect === "backdropClick") {
      router.push("/");
      return;
    }

    if (redirect) {
      router.push(redirect || "/");
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Pasal` : "Next Pasal"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar className={classes.toolbar}>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={showSnackbar}
              autoHideDuration={6000}
              onClose={() => {
                setErrorMessage("");
              }}
            >
              <MuiAlert
                variant="filled"
                onClose={() => {
                  setShowSnackbar(false);
                }}
                severity="error"
                sx={{ width: "100%" }}
              >
                {errorMessage}
              </MuiAlert>
            </Snackbar>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                className={classes.menuButton}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>Pasal</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div className={classes.searchSection}>
              <form onSubmit={submitHandler} className={classes.searchForm}>
                <InputBase
                  name="query"
                  className={classes.searchInput}
                  placeholder="Search products"
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </div>
            <div>
              <Switch checked={darkMode} onChange={darkModeChangeHandler} />
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      "Cart"
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, "/order-history")
                      }
                    >
                      Order History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/admin/dashboard")
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                    <Typography component="span">Login</Typography>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
          {isLoading && (
            <Box className={classes.fullWidth}>
              <LinearProgress color="primary" />
            </Box>
          )}
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Next Pasal.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
