import amplitude from "amplitude-js";
import React from "react";
import {
  AppBar,
  Tabs,
  Tab,
  makeStyles,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  Link,
} from "@material-ui/core";
import { isIOS, isMobileSafari } from "react-device-detect";

import TabPanel from "./components/TabPanel";

import data from "./data.json";
type itemType = typeof data[0];

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    amplitude.getInstance().init("d10ee4fd973714f7f25f0b201eb88e28");
  }, []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();

    const url = event.currentTarget.href;

    amplitude
      .getInstance()
      .logEvent("link_clicked", { url, ...event.currentTarget.dataset });

    window.location.href = url;
  };

  function buildList(data: itemType[], filterCategory?: string) {
    return (
      <List>
        {data
          .filter(({ category }) => {
            if (category === "game" && (isIOS || isMobileSafari)) return false;
            if (!filterCategory) return true;
            return category === filterCategory;
          })
          .map((item, index) => [
            <Link
              href={item.homepage}
              underline="none"
              key={`item-${index}`}
              data-category={item.category}
              data-title={item.title}
              onClick={handleClick}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={item.title} src={item.icon} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={item.description || item.subtitle}
                />
              </ListItem>
            </Link>,
            <Divider variant="inset" component="li" key={`divider-${index}`} />,
          ])}
      </List>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="sticky"
        classes={{
          root: classes.appBar,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All" wrapped {...a11yProps(0)} />
          <Tab label="Social" wrapped {...a11yProps(1)} />
          <Tab label="Tool" wrapped {...a11yProps(2)} />
          {!isIOS && !isMobileSafari && (
            <Tab label="Game" wrapped {...a11yProps(3)} />
          )}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {buildList(data)}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {buildList(data, "social")}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {buildList(data, "tool")}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {buildList(data, "game")}
      </TabPanel>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    boxShadow: "unset",
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: `${theme.palette.primary.main}73`,
  },
  title: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
  },
  tabPanel: {
    padding: 0,
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default App;
