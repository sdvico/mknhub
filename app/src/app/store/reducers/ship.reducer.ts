import {SHIP_ACTIONS} from '../saga/ship.saga';
import {Ship} from '@/app/features/Tracking/types';

interface ShipState {
  ships: Ship[];
  loading: boolean;
  error: string | null;
}

const initialState: ShipState = {
  ships: [],
  loading: false,
  error: null,
};

export const shipReducer = (state = initialState, action: any): ShipState => {
  switch (action.type) {
    case SHIP_ACTIONS.FETCH_SHIPS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SHIP_ACTIONS.FETCH_SHIPS_SUCCESS:
      return {
        ...state,
        loading: false,
        ships: action.payload,
      };

    case SHIP_ACTIONS.FETCH_SHIPS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
