import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { MenuService } from './menu.service'
import { CreateMenuReqDto, FindMenuReqDto, UpdateMenuReqDto } from './dto/menu.req.dto'
import { CreateMenuResDto, FindMenuResDto } from './dto/menu.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'

@Controller('/system/menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/create')
  @HasPermission('system:menu:create')
  @ApiOperation({ summary: '建立選單' })
  @ApiResponse({ type: CreateMenuResDto })
  @ResponseMessage('建立選單成功')
  create(@Body() createMenuReqDto: CreateMenuReqDto) {
    return this.menuService.create(createMenuReqDto)
  }

  @Get('/page')
  @HasPermission('system:menu:page')
  @ApiOperation({ summary: '取得選單分頁列表' })
  @ApiResponse({ type: FindMenuResDto })
  @ResponseMessage('取得選單分頁列表成功')
  find(@Query() findMenuReqDto: FindMenuReqDto) {
    return this.menuService.find(findMenuReqDto)
  }

  @Put('/update')
  @HasPermission('system:menu:update')
  @ApiOperation({ summary: '更新選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新選單成功')
  update(@Body() updateMenuReqDto: UpdateMenuReqDto) {
    return this.menuService.update(updateMenuReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:menu:delete')
  @ApiOperation({ summary: '刪除選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除選單成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.menuService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:menu:block')
  @ApiOperation({ summary: '封鎖選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖選單成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.menuService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:menu:unblock')
  @ApiOperation({ summary: '解封鎖選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖選單成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.menuService.unblock(id)
  }
}
