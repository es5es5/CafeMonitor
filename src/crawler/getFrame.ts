import {Page} from 'puppeteer'

export function getCafeFrame(page: Page) {
  return page.frames().find(f => f.url().includes('ArticleList'))
}
