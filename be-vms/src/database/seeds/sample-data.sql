-- =====================================================
-- SAMPLE DATA FOR DEVELOPMENT/TESTING
-- =====================================================
-- 
-- GROUP STRUCTURE:
-- 1. CORE (Trụ): Core System, Core Operations - Quản lý hệ thống cốt lõi
-- 2. ADMIN: Super Admin, System Admin, Business Admin - Quản trị viên
-- 3. AGENT: Field Agent, Support Agent, Sales Agent - Đại lý/Nhân viên
-- 4. REGULAR USERS: Ship Captains, Ship Owners, Crew Members, Regular Users - Người dùng thường
-- =====================================================

-- Clear existing data (if any)
DELETE FROM "NotificationDevices";
DELETE FROM "ShipNotificationLogs";
DELETE FROM "ShipNotifications";
DELETE FROM "GroupUsers";
DELETE FROM "Notifies";
DELETE FROM "UserLoginTokens";
DELETE FROM "UserPushTokens";
DELETE FROM "Ships";
DELETE FROM "Groups";
DELETE FROM "Users";

-- =====================================================
-- INSERT SAMPLE USERS
-- =====================================================
INSERT INTO "Users" ("id", "username", "password", "state", "fullname", "phone") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin', 'admin123', 1, 'Administrator', '+84901234567'),
('550e8400-e29b-41d4-a716-446655440002', 'manager1', 'manager123', 1, 'Nguyễn Văn Quản Lý', '+84901234568'),
('550e8400-e29b-41d4-a716-446655440003', 'operator1', 'operator123', 1, 'Trần Thị Vận Hành', '+84901234569'),
('550e8400-e29b-41d4-a716-446655440004', 'captain1', 'captain123', 1, 'Lê Văn Thuyền Trưởng', '+84901234570'),
('550e8400-e29b-41d4-a716-446655440005', 'owner1', 'owner123', 1, 'Phạm Văn Chủ Tàu', '+84901234571'),
('550e8400-e29b-41d4-a716-446655440006', 'owner2', 'owner123', 1, 'Hoàng Thị Chủ Tàu', '+84901234572'),
('550e8400-e29b-41d4-a716-446655440007', 'crew1', 'crew123', 1, 'Võ Văn Thủy Thủ', '+84901234573'),
('550e8400-e29b-41d4-a716-446655440008', 'crew2', 'crew123', 1, 'Đặng Thị Thủy Thủ', '+84901234574');

-- =====================================================
-- INSERT SAMPLE GROUPS
-- =====================================================
INSERT INTO "Groups" ("id", "name") VALUES
-- Core Groups (Trụ)
('650e8400-e29b-41d4-a716-446655440001', 'Core System'),
('650e8400-e29b-41d4-a716-446655440002', 'Core Operations'),

-- Admin Groups
('650e8400-e29b-41d4-a716-446655440003', 'Super Admin'),
('650e8400-e29b-41d4-a716-446655440004', 'System Admin'),
('650e8400-e29b-41d4-a716-446655440005', 'Business Admin'),

-- Agent Groups
('650e8400-e29b-41d4-a716-446655440006', 'Field Agent'),
('650e8400-e29b-41d4-a716-446655440007', 'Support Agent'),
('650e8400-e29b-41d4-a716-446655440008', 'Sales Agent'),

-- Regular User Groups
('650e8400-e29b-41d4-a716-446655440009', 'Ship Captains'),
('650e8400-e29b-41d4-a716-446655440010', 'Ship Owners'),
('650e8400-e29b-41d4-a716-446655440011', 'Crew Members'),
('650e8400-e29b-41d4-a716-446655440012', 'Regular Users');

-- =====================================================
-- INSERT SAMPLE SHIPS
-- =====================================================
INSERT INTO "Ships" (
    "id", "plate_number", "locationcode", "trackingid", "nkkt", 
    "ownercode", "captioncode", "businesscode", "business2code", 
    "business3code", "business4code", "licenseid", "length", 
    "congsuat", "state", "HoHieu", "CoHieu", "IMO", 
    "CangCaDangKyCode", "CangCaPhuCode", "TongTaiTrong", 
    "ChieuRongLonNhat", "MonNuoc", "SoThuyenVien", 
    "NgaySanXuat", "NgayHetHan", "DungTichHamCa", 
    "VanTocDanhBat", "VanTocHanhTrinh", "name"
) VALUES
(
    '750e8400-e29b-41d4-a716-446655440001',
    'VN-12345',
    'HCM',
    'TRK001',
    'NKKT001',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440004',
    'BUS001',
    'BUS002',
    'Business description 1',
    'Business description 2',
    'LIC001',
    45.5,
    500.0,
    1,
    'HH001',
    'CH001',
    'IMO1234567',
    'CCDK001',
    'CCP001',
    2000.0,
    12.5,
    3.2,
    8,
    '2020-01-15',
    '2030-01-15',
    150.0,
    12.0,
    10.0,
    'Tàu Cá HCM-001'
),
(
    '750e8400-e29b-41d4-a716-446655440002',
    'VN-67890',
    'DN',
    'TRK002',
    'NKKT002',
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440004',
    'BUS003',
    'BUS004',
    'Business description 3',
    'Business description 4',
    'LIC002',
    38.0,
    400.0,
    1,
    'HH002',
    'CH002',
    'IMO2345678',
    'CCDK002',
    'CCP002',
    1800.0,
    11.0,
    2.8,
    6,
    '2021-03-20',
    '2031-03-20',
    120.0,
    11.0,
    9.5,
    'Tàu Cá ĐN-001'
),
(
    '750e8400-e29b-41d4-a716-446655440003',
    'VN-11111',
    'HP',
    'TRK003',
    'NKKT003',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440004',
    'BUS005',
    'BUS006',
    'Business description 5',
    'Business description 6',
    'LIC003',
    52.0,
    600.0,
    1,
    'HH003',
    'CH003',
    'IMO3456789',
    'CCDK003',
    'CCP003',
    2500.0,
    14.0,
    3.5,
    10,
    '2019-06-10',
    '2029-06-10',
    200.0,
    13.0,
    11.0,
    'Tàu Cá HP-001'
);

-- =====================================================
-- INSERT SAMPLE GROUP USERS
-- =====================================================
INSERT INTO "GroupUsers" ("id", "userid", "groupid") VALUES
-- Core System Users (Trụ)
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'), -- admin -> Core System
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002'), -- manager1 -> Core Operations

-- Admin Users
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003'), -- admin -> Super Admin
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004'), -- manager1 -> System Admin
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440005'), -- operator1 -> Business Admin

-- Agent Users
('850e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440006'), -- operator1 -> Field Agent
('850e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440007'), -- captain1 -> Support Agent
('850e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440008'), -- owner1 -> Sales Agent

-- Regular User Groups
('850e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440009'), -- captain1 -> Ship Captains
('850e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440010'), -- owner1 -> Ship Owners
('850e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440010'), -- owner2 -> Ship Owners
('850e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440011'), -- crew1 -> Crew Members
('850e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440011'), -- crew2 -> Crew Members

-- Additional Regular Users
('850e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440012'), -- owner1 -> Regular Users
('850e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440012'); -- owner2 -> Regular Users

-- =====================================================
-- INSERT SAMPLE USER PUSH TOKENS
-- =====================================================
INSERT INTO "UserPushTokens" ("id", "userid", "device_os", "push_token", "registered_date", "app_ver", "module") VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Android', 'fcm_token_admin_001', '2024-01-01 08:00:00', '1.0.0', 'admin'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'iOS', 'apns_token_manager_001', '2024-01-01 08:00:00', '1.0.0', 'manager'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Android', 'fcm_token_operator_001', '2024-01-01 08:00:00', '1.0.0', 'operator'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Android', 'fcm_token_captain_001', '2024-01-01 08:00:00', '1.0.0', 'captain'),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'iOS', 'apns_token_owner_001', '2024-01-01 08:00:00', '1.0.0', 'owner');

-- =====================================================
-- INSERT SAMPLE NOTIFICATIONS
-- =====================================================
INSERT INTO "Notifies" (
    "id", "plateNumber", "user", "title", "content", "type", 
    "created_at", "create_by", "update_at", "update_by", "status", "stype", "data"
) VALUES
(
    'A50e8400-e29b-41d4-a716-446655440001',
    'VN-12345',
    '550e8400-e29b-41d4-a716-446655440005',
    'Cảnh báo mất kết nối',
    'Tàu VN-12345 mất kết nối GPS trong 5 giờ qua',
    'warning',
    '2024-01-01 10:00:00',
    '550e8400-e29b-41d4-a716-446655440001',
    '2024-01-01 10:00:00',
    '550e8400-e29b-41d4-a716-446655440001',
    1,
    'connection_loss',
    '{"shipId": "750e8400-e29b-41d4-a716-446655440001", "duration": "5h"}'
),
(
    'A50e8400-e29b-41d4-a716-446655440002',
    'VN-67890',
    '550e8400-e29b-41d4-a716-446655440006',
    'Thông báo cập nhật vị trí',
    'Tàu VN-67890 đã cập nhật vị trí mới',
    'info',
    '2024-01-01 11:00:00',
    '550e8400-e29b-41d4-a716-446655440001',
    '2024-01-01 11:00:00',
    '550e8400-e29b-41d4-a716-446655440001',
    1,
    'location_update',
    '{"shipId": "750e8400-e29b-41d4-a716-446655440002", "lat": 10.762622, "lng": 106.660172}'
);

-- =====================================================
-- INSERT SAMPLE SHIP NOTIFICATIONS
-- =====================================================
INSERT INTO "ShipNotifications" (
    "id", "clientReq", "requestId", "ship_code", "occurred_at", "content", 
    "owner_name", "owner_phone", "type", "status", "created_at", "updated_at"
) VALUES
(
    'B50e8400-e29b-41d4-a716-446655440001',
    'clt_7b3c9d22a1',
    'srv_a82fd91f4b',
    'VN-12345',
    '2024-01-01 05:30:00',
    'Tàu VN-12345 mất kết nối 5 giờ. Vui lòng kiểm tra.',
    'Phạm Văn Chủ Tàu',
    '+84901234571',
    'MKN_5H',
    'QUEUED',
    '2024-01-01 06:00:00',
    '2024-01-01 06:00:00'
),
(
    'B50e8400-e29b-41d4-a716-446655440002',
    'clt_8c4d0e33b2',
    'srv_b93ge02g5c',
    'VN-67890',
    '2024-01-01 06:45:00',
    'Tàu VN-67890 mất kết nối 6 giờ. Cần kiểm tra khẩn cấp.',
    'Hoàng Thị Chủ Tàu',
    '+84901234572',
    'MKN_6H',
    'SENT',
    '2024-01-01 07:00:00',
    '2024-01-01 07:00:00'
);

-- =====================================================
-- INSERT SAMPLE NOTIFICATION DEVICES (Linking Notifies with UserPushTokens)
-- =====================================================
INSERT INTO "NotificationDevices" ("notificationId", "deviceId") VALUES
('A50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440005'),
('A50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440005');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Check Users
SELECT 'Users' as TableName, COUNT(*) as Count FROM "Users"
UNION ALL
-- Check Groups  
SELECT 'Groups' as TableName, COUNT(*) as Count FROM "Groups"
UNION ALL
-- Check Ships
SELECT 'Ships' as TableName, COUNT(*) as Count FROM "Ships"
UNION ALL
-- Check GroupUsers
SELECT 'GroupUsers' as TableName, COUNT(*) as Count FROM "GroupUsers"
UNION ALL
-- Check UserPushTokens
SELECT 'UserPushTokens' as TableName, COUNT(*) as Count FROM "UserPushTokens"
UNION ALL
-- Check Notifies
SELECT 'Notifies' as TableName, COUNT(*) as Count FROM "Notifies"
UNION ALL
-- Check ShipNotifications
SELECT 'ShipNotifications' as TableName, COUNT(*) as Count FROM "ShipNotifications"
UNION ALL
-- Check NotificationDevices
SELECT 'NotificationDevices' as TableName, COUNT(*) as Count FROM "NotificationDevices";

-- Show sample data
SELECT '=== SAMPLE USERS ===' as Info;
SELECT id, username, fullname, phone, state FROM "Users" LIMIT 5;

SELECT '=== SAMPLE GROUPS BY CATEGORY ===' as Info;
SELECT 
  CASE 
    WHEN id IN ('650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002') THEN 'CORE (Trụ)'
    WHEN id IN ('650e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005') THEN 'ADMIN'
    WHEN id IN ('650e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440008') THEN 'AGENT'
    ELSE 'REGULAR USERS'
  END as Category,
  id, name 
FROM "Groups" 
ORDER BY Category, name;

SELECT '=== SAMPLE SHIPS ===' as Info;
SELECT id, plate_number, name, length, congsuat FROM "Ships";

SELECT '=== SAMPLE GROUP USERS BY CATEGORY ===' as Info;
SELECT 
  CASE 
    WHEN g.id IN ('650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002') THEN 'CORE (Trụ)'
    WHEN g.id IN ('650e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440005') THEN 'ADMIN'
    WHEN g.id IN ('650e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440008') THEN 'AGENT'
    ELSE 'REGULAR USERS'
  END as Category,
  u.username, g.name as group_name 
FROM "GroupUsers" gu 
JOIN "Users" u ON gu.userid = u.id 
JOIN "Groups" g ON gu.groupid = g.id 
ORDER BY Category, u.username, g.name;
