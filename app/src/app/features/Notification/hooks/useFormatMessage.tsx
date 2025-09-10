// Types
type MessageType =
  | 'MKN_WARNING_6H' // CẢNH BÁO nguy cơ mất kết nối 6h
  | 'MKN_OVER_6H' // THÔNG BÁO mất kết nối quá 6h
  | 'MKN_WARNING_10D' // CẢNH BÁO nguy cơ >10 ngày (từ ngày thứ 8)
  | 'MKN_OVER_10D' // THÔNG BÁO mất kết nối >10 ngày
  | 'GEO_WARNING_NEAR' // CẢNH BÁO nguy cơ vượt ranh giới (cách 1 hải lý)
  | 'GEO_OVER_BOUNDARY'; // THÔNG BÁO đã vượt ranh giới

type LatLng = {lat: number; lng: number};

type BuildMessageInput = {
  type: MessageType;
  vesselCode: string; // ví dụ "BV-99999-TS"
  firstLostAt?: Date; // thời điểm mất kết nối lần đầu (cho các case MKN)
  eventAt?: Date; // thời điểm phát sinh cảnh báo hiện tại
  location?: LatLng; // vị trí hiện tại (cho GEO_* hoặc cần map)
  phone?: string; // số ĐT NCC/chủ tàu để liên hệ
  nthLostWarning?: number; // số lần cảnh báo mất kết nối (để tùy biến logic 2h/5h/… nếu cần)
};

type MessageStatus = 'sent' | 'received' | 'seen' | 'submitted';

type BuiltMessage = {
  title: string;
  body: string;
  actions: Array<
    | {type: 'OPEN'; label: string} // “Xem”, mở chi tiết
    | {type: 'ACK'; label: string} // “Nhận thông tin”
    | {
        type: 'FORM';
        label: string;
        form: 'REPORT_6H' | 'REPORT_10D' | 'BOUNDARY_ACTION';
      }
    | {type: 'MAP'; label: string; location: LatLng}
    | {type: 'CALL'; label: string; phone: string}
  >;
  meta: {
    vesselCode: string;
    eventAt?: string; // ISO
    firstLostAt?: string; // ISO
    location?: LatLng;
    type: MessageType;
  };
  status: Record<MessageStatus, boolean>; // đã gửi/nhận/xem/khai báo
};

// Utils
const fmtTime = (d?: Date) =>
  d
    ? new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d)
    : '';

const msToHhMm = (ms: number) => {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h${m.toString().padStart(2, '0')}ph`;
};

function buildMessage(input: BuildMessageInput): BuiltMessage {
  const {type, vesselCode, firstLostAt, eventAt, location, phone} = input;

  const titleByType: Record<MessageType, string> = {
    MKN_WARNING_6H: 'CẢNH BÁO TÀU CÁ CÓ NGUY CƠ MẤT KẾT NỐI 6H TRÊN BIỂN',
    MKN_OVER_6H: 'THÔNG BÁO TÀU CÁ MẤT KẾT NỐI QUÁ 6H TRÊN BIỂN',
    MKN_WARNING_10D:
      'THÔNG BÁO NGUY CƠ TÀU CÁ MẤT KẾT NỐI QUÁ 10 NGÀY TRÊN BIỂN',
    MKN_OVER_10D: 'THÔNG BÁO TÀU CÁ MẤT KẾT NỐI QUÁ 10 NGÀY TRÊN BIỂN',
    GEO_WARNING_NEAR: 'CẢNH BÁO NGUY CƠ TÀU CÁ VƯỢT RANH GIỚI',
    GEO_OVER_BOUNDARY: 'THÔNG BÁO TÀU CÁ VƯỢT RANH GIỚI',
  };

  let body = '';
  const actions: BuiltMessage['actions'] = [
    {type: 'OPEN', label: 'Xem'},
    {type: 'ACK', label: 'Nhận thông tin'},
  ];

  const iso = (d?: Date) => d?.toISOString();

  switch (type) {
    case 'MKN_WARNING_6H': {
      // Theo yêu cầu: phát sau 5h kể từ mất kết nối hoặc 3h sau cảnh báo 2h hoặc 1h sau cảnh báo lần 2
      const firstLostStr = fmtTime(firstLostAt);
      body =
        `Tàu ${vesselCode} đã bị mất kết nối với hệ thống VMS từ lúc ${firstLostStr}. ` +
        `Đề nghị ông/bà liên hệ Nhà cung cấp, thuyền trưởng để khắc phục tín hiệu cho tới khi thiết bị VMS có kết nối trở lại.`;
      if (phone) actions.push({type: 'CALL', label: 'Gọi Nhà cung cấp', phone});
      break;
    }
    case 'MKN_OVER_6H': {
      const firstLostStr = fmtTime(firstLostAt);
      body =
        `Tàu ${vesselCode} đã bị mất kết nối với hệ thống VMS quá 06h trên biển từ lúc ${firstLostStr}. ` +
        `Đề nghị ông/bà báo cáo vị trí theo định kỳ 06h/lần và theo dõi khắc phục tín hiệu cho tới khi thiết bị VMS có kết nối trở lại.`;
      actions.push({type: 'FORM', label: 'Khai báo vị trí', form: 'REPORT_6H'});
      break;
    }
    case 'MKN_WARNING_10D': {
      // bắt đầu từ ngày thứ 8: hiển thị "Chỉ còn XXhYYph nữa …" đến mốc 10 ngày kể từ firstLostAt
      const now = eventAt ?? new Date();
      const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
      const deadline = firstLostAt
        ? new Date(firstLostAt.getTime() + tenDaysMs)
        : undefined;
      const remain = deadline && now ? deadline.getTime() - now.getTime() : 0;
      const remainStr = msToHhMm(remain);
      const firstLostStr = fmtTime(firstLostAt);
      body =
        `Tàu ${vesselCode} đã bị mất kết nối với hệ thống VMS từ lúc ${firstLostStr}. ` +
        `Chỉ còn ${remainStr} nữa để ông/bà đưa tàu về bờ để sửa chữa/ khắc phục tín hiệu.`;
      actions.push({
        type: 'FORM',
        label: 'Khai báo tình trạng',
        form: 'REPORT_10D',
      });
      break;
    }
    case 'MKN_OVER_10D': {
      const firstLostStr = fmtTime(firstLostAt);
      body =
        `Tàu ${vesselCode} đã bị mất kết nối với hệ thống VMS quá 10 ngày trên biển kể từ lúc ${firstLostStr}. ` +
        `Đề nghị ông/bà đưa tàu về bờ ngay để sửa chữa/ khắc phục tín hiệu.`;
      actions.push({
        type: 'FORM',
        label: 'Khai báo phương án',
        form: 'REPORT_10D',
      });
      break;
    }
    case 'GEO_WARNING_NEAR': {
      // Cách ranh giới < 1 hải lý
      const when = fmtTime(eventAt);
      const coord = location
        ? `vị trí: ${toDMS(location.lat, true)}${toDMS(location.lng, false)}`
        : 'vị trí: (chưa xác định)';
      body =
        `Tàu ${vesselCode} tại thời điểm ${when} có ${coord} thuộc khu vực cách ranh giới vùng biển được phép khai thác dưới 01 hải lý, ` +
        `Cục Thủy sản và Kiểm ngư kính đề nghị ông/bà theo dõi, cảnh báo thuyền trưởng không để tàu cá vượt ranh giới.`;
      if (location)
        actions.push({type: 'MAP', label: 'Xem trên bản đồ', location});
      break;
    }
    case 'GEO_OVER_BOUNDARY': {
      const when = fmtTime(eventAt);
      const coord = location
        ? `vị trí: ${toDMS(location.lat, true)}${toDMS(location.lng, false)}`
        : 'vị trí: (chưa xác định)';
      body =
        `Tàu ${vesselCode} đã vượt qua ranh giới vùng được phép khai thác thủy sản trên biển tại thời điểm ${when} có ${coord}, ` +
        `Cục Thủy sản và Kiểm ngư kính đề nghị ông/bà yêu cầu thuyền trưởng quay lại.`;
      if (location)
        actions.push({type: 'MAP', label: 'Xem trên bản đồ', location});
      actions.push({
        type: 'FORM',
        label: 'Khai báo hành động',
        form: 'BOUNDARY_ACTION',
      }); // đã liên hệ / đã quay đầu / chưa liên hệ...
      break;
    }
  }

  return {
    title: titleByType[type],
    body,
    actions,
    meta: {
      type,
      vesselCode,
      eventAt: iso(eventAt),
      firstLostAt: iso(firstLostAt),
      location,
    },
    status: {sent: true, received: false, seen: false, submitted: false},
  };
}

// Helper: convert decimal degrees to DMS like 06°10'12"N105°54'24"E
function toDMS(value: number, isLat: boolean): string {
  const dir = isLat ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  const degStr = String(deg).padStart(2, '0');
  const minStr = String(min).padStart(2, '0');
  const secStr = String(sec).padStart(2, '0');
  return isLat
    ? `${degStr}°${minStr}'${secStr}"${dir}`
    : `${degStr}°${minStr}'${secStr}"${dir}`;
}

// 1) Cảnh báo nguy cơ mất kết nối 6h
buildMessage({
  type: 'MKN_WARNING_6H',
  vesselCode: 'BV-99999-TS',
  firstLostAt: new Date('2025-02-10T07:30:00+07:00'),
  eventAt: new Date('2025-02-10T12:30:00+07:00'),
  phone: '1900 232 349',
});

// 2) Thông báo mất kết nối quá 6h + yêu cầu khai báo vị trí
buildMessage({
  type: 'MKN_OVER_6H',
  vesselCode: 'BV-99999-TS',
  firstLostAt: new Date('2025-02-10T07:30:00+07:00'),
  eventAt: new Date('2025-02-10T13:30:01+07:00'),
});

// 3) Nguy cơ quá 10 ngày (từ ngày thứ 8) – hiển thị thời gian còn lại tới mốc 10 ngày
buildMessage({
  type: 'MKN_WARNING_10D',
  vesselCode: 'BV-99999-TS',
  firstLostAt: new Date('2025-02-10T07:30:00+07:00'),
  eventAt: new Date('2025-02-18T11:15:00+07:00'),
});

// 4) Đã quá 10 ngày
buildMessage({
  type: 'MKN_OVER_10D',
  vesselCode: 'BV-99999-TS',
  firstLostAt: new Date('2025-02-10T07:30:00+07:00'),
  eventAt: new Date('2025-02-20T07:30:01+07:00'),
});

// 5) Nguy cơ vượt ranh giới (cách <1 hải lý)
buildMessage({
  type: 'GEO_WARNING_NEAR',
  vesselCode: 'BV-99999-TS',
  eventAt: new Date('2025-06-25T16:03:00+07:00'),
  location: {lat: 6.17, lng: 105.9067},
});

// 6) Đã vượt ranh giới (kèm form khai báo hành động)
buildMessage({
  type: 'GEO_OVER_BOUNDARY',
  vesselCode: 'BV-99999-TS',
  eventAt: new Date('2025-06-25T16:03:00+07:00'),
  location: {lat: 6.17, lng: 105.9067},
});
