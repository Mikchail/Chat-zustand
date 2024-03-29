const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu
export function isEmailValid(value: string) {
  return EMAIL_REGEXP.test(value)
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r % 4) + 8
    return v.toString(16)
  })
}

export const throttle = (callee: (args: any[]) => void, timeout: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function perform(...args: any) {
    if (timer) return

    timer = setTimeout(() => {
      callee(args)
      if (timer) {
        clearTimeout(timer)
      }
      timer = null
    }, timeout)
  }
}
