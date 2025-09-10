import {call, put, takeLatest} from 'redux-saga/effects';
import {NetWorkService} from '@/app/library/networking';

// Action types
export const WEATHER_ACTIONS = {
  FETCH_WEATHER: 'weather/FETCH_WEATHER',
  FETCH_WEATHER_SUCCESS: 'weather/FETCH_WEATHER_SUCCESS',
  FETCH_WEATHER_ERROR: 'weather/FETCH_WEATHER_ERROR',
} as const;

// Action creators
export const fetchWeather = () => ({
  type: WEATHER_ACTIONS.FETCH_WEATHER,
});

export const fetchWeatherSuccess = (data: any) => ({
  type: WEATHER_ACTIONS.FETCH_WEATHER_SUCCESS,
  payload: data,
});

export const fetchWeatherError = (error: string) => ({
  type: WEATHER_ACTIONS.FETCH_WEATHER_ERROR,
  payload: error,
});

// Saga
function* fetchWeatherSaga(): Generator<any, void, any> {
  try {
    const response = yield call(NetWorkService.Get, {
      url: '/api/weather-reports/list',
    });

    if (Array.isArray(response.data)) {
      yield put(fetchWeatherSuccess(response.data));
    } else if (response?.data?.data) {
      yield put(fetchWeatherSuccess(response.data.data));
    } else {
      yield put(fetchWeatherSuccess([]));
    }
  } catch (error: any) {
    console.error('Error fetching weather:', error);
    yield put(
      fetchWeatherError(error.message || 'Failed to fetch weather data'),
    );
  }
}

// Root saga
export function* weatherSaga() {
  yield takeLatest(WEATHER_ACTIONS.FETCH_WEATHER, fetchWeatherSaga);
}
