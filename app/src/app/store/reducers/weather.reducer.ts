import {WEATHER_ACTIONS} from '../saga/weather.saga';
import {WeatherReport} from '@/app/features/Weather/types';

interface WeatherState {
  reports: WeatherReport[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  reports: [],
  loading: false,
  error: null,
};

export const weatherReducer = (
  state = initialState,
  action: any,
): WeatherState => {
  switch (action.type) {
    case WEATHER_ACTIONS.FETCH_WEATHER:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case WEATHER_ACTIONS.FETCH_WEATHER_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: action.payload,
      };

    case WEATHER_ACTIONS.FETCH_WEATHER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
