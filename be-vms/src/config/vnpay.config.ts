export const vnpayConfig = {
  // Sandbox environment
  sandbox: {
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_TmnCode: 'HL1TESTC',
    vnp_HashSecret: 'PE1T6V5NYW5JQJ1CI17HWR4TC991P9E6',
    vnp_ReturnUrl: 'https://billing-staging.sdhub.online/vnpay_return',
    vnp_Command: 'pay',
    vnp_Version: '2.1.0',
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_OrderType: 'other',
    vnp_timeout: 15,
    vnp_Api: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  },

  // Production environment
  production: {
    vnp_Url: 'https://pay.vnpay.vn/vpcpay.html',
    vnp_TmnCode: process.env.VNP_TMN_CODE || '',
    vnp_HashSecret: process.env.VNP_HASH_SECRET || '',
    vnp_ReturnUrl: process.env.VNP_RETURN_URL || '',
    vnp_Command: 'pay',
    vnp_Version: '2.1.0',
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_OrderType: 'other',
    vnp_timeout: 15,
    vnp_Api:
      process.env.VNP_API ||
      'https://api.vnpay.vn/merchant_webapi/api/transaction',
  },
};

// Get current environment config
export const getVnpayConfig = () => {
  return vnpayConfig.sandbox;
};

// VNPay response codes
export const vnpayResponseCodes = {
  '00': 'Giao dịch thành công',
};

// Bank codes for VNPay
export const vnpayBankCodes = {
  NCB: 'Ngân hàng NCB',
  SACOMBANK: 'Ngân hàng Sacombank',
  EXIMBANK: 'Ngân hàng Eximbank',
  MSBANK: 'Ngân hàng MSB',
  NAMABANK: 'Ngân hàng NamABank',
  VIETINBANK: 'Ngân hàng Vietinbank',
  VIETCOMBANK: 'Ngân hàng Vietcombank',
  HDBANK: 'Ngân hàng HDBank',
  AGRIBANK: 'Ngân hàng Agribank',
  TECHCOMBANK: 'Ngân hàng Techcombank',
  TPBANK: 'Ngân hàng TPBank',
  DONGABANK: 'Ngân hàng DongABank',
  SHB: 'Ngân hàng SHB',
  OJB: 'Ngân hàng OceanBank',
  BIDV: 'Ngân hàng BIDV',
  SCB: 'Ngân hàng SCB',
  VIB: 'Ngân hàng VIB',
  ACB: 'Ngân hàng ACB',
  OCB: 'Ngân hàng OCB',
  MB: 'Ngân hàng MB',
  TCB: 'Ngân hàng TCB',
  VPB: 'Ngân hàng VPB',
  STB: 'Ngân hàng STB',
  VRB: 'Ngân hàng VRB',
  VAB: 'Ngân hàng VAB',
  VNMART: 'Vi dien tu VnMart',
  VINID: 'Vi dien tu VINID',
  VIETTEL: 'Vi dien tu Viettel',
  ZALOPAY: 'Vi dien tu ZaloPay',
  MOMO: 'Vi dien tu MoMo',
  SHOPEEPAY: 'Vi dien tu ShopeePay',
};

export const VNPAY_CONFIG = {
  TIMEOUT_MINUTES: 15,
};

// Utility function to sort object keys
export const sortObject = (obj: Record<string, any>): Record<string, any> => {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key] = obj[key];
  }

  return sorted;
};
