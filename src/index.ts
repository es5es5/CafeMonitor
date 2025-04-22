import {crawlCafe} from './crawler/crawlCafe'

async function main() {
  console.log('✅ CafeMonitor 시작됨!')
  const posts = await crawlCafe()
  console.log('📄 필터링 전 게시글:', posts)
}

main()
