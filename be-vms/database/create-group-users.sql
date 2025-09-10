-- Tạo bảng GroupUsers để liên kết Users với Groups
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupUsers')
BEGIN
    CREATE TABLE GroupUsers (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        userid UNIQUEIDENTIFIER NOT NULL,
        groupid UNIQUEIDENTIFIER NOT NULL,
        CONSTRAINT FK_GroupUsers_Users FOREIGN KEY (userid) REFERENCES Users(id) ON DELETE CASCADE,
        CONSTRAINT FK_GroupUsers_Groups FOREIGN KEY (groupid) REFERENCES Groups(id) ON DELETE CASCADE
    );
END
GO

-- Tạo index để tối ưu performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_GroupUsers_UserId')
BEGIN
    CREATE INDEX IX_GroupUsers_UserId ON GroupUsers(userid);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_GroupUsers_GroupId')
BEGIN
    CREATE INDEX IX_GroupUsers_GroupId ON GroupUsers(groupid);
END
GO

-- Thêm một số groups mẫu
IF NOT EXISTS (SELECT * FROM Groups WHERE name = 'admin')
BEGIN
    INSERT INTO Groups (id, name) VALUES (NEWID(), 'admin');
END
GO

IF NOT EXISTS (SELECT * FROM Groups WHERE name = 'manager')
BEGIN
    INSERT INTO Groups (id, name) VALUES (NEWID(), 'manager');
END
GO

IF NOT EXISTS (SELECT * FROM Groups WHERE name = 'user')
BEGIN
    INSERT INTO Groups (id, name) VALUES (NEWID(), 'user');
END
GO
