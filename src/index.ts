// index.ts

import {fetchByPageKeywords} from './services/fetchByPageKeywords'
import {fetchStartPageByDate} from './services/fetchStartPageByDate'

async function main() {
  const 시작시간 = Date.now() // 시작 시간 기록

  const 키워드 = ['CMS', '영재관']
  const 기준날짜 = new Date('2025-04-10')
  const 기준페이지 = await fetchStartPageByDate(기준날짜)

  const pageResults = await fetchByPageKeywords(키워드, {
    maxPage: 기준페이지,
    onProgress: (percent: number) => {
      process.stdout.write(`\r[페이지] 진행률: ${percent}%`)
    },
  })

  pageResults.forEach(result => {
    console.log('\n' + result)
  })

  const 종료시간 = Date.now()
  const 소요시간초 = ((종료시간 - 시작시간) / 1000).toFixed(2)

  console.log('\n\n====================================')
  console.log(`기준날짜: ${기준날짜}`)
  console.log(`키워드: ${키워드}`)
  console.log(`총 소요 시간: ${소요시간초}초`)
  console.log('====================================\n')
}

main().catch(console.error)
