import { NowRequest, NowResponse } from '@now/node'
import { API } from '@the-orange-alliance/api';
import moment from 'moment';
import { getScreenshot } from '../lib/chromium'

const api = new API(process.env.API_KEY, 'Open Graph Generator');

export default async (req: NowRequest, res: NowResponse) => {
  const err404 = () => res.status(404).send(null);
  const key = req.query.key.toString();

  const data = {
    name: null,
    description: null
  };

  if (!isNaN(Number(key))) {
    // Team
    const team = await api.getTeam(key).catch(() => null);
    if (!team) return err404();
    data.name = team.teamNameShort ? `#${team.teamNumber} ${team.teamNameShort}` : `Team #${team.teamNumber}`;
    data.description = `${team.city}, ${team.stateProv ? team.stateProv + ', ' : ''}${team.country}`;
  } else if (key.split('-').length === 3) {
    // Event
    const event = await api.getEvent(key).catch(() => null);
    if (!event) return err404();
    const startDate = moment(event.startDate).format('MMM D');
    const endDate = moment(event.endDate).format('MMM D YYYY');
    const date = event.startDate !== event.endDate ? `${startDate} to ${endDate}` : endDate;
    const location = `${event.city}, ${event.stateProv ? event.stateProv + ', ' : ''}${event.country}`;
    data.name = event.eventName;
    data.description = date + '<br/>' + location;
  } else {
    return err404();
  }

  const html = `
    <head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
      <style>
        * {
          margin: 0;
        }
        body {
          height: 100vh;
          background: black;
          padding: 130px;
          font-family: 'Roboto', sans-serif;
        }
        .logo {
          font-weight: 500;
          background: rgba(255, 255, 255, 0.9);
          color: black;
          font-size: 30px;
          padding: 8px 24px;
          border-radius: 100px;
          max-width: max-content;
        }
        .name {
          margin-top: 100px;
          font-size: 70px;
          font-weight: 700;
          text-overflow: ellipsis; 
          overflow: hidden; 
          white-space: nowrap;
          color: white;
        }
        .description {
          font-size: 40px;
          font-weight: 400;
          margin-top: 15px;
          color: white;
        }
      </style>
    </head>
    <body>
      <main>
        <p class="logo">The Orange Alliance</p>
        <h1 class="name">${data.name}</h1>
        <h2 class="description">${data.description}</h2>
      </main>
    </body>`;

  const screenshot = await getScreenshot(html, process.env.NODE_ENV === 'development');
  res.setHeader('content-type', 'image/png');
  res.setHeader('content-disposition', `inline; filename="toa-image.png"`);
  res.setHeader('cache-control', 's-maxage=259200'); // 3 days
  res.send(screenshot)
}