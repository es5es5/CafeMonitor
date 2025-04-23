// index.ts

import {fetchByPageKeywords} from './services/fetchByPageKeywords'
import {fetchStartPageByDate} from './services/fetchStartPageByDate'
import {exportToCsv} from './utils/exportToCsv'

async function main() {
  const 시작시간 = Date.now()

  const 키워드 = ['CMS', '황소']
  const 기준날짜 = new Date('2025-04-20')
  const 기준페이지 = await fetchStartPageByDate(기준날짜)

  const pageResults = await fetchByPageKeywords(키워드, {
    maxPage: 기준페이지,
    onProgress: (percent: number) => {
      process.stdout.write(`\r[페이지] 진행률: ${percent}%`)
    },
  })

  for (const {keyword, resultText, articles} of pageResults) {
    console.log('\n' + resultText)

    if (articles.length > 0) {
      exportToCsv(keyword, articles, './output') // 폴더만 전달
    }
  }

  const 종료시간 = Date.now()
  const 소요시간초 = ((종료시간 - 시작시간) / 1000).toFixed(2)

  console.log('\n\n====================================')
  console.log(`기준날짜: ${기준날짜}`)
  console.log(`키워드: ${키워드}`)
  console.log(`총 소요 시간: ${소요시간초}초`)
  console.log('====================================\n')
}

main().catch(console.error)
