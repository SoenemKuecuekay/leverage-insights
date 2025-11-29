import fs from 'fs/promises';

const ARTICLES_PATH = './data/articles.json';

async function main() {
  const args = process.argv.slice(2);
  const data = JSON.parse(await fs.readFile(ARTICLES_PATH, 'utf-8'));
  
  if (args.includes('--list')) {
    console.log('\n📋 Pending Artikel:\n');
    if (!data.pending?.length) {
      console.log('   Keine Artikel zur Freigabe.\n');
      return;
    }
    data.pending.forEach((a, i) => {
      console.log(`${i+1}. ${a.title}`);
      console.log(`   Kategorie: ${a.categoryLabel} | Generiert: ${a.generatedAt}\n`);
    });
    return;
  }
  
  if (!data.pending?.length) {
    console.log('❌ Keine Artikel zur Freigabe vorhanden.');
    return;
  }
  
  const article = data.pending.shift();
  article.status = 'published';
  article.approvedAt = new Date().toISOString();
  
  data.articles.unshift(article);
  data.meta.totalArticles = data.articles.length + 1;
  
  await fs.writeFile(ARTICLES_PATH, JSON.stringify(data, null, 2));
  
  console.log(`\n✅ Artikel genehmigt: "${article.title}"`);
  console.log('   Der Artikel ist jetzt live!\n');
}

main().catch(console.error);
