export interface PdfToHtmlOptions {
  embedImages: boolean;
  responsiveCss: boolean;
  minify: boolean;
}

export interface ConversionResult {
  html: string;
  pageCount: number;
}

function buildHtmlShell(responsive: boolean): string {
  const css = responsive
    ? `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .pdf-page {
      background: white;
      margin: 20px auto;
      padding: 40px;
      max-width: 900px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }
    .pdf-text-item {
      position: absolute;
      white-space: pre;
      transform-origin: left bottom;
    }
    .pdf-image { position: absolute; }
    @media (max-width: 960px) {
      .pdf-page { margin: 10px; padding: 20px; }
      .pdf-text-item { font-size: clamp(8px, 1.5vw, 14px) !important; }
    }
  `
    : `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .pdf-page {
      background: white;
      margin: 20px auto;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .pdf-text-item { position: absolute; white-space: pre; transform-origin: left bottom; }
    .pdf-image { position: absolute; }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Converted PDF</title>
<style>${css}</style>
</head>
<body>
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function minifyHtml(html: string): string {
  return html
    .replace(/\n\s+/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><");
}

export async function convertPdfToHtml(
  pdfBuffer: Buffer,
  options: PdfToHtmlOptions
): Promise<ConversionResult> {
  // Dynamic import — must disable the worker for Node.js server-side execution
  const pdfjsLib = await import("pdfjs-dist");

  // In Node.js there is no browser Worker; setting workerSrc to empty string
  // forces pdfjs to run in main-thread mode (no worker spawned)
  pdfjsLib.GlobalWorkerOptions.workerSrc = "";

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer),
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  let html = buildHtmlShell(options.responsiveCss);

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const textContent = await page.getTextContent();

    const pageWidth = Math.round(viewport.width);
    const pageHeight = Math.round(viewport.height);

    html += `<div class="pdf-page" style="width:${pageWidth}px;height:${pageHeight}px;" data-page="${pageNum}">\n`;

    // Render text items with position
    for (const item of textContent.items) {
      if (!("str" in item) || !item.str.trim()) continue;

      const tx = pdfjsLib.Util?.transform
        ? pdfjsLib.Util.transform(viewport.transform, item.transform)
        : item.transform;

      const [a, b, c, d, e, f] = tx;
      const angle = Math.atan2(b, a);
      const fontSize = Math.sqrt(a * a + b * b);
      const x = e;
      const y = pageHeight - f;

      const style = [
        `left:${x.toFixed(1)}px`,
        `top:${y.toFixed(1)}px`,
        `font-size:${fontSize.toFixed(1)}px`,
        angle !== 0 ? `transform:rotate(${(-angle * 180) / Math.PI}deg)` : "",
      ]
        .filter(Boolean)
        .join(";");

      html += `<span class="pdf-text-item" style="${style}">${escapeHtml(item.str)}</span>\n`;
    }

    // Optionally embed images
    if (options.embedImages) {
      const operatorList = await page.getOperatorList();
      // Image extraction is complex — placeholder for now
      // In production: iterate operatorList for OPS.paintImageXObject entries
    }

    html += `</div>\n`;
  }

  html += `</body>\n</html>`;

  const finalHtml = options.minify ? minifyHtml(html) : html;
  return { html: finalHtml, pageCount: pdf.numPages };
}
