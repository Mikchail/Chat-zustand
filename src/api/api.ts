import { refreshAccessToken } from '@/modules/AuthModule/authStore'
import { InterceptorManager } from './interceptor'
import { fetchWithTimeout } from './utiles'

class ApiService {
  private baseUrl: string
  public beforeRequestHooks: ((request: Request) => void)[] = []
  public interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  }
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.apiFetch = this.apiFetch.bind(this)
    this.post = this.post.bind(this)
    this.get = this.get.bind(this)
  }

  public addHeadersHook = (getHeader: () => Record<string, string> | null) => {
    const hook = (request: Request) => {
      const header = getHeader()
      if (!header) {
        return
      }

      const { name, value } = header
      if (!name || !value) {
        return
      }
      // @ts-expect-error
      request.headers[name] = value
    }

    this.beforeRequestHooks.push(hook)
  }

  async get(path: string, headers: Record<string, string> = {}): Promise<Response> {
    const url = `${this.baseUrl}${path}`
    const response = await this.apiFetch({
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении GET-запроса: ${response.statusText}`)
    }

    return response
  }

  async post(path: string, data: any, headers: Record<string, string> = {}): Promise<Response> {
    const url = `${this.baseUrl}${path}`
    // const header = new Headers(headers)
    // console.log({ header })

    const response = await this.apiFetch({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    })

    if (!response.ok) {
      // console.log({response});
      throw new Error(`Ошибка при выполнении POST-запроса: ${response.statusText}`)
    }

    return response
  }

  async patch<T>(path: string, data: any): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const response = await this.apiFetch({
      url,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении PATCH-запроса: ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  async delete<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const response = await this.apiFetch({
      url,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении DELETE-запроса: ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  async request() {}

  async apiFetch<T>(request: RequestInit & { url: string }) {
    let changedRequest = request
    if (!this.interceptors.request.isEmpty) {
      this.interceptors.request.forEach((interceptor) => {
        changedRequest = interceptor.fulfilled(request)
      })
    }

    let response = fetchWithTimeout(request.url, request)

    return response
      .then((res) => {
        
        let resChanged = Object.assign(res, { originRequest: changedRequest })
        // Apply response interceptors if needed
        this.interceptors.response.forEach((interceptor) => {
          resChanged = interceptor.fulfilled(resChanged)
        })

        return resChanged
      })
      .catch((error) => {
        // Handle request or response errors
        let changedErrors: any = { error }
        changedErrors.config = changedRequest
        // console.log({changedErrors});
        this.interceptors.response.forEach((interceptor) => {
          interceptor.rejected(changedErrors)
        })
        return Promise.reject(error)
      })
  }
}

const apiService = new ApiService('http://127.0.0.1:3000/')
apiService.interceptors.request.use((request) => {
  apiService.beforeRequestHooks.forEach((hook) => hook(request))
  // refreshToken
  // console.log({request});

  return request
})

apiService.interceptors.response.use(
  async (response) => {
    if (response.status === 401) {
      if (!response.originRequest._isRetry) {
        response.originRequest._isRetry = true
        await refreshAccessToken()
        return apiService.apiFetch(response.originRequest)
      } 
    } else {
      return response
    }
    
  },
  async (error) => {
    console.log('interceptors error')
    let originRequest = error.config
    // console.log({ originRequest })
    // console.log({ error })
    if (!originRequest._isRetry) {
      try {
        console.log('in if statement')
        originRequest._isRetry = true
        await refreshAccessToken()
        await apiService.apiFetch(originRequest)
        // await apiService.post("auth/jwt/logout", {})
      } catch (error2) {
        console.log('ЭТО ГОВНО - catch ', { error2 })
      }
    }
  },
)
// const apiService = new ApiService('https://1149-2-95-186-226.ngrok-free.app/');
// Пример использования:
/*
  apiService.interceptors.request.use((request) => {
    console.log("interceptors , request");
    // refreshToken
    // console.log({request});
    
    return request;
  })

  apiService.interceptors.response.use((response) => {
    console.log({response});
    console.log("interceptors");
    return response;
  }, async (error) => {
    console.log("interceptors error");
    let originRequest = error.config;
    console.log({originRequest});
    console.log({error});
    if(!originRequest._isRetry) {
      try {
          console.log("in if statement");
          originRequest._isRetry = true;
          
          await apiService.apiFetch(originRequest)
          // await apiService.post("auth/jwt/logout", {})
       
      } catch(error2) {
        console.log("ЭТО ГОВНО - catch ",{error2});
      }
    }
    
  })
  */

export { apiService }
