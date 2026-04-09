import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gameRootDir = path.resolve(__dirname, '..');
const repoRootDir = path.resolve(gameRootDir, '..');
const scenariosRootDir = path.join(repoRootDir, 'Scenarios');
const requestedPort = Number(process.env.PORT) || 8080;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.map': 'application/json; charset=utf-8',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg'
};

function getSafePath(urlPath) {
    const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
    const requested = cleanPath === '/' ? '/index.html' : cleanPath;
    const baseDir = requested.startsWith('/Scenarios/')
        ? scenariosRootDir
        : gameRootDir;
    const relativePath = requested.startsWith('/Scenarios/')
        ? requested.slice('/Scenarios'.length)
        : requested;
    const resolved = path.resolve(baseDir, `.${relativePath}`);

    if (!resolved.startsWith(baseDir)) {
        return null;
    }

    return resolved;
}

const server = createServer(async (req, res) => {
    try {
        const targetPath = getSafePath(req.url || '/');
        if (!targetPath) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        const info = await stat(targetPath);
        if (info.isDirectory()) {
            res.writeHead(403);
            res.end('Directory listing is disabled');
            return;
        }

        const ext = path.extname(targetPath).toLowerCase();
        const type = mimeTypes[ext] || 'application/octet-stream';
        const data = await readFile(targetPath);

        res.writeHead(200, {
            'Content-Type': type,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            Pragma: 'no-cache',
            Expires: '0'
        });
        res.end(data);
    } catch {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${requestedPort} is already in use. Start with a different one, e.g. PORT=8090 npm start`);
        process.exit(1);
    }
    throw error;
});

server.listen(requestedPort, () => {
    const address = server.address();
    const activePort = typeof address === 'object' && address ? address.port : requestedPort;
    console.log(`Nutrition Adventures dev server running at http://localhost:${activePort}`);
});
