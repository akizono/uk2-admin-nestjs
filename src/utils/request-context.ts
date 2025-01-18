import { AsyncLocalStorage } from 'async_hooks'

export interface RequestContext {
  request: Request
}

export const requestContext = new AsyncLocalStorage<RequestContext>()
