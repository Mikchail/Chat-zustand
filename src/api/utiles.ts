async function fetchWithTimeout(
    resource: RequestInfo,
    options: RequestInit & {timeout?: number} = {},
  ): Promise<Response> {
    const {timeout = 10000} = options
    let timerId;
    const controller = new AbortController()
    const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
            reject('timeout')
            controller.abort()
        }, timeout)
    })
  
    const response = fetch(resource, {
        ...options,
        signal: controller.signal,
      })
    const promise = await Promise.race([timeoutPromise, response])
  
    clearTimeout(timerId)
  
    return promise as Promise<Response>
  }
  
  export {fetchWithTimeout}