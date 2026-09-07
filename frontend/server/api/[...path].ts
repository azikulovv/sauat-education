import { getRequestURL, proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const requestUrl = getRequestURL(event)
  const target = `${config.backendInternalUrl}${requestUrl.pathname}${requestUrl.search}`
  return proxyRequest(event, target)
})
