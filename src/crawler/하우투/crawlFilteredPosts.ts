import puppeteer from 'puppeteer'

export interface PostItem {
  title: string
  url: string
  date: string
}

export async function crawlFilteredPosts(
  baseUrl: string,
  keywords: string[],
): Promise<PostItem[]> {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()

  const pageNum = 1
  const size = 50
  const keywordParam = encodeURIComponent(keywords.join(' '))
  const searchUrl =
    `${baseUrl}?ta=ARTICLE_COMMENT&page=${pageNum}&size=${size}&q=` +
    keywordParam

  await page.goto(searchUrl, {waitUntil: 'domcontentloaded'})

  const posts = await page.$$eval(
    'ul.article-list li.article-board',
    (nodes, kwList, todayISOString) => {
      const result: any[] = []
      const today = new Date(todayISOString)
      const oneMonthAgo = new Date(today)
      oneMonthAgo.setMonth(today.getMonth() - 1)

      nodes.forEach(node => {
        const title =
          node.querySelector('.article-title')?.textContent?.trim() || ''
        const dateStr =
          node.querySelector('.article-date')?.textContent?.trim() || ''
        const href = node.querySelector('a.article')?.getAttribute('href') || ''
        const url = 'https://cafe.naver.com' + href

        // 날짜 파싱 (예: "04.22")
        const parsedDate = (() => {
          try {
            const [month, day] = dateStr.split('.').map(Number)
            return new Date(today.getFullYear(), month - 1, day)
          } catch {
            return null
          }
        })()

        if (!parsedDate || parsedDate < oneMonthAgo) return

        const lowerTitle = title.toLowerCase()
        const containsKeyword = kwList.some(k =>
          lowerTitle.includes(k.toLowerCase()),
        )

        if (containsKeyword) {
          result.push({title, url, date: dateStr})
        }
      })

      return result
    },
    keywords,
    new Date().toISOString(),
  )

  await browser.close()
  return posts
}
