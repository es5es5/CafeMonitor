import puppeteer from 'puppeteer'
import {getCafeFrame} from './getFrame'
import {config} from '../config'
import {CafePost} from '../types/post'

export async function crawlCafe(): Promise<CafePost[]> {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page.goto(config.cafeUrl, {waitUntil: 'domcontentloaded'})

  const frame = await getCafeFrame(page)
  if (!frame) {
    console.log('❌ 게시판 프레임 찾기 실패')
    await browser.close()
    return []
  }

  const posts = await frame.$$eval('.article', (els: Element[]) =>
    els.map(el => {
      const title =
        el.querySelector('.inner_list')?.textContent?.trim() || '제목 없음'
      const link = el.querySelector('a')?.getAttribute('href') || '#'
      return {title, url: link}
    }),
  )

  await browser.close()
  return posts
}
