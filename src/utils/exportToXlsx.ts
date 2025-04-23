// utils/exportToXlsx.ts

import * as XLSX from 'xlsx'
import {ArticleItem} from '../types/cafeType'
import {getArticleLink} from './getArticleLink'
import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'

/**
 * 게시글 데이터를 XLSX 파일로 저장합니다.
 * - 파일명: [키워드]_YYYYMMDDHHmm.xlsx
 * - 열 순서: 키워드, 제목, 내용, 작성자, 작성일, 링크
 */
export function exportToXlsx(
  keyword: string,
  articles: ArticleItem[],
  outputDir = './output',
) {
  const rows = [
    ['키워드', '제목', '내용', '작성자', '작성일', '링크'],
    ...articles.map(article => [
      keyword,
      article.subject,
      article.summary,
      article.writerInfo.nickName,
      dayjs(article.writeDateTimestamp).format('YYYY-MM-DD HH:mm:ss'),
      getArticleLink(article.articleId),
    ]),
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, keyword)

  // 📁 output 디렉터리 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true})
  }

  // 🕒 파일명: [키워드]_YYYYMMDDHHmm.xlsx
  const timestamp = dayjs().format('YYYYMMDDHHmm')
  const safeKeyword = keyword.replace(/[\\/:*?"<>|]/g, '_')
  const filename = `[${safeKeyword}]_${timestamp}.xlsx`
  const filePath = path.join(outputDir, filename)

  // 💾 저장
  XLSX.writeFile(workbook, filePath)
  console.log(`✅ XLSX 저장 완료: ${filePath}`)
}
