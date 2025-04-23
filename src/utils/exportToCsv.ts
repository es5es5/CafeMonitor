// utils/exportToCsv.ts

import fs from 'fs'
import path from 'path'
import {ArticleItem} from '../types/cafeType'
import {getArticleLink} from './getArticleLink'
import dayjs from 'dayjs'

/**
 * 게시글 데이터를 CSV 파일로 저장
 */
export function exportToCsv(
  keyword: string,
  articles: ArticleItem[],
  outputPath: string = './output.csv',
) {
  const header = '키워드,작성일,작성자,제목,내용,링크'
  const rows = articles.map(article => {
    const date = dayjs(article.writeDateTimestamp).format('YYYY-MM-DD HH:mm:ss')
    const link = getArticleLink(article.articleId)
    return [
      keyword,
      date,
      article.writerInfo.nickName,
      article.subject.replace(/"/g, '""'),
      article.summary.replace(/"/g, '""'),
      link,
    ]
      .map(field => `"${field}"`) // CSV 안전하게
      .join(',')
  })

  const csvContent = [header, ...rows].join('\n')

  fs.writeFileSync(path.resolve(outputPath), csvContent, 'utf-8')
  console.log(`✅ CSV 파일 저장 완료: ${outputPath}`)
}
