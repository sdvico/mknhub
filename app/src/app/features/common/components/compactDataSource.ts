import compactData from './compactData';
import compactUrl from './compactUrl';

function compactDataSource(dataSource, params): { apiUrl: string; apiParams?: Record<string, unknown> } {
  if (!dataSource) {
    return {
      apiUrl: undefined,
      apiParams: {},
    };
  }

  const urlParams = compactData(dataSource.urlParams ?? { id: ':id' }, params, dataSource.apiRules);

  const apiParams = compactData(dataSource.apiParams, params, dataSource.apiRules);

  return {
    apiUrl: compactUrl(dataSource.apiUrl, urlParams),
    apiParams,
  };
}

export default compactDataSource;
