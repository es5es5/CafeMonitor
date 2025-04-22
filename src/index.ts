// src/index.ts
import {fetchHautoArticlesByKeyword} from './apis/hautoAllPosts'

async function main() {
  const keywords = ['수학'] // 여기에 원하는 키워드를 추가하세요

  await Promise.all(
    keywords.map(async keyword => {
      await fetchHautoArticlesByKeyword(keyword)
    }),
  )
}

main().catch(err => {
  console.error('❌ 전체 실행 중 오류:', err)
})
