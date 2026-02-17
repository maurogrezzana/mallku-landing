import puppeteer from 'puppeteer';
import { posts } from './src/data/posts.ts';
import fs from 'fs';
import path from 'path';

const outputDir = './pdfs/blogs';

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Función para generar HTML del blog
function generateBlogHTML(post) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.titulo}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: #2c2c2c;
      padding: 60px 80px;
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 50px;
      border-bottom: 3px solid #c85a3f;
      padding-bottom: 30px;
    }

    h1 {
      font-size: 36px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 20px;
      line-height: 1.3;
    }

    .meta {
      display: flex;
      gap: 20px;
      font-size: 14px;
      color: #666;
      margin-top: 15px;
    }

    .meta span {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .categoria {
      background: #c85a3f;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 600;
    }

    .excerpt {
      font-size: 18px;
      font-style: italic;
      color: #555;
      margin-bottom: 40px;
      padding: 20px;
      background: #f9f9f9;
      border-left: 4px solid #c85a3f;
    }

    .content p {
      margin-bottom: 25px;
      text-align: justify;
      font-size: 16px;
    }

    footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 14px;
    }

    .logo {
      font-family: 'Arial', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #c85a3f;
      margin-bottom: 10px;
    }

    @media print {
      body {
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>${post.titulo}</h1>
    <div class="meta">
      <span class="categoria">${post.categoria}</span>
      <span>📅 ${new Date(post.fecha).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      <span>⏱️ ${post.tiempoLectura}</span>
      <span>✍️ ${post.autor}</span>
    </div>
  </header>

  <div class="excerpt">
    ${post.excerpt}
  </div>

  <div class="content">
    ${post.contenido.map(p => `<p>${p}</p>`).join('\n    ')}
  </div>

  <footer>
    <div class="logo">MALLKU</div>
    <p>Excursiones arqueológicas en el Noroeste Argentino</p>
    <p>www.mallku.com.ar</p>
  </footer>
</body>
</html>
  `;
}

// Generar PDFs
async function generatePDFs() {
  console.log('🚀 Iniciando generación de PDFs...\n');

  const browser = await puppeteer.launch({
    headless: 'new'
  });

  const page = await browser.newPage();

  for (const post of posts) {
    const html = generateBlogHTML(post);
    const filename = `${post.slug}.pdf`;
    const filepath = path.join(outputDir, filename);

    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: filepath,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true
    });

    console.log(`✅ Generado: ${filename}`);
  }

  await browser.close();

  console.log(`\n🎉 ¡Completado! ${posts.length} PDFs generados en ${outputDir}/`);
}

generatePDFs().catch(console.error);
