import React from 'react';
import './App.css';

import useAxios from 'axios-hooks';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { CSVLink } from 'react-csv';

import BaseTable from 'react-base-table';
import 'react-base-table/styles.css';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      background: '#f7f7f7',
      margin: '0 auto',
      padding: '2rem',
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    tableRow: {
      padding: '30px',
    },

    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

function App() {
  const classes = useStyles();
  const [trelloKey, setTrelloKey] = React.useState(
    ''
    // INSERT default key
  );
  const [trelloToken, setTrelloToken] = React.useState(
    ''
    // INSERT default key
  );
  const [trelloListId, setTrelloListId] = React.useState(
    ''
    // INSERT default key
  );
  const [csvContent, setCsvContent] = React.useState([{ hello: 'test' }]);
  const getAxiosURL = (
    trelloListId: string,
    trelloKey: string,
    trelloToken: string
  ) =>
    `https://api.trello.com/1/lists/${trelloListId}/cards?key=${trelloKey}&token=${trelloToken}&attachments=true&comments=true`;
  const [axiosUrl, setAxiosUrl] = React.useState(
    getAxiosURL(trelloListId, trelloKey, trelloToken)
  );

  React.useEffect(() => {
    setAxiosUrl(getAxiosURL(trelloListId, trelloKey, trelloToken));
  }, [trelloToken, trelloListId, trelloKey]);

  const [{ data, loading, error }, refetch] = useAxios(axiosUrl);

  React.useEffect(() => {
    if (data && !loading && !error && data && data.length > 0) {
      const cardsFormatted = data.map(
        (card: {
          name: string;
          id: string;
          url: string;
          desc: string;
          labels: [{ name: string }];
          idMembers: [string];
          display: {};
          attachments: [{ url: string }];
        }) => {
          const labels = card?.labels
            .map((label: { name: string }) => `/label ` + label.name)
            .join('\n');
          return {
            title: card?.name,
            description:
              labels +
              `\n 
[Trello Ticket](${card?.url})
\n
### Labels:
  - ${card?.labels.map((label: { name: string }) => label.name).join('\n - ')}
            
### Description:
  ${card?.desc}

  ${
    card?.attachments?.length > 0
      ? `
### Attachments:
${card?.attachments.map(
  (attachment: { url: string }) => `![Image](${attachment?.url})`
)}
  `
      : ''
  }`,
          };
        }
      );
      setCsvContent(cardsFormatted);
    }
  }, [data, loading, error]);

  const columns = [
    {
      key: 'title',
      title: 'Title',
      dataKey: 'title',
      width: 400,
    },
    {
      key: 'description',
      title: 'Description',
      dataKey: 'description',
      width: 1000,
    },
  ];

  return (
    <div className={classes.root}>
      <Paper></Paper>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <TextField
            id='trelloBoardList'
            label='Trello ListID'
            variant='outlined'
            onChange={(event) => setTrelloListId(event.target.value)}
            value={trelloListId}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='trelloToken'
            label='Trello Token'
            variant='outlined'
            onChange={(event) => {
              setTrelloToken(event.target.value);
            }}
            value={trelloToken}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='trelloKey'
            label='Trello Key'
            variant='outlined'
            onChange={(event) => {
              setTrelloKey(event.target.value);
            }}
            value={trelloKey}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant='contained'
            color='primary'
            component={CSVLink}
            data={csvContent}
          >
            Download CSV - Gitlab Import
          </Button>
        </Grid>
      </Grid>
      {error ? (
        <>Error</>
      ) : loading ? (
        <>Loading...</>
      ) : data ? (
        <BaseTable
          fixed
          data={csvContent}
          width={1400}
          height={800}
          columns={columns}
        ></BaseTable>
      ) : (
        <>No data</>
      )}
    </div>
  );
}

export default App;
