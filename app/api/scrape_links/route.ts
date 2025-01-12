import FirecrawlApp from '@mendable/firecrawl-js'

export async function POST(req) {
  const { url } = await req.json()
  const apiKey = process.env.FIRECRAWL_API_KEY

  if (!apiKey) {
    return new Response(JSON.stringify({ message: 'API key not found' }), {
      status: 500,
    })
  }

  const app = new FirecrawlApp({ apiKey: apiKey })

  try {
    const formattedUrl =
      url[0].startsWith('http://') || url[0].startsWith('https://')
        ? url[0]
        : `https://${url[0]}`
    console.log('Formatted URL', formattedUrl)

    const crawlResult = await app.crawlUrl(
      formattedUrl,
      {
        crawlerOptions: {
          returnOnlyUrls: true,
          excludes: [],
          includes: [],
          limit: 50,
        },
      },
      false,
    ) // false to not wait for the job to complete

    if (crawlResult) {
      console.log("Crawl Result", crawlResult);
      // const scrapedLinks = crawlResult.map((item) => item.url)
      return new Response(JSON.stringify({ jobId: crawlResult.jobId }), { status: 200 })
    } else {
      console.error('No URLs found in response', crawlResult)
      console.log("Crawl Result Failed", crawlResult);
      return new Response(
        JSON.stringify({ message: 'No URLs found in response', crawlResult }),
        { status: 500 },
      )
    }
  } catch (error) {
    if (error.response?.status === 502) {
      console.error(
        'Error scraping links',
        'The server is down... try again in a few minutes',
      )
      return new Response(
        JSON.stringify({
          message: 'The server is down... try again in a few minutes',
        }),
        { status: 502 },
      )
    } else {
      console.error(
        'Error scraping links',
        error.response?.status,
        error.response?.statusText,
        error.response?.data,
        error.message,
      )
      return new Response(
        JSON.stringify({
          message: 'Error scraping links',
          error: error.message,
        }),
        { status: 500 },
      )
    }
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')
  const apiKey = process.env.FIRECRAWL_API_KEY

  console.log("Getting Job ID", jobId)

  if (!apiKey) {
    return new Response(JSON.stringify({ message: 'API key not found' }), {
      status: 500,
    })
  }

  if (!jobId) {
    return new Response(JSON.stringify({ message: 'Job ID not provided' }), {
      status: 400,
    })
  }

  const app = new FirecrawlApp({ apiKey: apiKey })

  console.log("APP")

  try {
    const status = await app.checkCrawlStatus(jobId)
    console.log("Status", status)

    if (status.status === 'completed') {
      const urls = status.data ? status.data.map((item) => item.url) : []
      console.log("URLS", urls)
      return new Response(JSON.stringify({ status: 'completed', urls }), { status: 200 })
    } else {
      return new Response(JSON.stringify({ status: status.status }), { status: 200 })
    }
  } catch (error) {
    console.error(
      'Error checking job status',
      error.response?.status,
      error.response?.statusText,
      error.response?.data,
      error.message,
    )
    return new Response(
      JSON.stringify({
        message: 'Error checking job status',
        error: error.message,
      }),
      { status: 500 },
    )
  }
}