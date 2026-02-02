import { AccountType } from '@repo/database';

export const CORE_ACCOUNTS: {
  code: string;
  name: string;
  type: AccountType;
  details?: string;
}[] = [
  // 1xx - ASSETS
  {
    code: '111',
    name: 'Tiền mặt',
    type: AccountType.ASSET,
    details: 'Cash on hand',
  },
  {
    code: '112',
    name: 'Tiền gửi ngân hàng',
    type: AccountType.ASSET,
    details: 'Cash in bank',
  },
  {
    code: '131',
    name: 'Phải thu của khách hàng',
    type: AccountType.ASSET,
    details: 'Trade receivables',
  },
  {
    code: '133',
    name: 'Thuế GTGT được khấu trừ',
    type: AccountType.ASSET,
    details: 'Deductible VAT',
  },
  {
    code: '141',
    name: 'Tạm ứng',
    type: AccountType.ASSET,
    details: 'Advances',
  },
  {
    code: '152',
    name: 'Nguyên liệu, vật liệu',
    type: AccountType.ASSET,
    details: 'Raw materials',
  },
  {
    code: '153',
    name: 'Công cụ, dụng cụ',
    type: AccountType.ASSET,
    details: 'Tools and supplies',
  },
  {
    code: '156',
    name: 'Hàng hóa',
    type: AccountType.ASSET,
    details: 'Merchandise inventory',
  },

  // 2xx - LONG TERM ASSETS
  {
    code: '211',
    name: 'Tài sản cố định hữu hình',
    type: AccountType.ASSET,
    details: 'Tangible fixed assets',
  },
  {
    code: '214',
    name: 'Hao mòn tài sản cố định',
    type: AccountType.ASSET,
    details: 'Depreciation of fixed assets',
  },
  {
    code: '242',
    name: 'Chi phí trả trước',
    type: AccountType.ASSET,
    details: 'Prepaid expenses',
  },

  // 3xx - LIABILITIES
  {
    code: '331',
    name: 'Phải trả cho người bán',
    type: AccountType.LIABILITY,
    details: 'Trade payables',
  },
  {
    code: '333',
    name: 'Thuế và các khoản phải nộp Nhà nước',
    type: AccountType.LIABILITY,
    details: 'Taxes and other payables to the State',
  },
  {
    code: '334',
    name: 'Phải trả người lao động',
    type: AccountType.LIABILITY,
    details: 'Payables to employees',
  },

  // 4xx - EQUITY
  {
    code: '411',
    name: 'Vốn đầu tư của chủ sở hữu',
    type: AccountType.EQUITY,
    details: "Owner's invested capital",
  },
  {
    code: '421',
    name: 'Lợi nhuận sau thuế chưa phân phối',
    type: AccountType.EQUITY,
    details: 'Undistributed profit after tax',
  },

  // 5xx - REVENUE
  {
    code: '511',
    name: 'Doanh thu bán hàng và cung cấp dịch vụ',
    type: AccountType.REVENUE,
    details: 'Revenue from sale of goods and rendering of services',
  },

  // 6xx - EXPENSES
  {
    code: '632',
    name: 'Giá vốn hàng bán',
    type: AccountType.EXPENSE,
    details: 'Cost of goods sold',
  },
  {
    code: '635',
    name: 'Chi phí tài chính',
    type: AccountType.EXPENSE,
    details: 'Financial expenses',
  },
  {
    code: '641',
    name: 'Chi phí bán hàng',
    type: AccountType.EXPENSE,
    details: 'Selling expenses',
  },
  {
    code: '642',
    name: 'Chi phí quản lý doanh nghiệp',
    type: AccountType.EXPENSE,
    details: 'General administration expenses',
  },

  // 7xx - OTHER INCOME
  {
    code: '711',
    name: 'Thu nhập khác',
    type: AccountType.REVENUE,
    details: 'Other income',
  },

  // 8xx - OTHER EXPENSE
  {
    code: '811',
    name: 'Chi phí khác',
    type: AccountType.EXPENSE,
    details: 'Other expenses',
  },

  // 9xx - SUMMARY
  {
    code: '911',
    name: 'Xác định kết quả kinh doanh',
    type: AccountType.EQUITY,
    details: 'Determination of business results',
  },
];
