import { Octokit } from '@octokit/rest';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function downloadRepo() {
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });
  
  const owner = 'Proplaunch';
  const repo = 'Crownix1';
  const outputDir = 'website';
  
  console.log(`Fetching repository tree for ${owner}/${repo}...`);
  
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const defaultBranch = repoData.default_branch;
  
  const { data: tree } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: defaultBranch,
    recursive: 'true',
  });
  
  console.log(`Found ${tree.tree.length} items in repository`);
  
  for (const item of tree.tree) {
    if (item.type === 'blob' && item.path) {
      const filePath = join(outputDir, item.path);
      const dirPath = dirname(filePath);
      
      mkdirSync(dirPath, { recursive: true });
      
      const { data: blob } = await octokit.git.getBlob({
        owner,
        repo,
        file_sha: item.sha!,
      });
      
      const content = Buffer.from(blob.content, 'base64');
      writeFileSync(filePath, content);
      console.log(`Downloaded: ${item.path}`);
    }
  }
  
  console.log(`\nRepository cloned successfully to ./${outputDir}/`);
}

downloadRepo().catch(console.error);
