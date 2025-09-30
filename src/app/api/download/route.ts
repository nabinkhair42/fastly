import archiver from 'archiver';
import { NextResponse } from 'next/server';

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
}

async function getGitHubFiles(
  path: string = 'my-saas-app'
): Promise<GitHubFile[]> {
  const response = await fetch(
    `https://api.github.com/repos/nabinkhair42/saas-starter/contents/${path}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Fastly-Download-API',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

async function downloadFile(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status}`);
  }
  return response.arrayBuffer();
}

async function addFilesToArchive(
  archive: archiver.Archiver,
  files: GitHubFile[],
  basePath: string = ''
) {
  for (const file of files) {
    if (file.type === 'file' && file.download_url) {
      try {
        const fileBuffer = await downloadFile(file.download_url);
        const relativePath = basePath ? `${basePath}/${file.name}` : file.name;
        archive.append(Buffer.from(fileBuffer), {
          name: `my-saas-app/${relativePath}`,
        });
      } catch (error) {
        console.error(`Failed to download ${file.path}:`, error);
      }
    } else if (file.type === 'dir') {
      try {
        const subFiles = await getGitHubFiles(file.path);
        await addFilesToArchive(archive, subFiles, file.name);
      } catch (error) {
        console.error(`Failed to get files from ${file.path}:`, error);
      }
    }
  }
}

export async function GET() {
  try {
    // Get the root files from my-saas-app directory
    const files = await getGitHubFiles();

    // Create archive
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    // Set headers for download
    const headers = {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="my-saas-app.zip"',
      'Cache-Control': 'no-cache',
    };

    // Add files to archive
    await addFilesToArchive(archive, files);
    archive.finalize();

    // Convert archive to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of archive) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Error creating zip from GitHub:', error);
    return NextResponse.json(
      { error: 'Failed to create download from GitHub' },
      { status: 500 }
    );
  }
}
