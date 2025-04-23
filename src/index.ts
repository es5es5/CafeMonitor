// index.ts

import {fetchByPageKeywords} from './services/fetchByPageKeywords'
import {fetchStartPageByDate} from './services/fetchStartPageByDate'

const keywords = ['CMS', '영재관']

async function main() {
  // 1. 페이지 수 기반 검색
  // const pageResults = await fetchByPageKeywords(keywords, {
  //   maxPage: 50,
  //   onProgress: (percent: number) => {
  //     process.stdout.write(`\r[페이지] 진행률: ${percent}%`)
  //   },
  // })

  // pageResults.forEach(result => {
  //   console.log('\n' + result)
  // })

  // console.log('\n\n====================================\n\n')

  // 2. 날짜 기반 검색 (예: 2024년 1월 1일 이후)
  // const dateResults = await fetchAfterDateKeywords(keywords, {
  //   afterDate: '2025-01-01',
  //   onProgress: (percent: number) => {
  //     process.stdout.write(`\r진행률: ${percent}%`)
  //   },
  // })

  // dateResults.forEach(result => {
  //   console.log('\n' + result)
  // })

  const afterDate = new Date('2025-01-01')
  const result = await fetchStartPageByDate(afterDate)
}

main().catch(console.error)
