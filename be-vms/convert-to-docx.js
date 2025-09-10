const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} = require('docx');

async function convertMarkdownToDocx() {
  try {
    // Đọc file Markdown
    const markdownContent = fs.readFileSync(
      path.join(__dirname, 'src/notifications/API_SHIP_NOTIFICATION.md'),
      'utf8',
    );

    // Tạo document mới với cấu trúc đúng
    const children = [];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    // Xử lý từng dòng Markdown
    const lines = markdownContent.split('\n');
    let currentTable = null;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('# ')) {
        // H1 heading
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(2),
                bold: true,
                size: 32,
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),
        );
      } else if (line.startsWith('## ')) {
        // H2 heading
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(3),
                bold: true,
                size: 28,
              }),
            ],
            spacing: { before: 300, after: 150 },
          }),
        );
      } else if (line.startsWith('### ')) {
        // H3 heading
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(4),
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
        );
      } else if (line.startsWith('|') && line.endsWith('|')) {
        // Table row
        const cells = line
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim());

        if (!currentTable) {
          // Bắt đầu table mới
          tableRows = [];
        }

        // Thêm row vào tableRows
        const tableRow = new TableRow({
          children: cells.map(
            (cell) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: cell })],
                  }),
                ],
              }),
          ),
        });

        tableRows.push(tableRow);
        currentTable = true;
      } else if (line === '' && currentTable && tableRows.length > 0) {
        // Kết thúc table, tạo table với tất cả rows
        if (tableRows.length > 0) {
          const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          });
          children.push(table);
        }
        currentTable = null;
        tableRows = [];
      } else if (line.startsWith('```')) {
        // Code block
        if (line === '```json' || line === '```bash') {
          // Start of code block
          const codeLines = [];
          i++;
          while (i < lines.length && !lines[i].startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
          }

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: codeLines.join('\n'),
                  font: 'Courier New',
                  size: 20,
                }),
              ],
              spacing: { before: 100, after: 100 },
            }),
          );
        }
      } else if (line.startsWith('- ')) {
        // List item
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line.substring(2) })],
            spacing: { before: 50, after: 50 },
          }),
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Bold text
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(2, line.length - 2),
                bold: true,
              }),
            ],
            spacing: { before: 100, after: 100 },
          }),
        );
      } else if (line.includes('`')) {
        // Inline code
        const parts = line.split('`');
        const paragraphChildren = [];
        for (let j = 0; j < parts.length; j++) {
          if (j % 2 === 1) {
            // Code part
            paragraphChildren.push(
              new TextRun({
                text: parts[j],
                font: 'Courier New',
                size: 20,
              }),
            );
          } else if (parts[j].trim()) {
            // Regular text
            paragraphChildren.push(new TextRun({ text: parts[j] }));
          }
        }

        if (paragraphChildren.length > 0) {
          children.push(
            new Paragraph({
              children: paragraphChildren,
              spacing: { before: 100, after: 100 },
            }),
          );
        }
      } else if (line.trim() && !line.startsWith('```')) {
        // Regular paragraph
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line })],
            spacing: { before: 100, after: 100 },
          }),
        );
      }
    }

    // Xử lý table cuối cùng nếu còn
    if (currentTable && tableRows.length > 0) {
      const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      });
      children.push(table);
    }

    // Tạo file .docx
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, 'API_SHIP_NOTIFICATION.docx');

    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Đã tạo file Word thành công: ${outputPath}`);
  } catch (error) {
    console.error('❌ Lỗi khi chuyển đổi:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Chạy script
convertMarkdownToDocx();
