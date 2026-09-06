import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cache } from './cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const metaFilePath = path.join(__dirname, '../data/custom-meta.json');

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'aditaya-raj06';
const CACHE_KEY = `github_repos_${GITHUB_USERNAME}`;

/**
 * Loads custom enrichment metadata if available
 */
function loadCustomMeta() {
  try {
    if (fs.existsSync(metaFilePath)) {
      const data = fs.readFileSync(metaFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[Sync] Error loading custom meta:', err.message);
  }
  return {};
}

/**
 * Transforms raw GitHub API repository objects into Portfolio Project cards
 */
function transformRepo(repo, customMeta) {
  const meta = customMeta[repo.name] || {};

  // Infer category from language or topics
  let category = meta.category || 'fullstack';
  let categoryLabel = meta.categoryLabel || 'Web Engineering';

  const lang = (repo.language || '').toLowerCase();
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();

  if (
    category === 'fullstack' &&
    (lang === 'python' || name.includes('ml') || name.includes('ai') || desc.includes('machine learning') || desc.includes('model'))
  ) {
    category = 'ai-ml';
    categoryLabel = 'Machine Learning & AI';
  } else if (name.includes('cloud') || name.includes('devops') || desc.includes('pipeline') || desc.includes('docker')) {
    category = 'cloud-systems';
    categoryLabel = 'Cloud & Systems';
  }

  // Choose appropriate graphic
  let image = meta.image;
  if (!image) {
    if (category === 'ai-ml') image = 'assets/images/project-ai.svg';
    else if (category === 'cloud-systems') image = 'assets/images/project-cloud.svg';
    else image = 'assets/images/project-commerce.svg';
  }

  // Technologies tags
  const technologies = [];
  if (repo.language) technologies.push(repo.language);
  if (Array.isArray(repo.topics)) {
    repo.topics.forEach(t => {
      if (!technologies.includes(t)) technologies.push(t);
    });
  }
  if (technologies.length === 0) {
    technologies.push('Software');
  }

  // Impact message
  let impact = meta.impact;
  if (!impact) {
    if (repo.stargazers_count > 0) {
      impact = `⭐ ${repo.stargazers_count} GitHub Stars • Active Open-Source Project`;
    } else {
      impact = `🚀 Actively maintained repository • Latest update: ${new Date(repo.updated_at).toLocaleDateString()}`;
    }
  }

  return {
    id: repo.name,
    title: meta.title || repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    category,
    categoryLabel,
    description: repo.description || meta.description || 'Open-source software project engineered and published by Aditaya Raj.',
    impact,
    technologies: meta.technologies || technologies,
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || meta.liveUrl || repo.html_url,
    image,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    isFork: repo.fork
  };
}

/**
 * Fetches latest public repositories directly from GitHub API
 */
export async function fetchLiveGitHubData(force = false) {
  if (!force) {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return cached;
    }
  }

  try {
    const headers = {
      'User-Agent': 'Portfolio-Sync-Engine'
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    const userData = userRes.ok ? await userRes.json() : null;

    // 2. Fetch user repositories (sorted by updated)
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers });
    
    if (!reposRes.ok) {
      throw new Error(`GitHub API returned status ${reposRes.status}`);
    }

    const repos = await reposRes.json();
    const customMeta = loadCustomMeta();

    // Filter out config repository (e.g. aditaya-raj06/aditaya-raj06) unless explicit
    const projects = repos
      .filter(repo => repo.name !== GITHUB_USERNAME && !repo.fork)
      .map(repo => transformRepo(repo, customMeta));

    const result = {
      username: GITHUB_USERNAME,
      profile: {
        name: userData?.name || 'Aditaya Raj',
        bio: userData?.bio || '',
        publicRepos: userData?.public_repos || repos.length,
        followers: userData?.followers || 0,
        following: userData?.following || 0,
        avatarUrl: userData?.avatar_url || ''
      },
      projects,
      syncedAt: new Date().toISOString()
    };

    // Cache for 10 minutes (600 seconds)
    cache.set(CACHE_KEY, result, 600);
    console.log(`[Sync] Successfully synced ${projects.length} repositories from GitHub for ${GITHUB_USERNAME}`);
    return result;
  } catch (err) {
    console.error('[Sync] Failed to fetch live GitHub data:', err.message);
    const stale = cache.get(CACHE_KEY);
    if (stale) return stale;
    throw err;
  }
}

/**
 * Manually invalidates and re-syncs GitHub data immediately
 */
export async function invalidateAndSync() {
  cache.invalidate(CACHE_KEY);
  return await fetchLiveGitHubData(true);
}
