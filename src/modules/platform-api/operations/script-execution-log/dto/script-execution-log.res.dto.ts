import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateScriptExecutionLogResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindScriptExecutionLogResDto extends PaginatedResponseDto({
  id: '1',
  name: 'test_script.sh',
  path: '/home/user/scripts/test_script.sh',
  result: 'Script executed successfully',
  error: '',
  exitCode: 0,
  startTime: '2025-09-02T17:30:00.000Z',
  endTime: '2025-09-02T17:30:05.000Z',
  duration: 5,
  environment: 'testing',
  type: 'shell',

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}
