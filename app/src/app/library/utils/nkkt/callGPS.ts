import { dispatch } from '../../../common';
import { callGetLocationNKKT } from '../../../features/logbook/CallAPINKKT';
import { SET_TRIP_GPS } from '../../../features/logbook/redux/constants';

const callGPS = ({ isStart }: { isStart: boolean }): (() => void) | void => {
  // Interval ID to keep track of the setInterval
  let intervalId: NodeJS.Timeout | null = null;

  if (isStart) {
    // Start the interval if isStart is true
    intervalId = setInterval(async () => {
      const res = await callGetLocationNKKT();

      dispatch({
        type: SET_TRIP_GPS,
        payload: {
          lat: res.lat,
          lng: res.lng,
          time: res.time,
          source_gps: res.source_gps,
        },
      });
    }, 3 * 60 * 60 * 1000); // 3 hours in milliseconds

    // Return a cleanup function to clear the interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  } else {
    // Clear the interval if isStart is false
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
};

export default callGPS;
