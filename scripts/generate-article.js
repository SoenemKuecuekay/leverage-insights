import OpenAI from 'openai';
import fs from 'fs/promises';

const CONFIG = {
  model: 'gpt-4o',
  articlesPath: './data/articles.json',
  maxArticles: 18,
  categories: [
    { id: 'ai', label: 'AI & Automation', weight: 3 },
    { id: 'creator', label: 'Creator Economy', weight: 2 },
    { id: 'hospitality', label: 'Hospitality', weight: 2 },
    { id: 'strategy', label: 'Strategy', weight: 2 },
    { id: 'case-study', label: 'Case Study', weight: 1 }
  ],
  authors: [
    { name: 'LEVERAGE Editorial', initials: 'LS' },
    { name: 'M. Krause', initials: 'MK' },
    { name: 'T. Berger', initials: 'TB' },
    { name: 'J. Weber', initials: 'JW' }
  ]
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function selectCategory(articles) {
  const counts = {};
  CONFIG.categories.forEach(c => counts[c.id] = 0);
  articles.forEach(a => { if (counts[a.category] !== undefined) counts[a.category]++; });
  
  const weights = CONFIG.categories.map(c => ({ ...c, adjusted: c.weight / (counts[c.id] + 1) }));
  const total = weights.reduce((s, w) => s + w.adjusted, 0);
  let rand = Math.random() * total;
  
  for (const cat of weights) {
    rand -= cat.adjusted;
    if (rand <= 0) return cat;
  }
  return weights[0];
}

function selectAuthor() {
  return CONFIG.authors[Math.floor(Math.random() * CONFIG.authors.length)];
}

function getDateInfo() {
  const now = new Date();
  const months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  return {
    date: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`,
    dateLabel: `${months[now.getMonth()]} ${now.getFullYear()}`
  };
}

async function generateArticle(category, existingTitles) {
  const author = selectAuthor();
  const dateInfo = getDateInfo();
  
  const response = await openai.chat.completions.create({
    model: CONFIG.model,
    messages: [
      { role: 'system', content: `Du bist Content Strategist bei LEVERAGE STRATEGIES. Schreibe professionell, datengetrieben, auf Deutsch mit englischen Fachbegriffen. Zielgruppe: C-Level und Marketing-Entscheider DACH.` },
      { role: 'user', content: `Generiere einen Insight-Artikel für "${category.label}". Vermeide diese Titel: ${existingTitles.slice(0,5).join(', ')}. Antworte als JSON: {"title":"...","excerpt":"...","content":"<p>...</p><h2>...</h2>...","tags":["..."],"readTime":"X Min."}` }
    ],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  });

  const data = JSON.parse(response.choices[0].message.content);
  const id = data.title.toLowerCase().replace(/[äöü]/g,m=>({ä:'ae',ö:'oe',ü:'ue'}[m])).replace(/[^a-z0-9]+/g,'-').substring(0,40);

  return {
    id: `${id}-${Date.now()}`,
    category: category.id,
    categoryLabel: category.label,
    ...data,
    author: author.name,
    authorInitials: author.initials,
    ...dateInfo,
    status: 'pending',
    generatedAt: new Date().toISOString()
  };
}

async function main() {
  console.log('🚀 LEVERAGE Insights - Article Generator\n');
  
  const data = JSON.parse(await fs.readFile(CONFIG.articlesPath, 'utf-8'));
  const allArticles = [data.featured, ...data.articles];
  const category = selectCategory(allArticles);
  
  console.log(`📂 Kategorie: ${category.label}`);
  
  const article = await generateArticle(category, allArticles.map(a => a.title));
  
  console.log(`📝 Titel: ${article.title}`);
  console.log(`✅ Status: PENDING\n`);
  
  if (data.articles.length >= CONFIG.maxArticles) {
    const archived = data.articles.pop();
    data.archived = data.archived || [];
    data.archived.push(archived);
    console.log(`📦 Archiviert: ${archived.title}`);
  }
  
  data.pending = data.pending || [];
  data.pending.unshift(article);
  data.meta.lastGenerated = new Date().toISOString().split('T')[0];
  
  await fs.writeFile(CONFIG.articlesPath, JSON.stringify(data, null, 2));
  console.log('💾 Gespeichert!');
}

main().catch(console.error);
