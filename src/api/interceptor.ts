type InterceptorOptions = {
  synchronous?: boolean;
  runWhen?: string | null;
};

type InterceptorHandler = {
  fulfilled: (value: any) => any;
  rejected: (error: any) => any;
  synchronous: boolean;
  runWhen: string | null;
};

export class InterceptorManager {
  private handlers: Array<InterceptorHandler | null>;

  constructor() {
    this.handlers = [];
  }

  get isEmpty() {
    return this.handlers.length === 0;
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   * @param {InterceptorOptions} options (optional) Interceptor options
   *
   * @return {number} An ID used to remove interceptor later
   */
  use(
    fulfilled: (value: any) => any,
    rejected: (error: any) => any = () => { },
    options?: InterceptorOptions): number {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options?.synchronous || false,
      runWhen: options?.runWhen || null,
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {number} id The ID that was returned by `use`
   *
   * @returns {boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(index: number): boolean {
    if (this.handlers[index]) {
      this.handlers[index] = null;
      return true;
    }
    return false;
  }


  clear(): void {
    this.handlers = [];
  }

  forEach(fn: (handler: InterceptorHandler) => void): void {
    this.handlers.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    });
  }
}
