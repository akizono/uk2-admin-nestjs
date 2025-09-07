export function getToken(request, tokenType: 'authorization' | 'refresh-token') {
  const [type, token] = request.headers[tokenType]?.split(' ') ?? []
  return type === 'Bearer' ? token : ''
}
