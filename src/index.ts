import {fetchHautoArticlesByKeyword} from './apis/hautoAllPosts'

const keywords = ['청담', '후기', '수학', '과외', '상담']

async function main() {
  const results = await Promise.all(
    keywords.map(async keyword => {
      const result = await fetchHautoArticlesByKeyword(keyword)
      return result
    }),
  )

  results.forEach(result => {
    console.log(result)
  })
}

main().catch(error => {
  console.error('❌ 프로그램 실행 중 오류:', error)
})
