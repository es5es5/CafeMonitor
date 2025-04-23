// utils/exportToCsv.ts

import fs from 'fs'
import path from 'path'
import {ArticleItem} from '../types/cafeType'
import {getArticleLink} from './getArticleLink'
import dayjs from 'dayjs'

/**
 * 게시글 데이터를 CSV 파일로 저장 (UTF-8 BOM 인코딩)
 * 헤더 순서: 키워드, 제목, 내용, 작성자, 링크
 * 파일명 포맷: [키워드]_YYYYMMDDHHmm.csv
 */
export function exportToCsv(
  keyword: string,
  articles: ArticleItem[],
  outputDir: string = '.', // 기본 현재 폴더
) {
  const header = '키워드,제목,내용,작성자,작성일,링크'
  const rows = articles.map(article => {
    return [
      keyword,
      article.subject.replace(/"/g, '""'),
      article.summary.replace(/"/g, '""'),
      article.writerInfo.nickName,
      dayjs(article.writeDateTimestamp).format('YYYY-MM-DD HH:mm'),
      getArticleLink(article.articleId),
    ]
      .map(field => `"${field}"`)
      .join(',')
  })

  const csvContent = [header, ...rows].join('\n')

  // 📁 디렉터리 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true})
  }

  // ✅ 파일명: [키워드]_YYYYMMDDHHmm.csv
  const now = dayjs().format('YYYYMMDDHHmm')
  const safeKeyword = keyword.replace(/[\\/:*?"<>|]/g, '_')
  const filename = `[${safeKeyword}]_${now}.csv`
  const filePath = path.join(outputDir, filename)

  // 💾 UTF-8 BOM 포함 저장
  fs.writeFileSync(filePath, '\uFEFF' + csvContent, 'utf-8')
  console.log(`✅ CSV 저장 완료: ${filePath}`)
}
