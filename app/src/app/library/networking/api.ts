// export type AppModeType = string;
// export const APP_MODE_URL = APP_URL.dev;

export const ApiConstants = {
  REFRESH_TOKEN: '',
  PRODUCT_FOLLOWS: '/api/follows',
  CAFE_PRICE: '/api/products/code/CAFE/stats',
  TIEU_PRICE: '/api/products/code/TIEU/stats',
  VANG_PRICE: '/api/products/code/VANG/stats',
  PVOIL_PRICE: '/api/products/code/PVOIL/stats',
  SAURIENG_PRICE: '/api/products/code/SAURIENG/stats',
  // COMMON_DATA: 'api/common',
  // COMMON_DATA_WASTER_PLASTIC: 'api/common2/get?action=waste_plastic_codes',
  // COMMON_DATA_ACTION: 'api/common2/get',
  // COMMON_DATA_ACTION_CODES: 'api/common2/get?action=codes',
  // SYNC_DATA: 'api/nkkt/sync/?id=2',
  // NEW_SYNC_DATA: 'api/nkkt_sync/sync',
  // INFO_USER: 'api/account/info',
  // REGISTER_DEVICE_TOKEN: '/api/account/register_pushtoken',
  // SYNC_DATA_TRANMISSION: 'api/common2/post',
  // COMMON2_POST: 'api/common2/post',
  // COMMON2_GET: 'api/common2/get',
  // CHECK_VERIFY_USER: 'api/common/?account_check_verify',
  // PORT_OUT_SUPPLY_DECLARE: 'api/mwt/addWastePortOut',
  // PORT_OUT_SUPPLY_DECLARE_UPDATE: '/api/mwt/updateWastePortOut',
  // PORT_OUT_SUPPLY_DECLARE_MWT_CONFIRM: '/api/mwt/MwtConfirmOut',
  // PORT_OUT_SUPPLY_DECLARE_PORT_CONFIRM: '/api/mwt/PortConfirmOut',
  // PORT_IN_WASTE_DECLARE: 'api/mwt/addWastePortIn',
  // PORT_IN_WASTE_DECLARE_UPDATE: '/api/mwt/updateWastePortIn',
  // PORT_IN_WASTE_DECLARE_CAPTAIN_CONFIRM: '/api/mwt/CaptainConfirmIn',
  // PORT_IN_WASTE_DECLARE_PORT_CONFIRM: '/api/mwt/PortConfirmIn',
};

export type AppModeType = 'dev' | 'prod' | 'staging' | undefined;
export const APP_MODE_URL = '';
