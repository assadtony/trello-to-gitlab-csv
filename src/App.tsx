import React from 'react';
import './App.css';

import useAxios from 'axios-hooks';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { CSVLink } from 'react-csv';

import BaseTable from 'react-base-table';
import 'react-base-table/styles.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      background: '#f7f7f7',
      margin: '0 auto',
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
  })
);

function App() {
  const yourKey = '8b93c6f80433709bdb8794371e12a9dd';
  const yourToken =
    'e49624b81a3d22b9d781522329083f9317c68c24df111c96baa476dbfe152af6';
  const listId = '5f7cd582866fc824a3567929'; //'5f0769140dda3a773278de65';
  const [csvContent, setCsvContent] = React.useState([{ hello: 'test' }]);
  const [{ data, loading, error }, refetch] = useAxios(
    `https://api.trello.com/1/lists/${listId}/cards?key=${yourKey}&token=${yourToken}&attachments=true&comments=true`
  );

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

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
    <>
      <CSVLink data={csvContent}>Download me</CSVLink>;
      <BaseTable
        fixed
        data={csvContent}
        width={1400}
        height={800}
        columns={columns}
      ></BaseTable>
    </>
  );
}

export default App;
