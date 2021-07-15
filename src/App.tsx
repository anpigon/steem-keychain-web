import React from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  makeStyles,
  Typography,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Divider,
  Toolbar,
  Link,
} from '@material-ui/core';

import data from './data.json';
import TabPanel from './components/TabPanel';

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <Typography variant='h6' className={classes.title}>
            Dapp Station
          </Typography>
        </Toolbar>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          variant='fullWidth'
        >
          <Tab label='All' wrapped {...a11yProps(0)} />
          <Tab label='Social' wrapped {...a11yProps(1)} />
          <Tab label='Tool' wrapped {...a11yProps(2)} />
          <Tab label='Game' wrapped {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {buildList(data)}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {buildList(data, 'social')}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {buildList(data, 'tool')}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {buildList(data, 'game')}
      </TabPanel>
    </div>
  );
}

type itemType = typeof data[0];

function buildList(data: itemType[], filterCategory?: string) {
  return (
    <List>
      {data
        .filter(({ category }) => {
          if (!filterCategory) return true;
          return category === filterCategory;
        })
        .map(buildListItem)}
    </List>
  );
}

function buildListItem(item: itemType, index: number) {
  return [
    <Link
      href={item.homepage}
      underline='none'
      key={`item-${index}`}
      data-category={item.category}
      data-title={item.title}
    >
      <ListItem alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar alt={item.title} src={item.icon} />
        </ListItemAvatar>
        <ListItemText
          primary={item.title}
          secondary={item.description || item.subtitle}
        />
      </ListItem>
    </Link>,
    <Divider variant='inset' component='li' key={`divider-${index}`} />,
  ];
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    flexGrow: 1,
  },
  tabPanel: {
    padding: 0,
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default App;
