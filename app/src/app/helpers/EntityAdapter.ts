/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RequestEntityAdapter<E, T> {
  draft: T | any;
  entities: E | any;
  oldState: T | any;
  data?: any;
}

const EntityAdapter = {
  updateAllEntity: <E, T>(input: RequestEntityAdapter<E, T>): void => {
    const { draft, entities, oldState } = input;

    if (!oldState.entity) {
      // default entity = object
      draft.entity = {};
    }

    for (const key of Object.keys(entities)) {
      //set key scheme entity
      if (!oldState.entity) {
        draft.entity[key] = entities[key] || {};
      }
      //set default key scheme id
      if (oldState.entity && !Object.prototype.hasOwnProperty.call(oldState.entity, key)) {
        draft.entity[key] = {};
      }
      //for key scheme id and update data
      if (typeof entities[key] === 'object') {
        for (const id of Object.keys(entities[key])) {
          if (!oldState.entity[key]?.[id]) {
            draft.entity[key][id] = entities[key][id];
          } else {
            draft.entity[key][id] = {
              ...oldState[key]?.[id],
              ...entities[key][id],
            };
          }
        }
      }
    }
  },

  updatePartial: <E, T>(input: RequestEntityAdapter<E, T>): void => {
    const { draft, entities, oldState, data } = input;
    for (const key of Object.keys(entities)) {
      Object.keys(entities[key]).forEach(id => {
        if (oldState.entity[key] && oldState.entity[key][id]) {
          draft.entity[key][id] = { ...oldState.entity[key][id], ...data };
        }
      });
    }
  },
  patchEntity: <E, T>(input: RequestEntityAdapter<E, T>): void => {
    const { draft, entities, oldState } = input;
    for (const key of Object.keys(entities)) {
      Object.keys(entities[key]).forEach(id => {
        if (oldState.entity[key] && oldState.entity[key][id]) {
          draft.entity[key][id] = {
            ...oldState.entity[key][id],
            ...entities[key][id],
          };
        }
      });
    }
  },
  resetAll: <E, T>(input: RequestEntityAdapter<E, T>): void => {
    const { draft, entities } = input;

    for (const key of Object.keys(entities)) {
      draft.entity[key] = entities[key];
    }
  },
  removeEntities: <E, T>(input: RequestEntityAdapter<E, T>): void => {
    const { draft, entities, oldState } = input;
    Object.keys(entities).forEach(entityKey => {
      entities[entityKey].forEach((id: string | number) => {
        if (oldState.entity[entityKey] && oldState.entity[entityKey][id]) {
          delete draft.entity[entityKey][id];
        }
      });
    });
  },
  removeEntity: <E, T>(_input: RequestEntityAdapter<E, T>): void => {
    // Object.keys(entities).forEach((entityKey) => {
    //   entities[entityKey].forEach((id: string | number) => {
    //     if (oldState[entityKey] && oldState[entityKey][id]) {
    //       delete draft[entityKey][id];
    //     }
    //   });
    // });
  },
};

export default EntityAdapter;
