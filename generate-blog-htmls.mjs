import fs from 'fs';
import path from 'path';

// Leer el archivo posts.ts y extraer los posts manualmente
const postsContent = fs.readFileSync('./src/data/posts.ts', 'utf-8');

// Extraer los posts del archivo (parsing simple)
const postsMatch = postsContent.match(/export const posts: Post\[\] = (\[[\s\S]*?\]);/);
if (!postsMatch) {
  console.error('No se pudieron extraer los posts');
  process.exit(1);
}

// Evaluar el array de posts (usar eval con cuidado, solo en scripts locales)
const posts = eval(postsMatch[1]);

const outputDir = './pdfs/blogs';

// Crear directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Función para generar HTML del blog
function generateBlogHTML(post) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.titulo} - Mallku</title>
  <style>
    @page {
      margin: 2cm;
      size: A4;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Georgia', serif;
      line-height: 1.8;
      color: #2c2c2c;
      padding: 40px 60px;
      max-width: 210mm;
      margin: 0 auto;
      background: white;
    }

    header {
      margin-bottom: 40px;
      border-bottom: 3px solid #c85a3f;
      padding-bottom: 25px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 15px;
      line-height: 1.3;
    }

    .meta {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      font-size: 13px;
      color: #666;
      margin-top: 12px;
    }

    .meta span {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .categoria {
      background: #c85a3f;
      color: white;
      padding: 3px 10px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 12px;
    }

    .excerpt {
      font-size: 17px;
      font-style: italic;
      color: #555;
      margin-bottom: 35px;
      padding: 18px;
      background: #f9f9f9;
      border-left: 4px solid #c85a3f;
    }

    .content p {
      margin-bottom: 22px;
      text-align: justify;
      font-size: 15px;
      line-height: 1.75;
    }

    footer {
      margin-top: 50px;
      padding-top: 25px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 13px;
    }

    .logo {
      font-family: 'Arial', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #c85a3f;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }

    .footer-info {
      margin-top: 8px;
      font-size: 12px;
      color: #999;
    }

    @media print {
      body {
        padding: 0;
      }

      @page {
        margin: 2cm;
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
    <p class="footer-info">www.mallku.com.ar | contacto@mallku.com.ar</p>
  </footer>

  <script>
    // Auto-imprimir cuando se carga (opcional - comentado por defecto)
    // window.onload = () => window.print();
  </script>
</body>
</html>`;
}

// Generar HTMLs
console.log('🚀 Generando archivos HTML para blogs...\n');

posts.forEach((post, index) => {
  const html = generateBlogHTML(post);
  const filename = `${post.slug}.html`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, html, 'utf-8');
  console.log(`✅ ${index + 1}/${posts.length} - ${filename}`);
});

console.log(`\n🎉 ¡Completado! ${posts.length} archivos HTML generados en ${outputDir}/`);
console.log('\n📄 Para convertir a PDF:');
console.log('   1. Abrí cada archivo HTML en tu navegador');
console.log('   2. Presioná Ctrl+P (Imprimir)');
console.log('   3. Seleccioná "Guardar como PDF"');
console.log('   4. Guardá el archivo\n');
