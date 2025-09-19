import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Request } from 'express'

import { MenuService } from './menu.service'
import { CreateMenuReqDto, FindMenuReqDto, UpdateMenuReqDto } from './dto/menu.req.dto'
import { CreateMenuResDto, FindMenuResDto } from './dto/menu.res.dto'

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'
import { MsgResponseDto } from '@/utils/response-dto'
import { HasPermission } from '@/common/decorators/has-permission.decorator'
import { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'
import { Operation, OperationType } from '@/common/decorators/operation.decorator'

@Controller('/admin-api/system/menu')
@UseInterceptors(TransformInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/create')
  @HasPermission('system:menu:create')
  @Operation({ type: OperationType.CREATE, name: '建立選單', module: 'system-menu' })
  @ApiOperation({ summary: '建立選單' })
  @ApiResponse({ type: CreateMenuResDto })
  @ResponseMessage('建立選單成功')
  create(@Body() createMenuReqDto: CreateMenuReqDto) {
    return this.menuService.create(createMenuReqDto)
  }

  @Get('/list')
  @HasPermission('system:menu:query')
  @Operation({ type: OperationType.READ, name: '取得選單分頁列表', module: 'system-menu' })
  @ApiOperation({ summary: '取得選單分頁列表' })
  @ApiResponse({ type: FindMenuResDto })
  @ResponseMessage('取得選單分頁列表成功')
  find(@Query() findMenuReqDto: FindMenuReqDto) {
    return this.menuService.find(findMenuReqDto)
  }

  @Get('/user-menus')
  @Operation({ type: OperationType.READ, name: '取得當前使用者的選單', module: 'system-menu' })
  @ApiOperation({ summary: '取得當前使用者的選單' })
  @ApiResponse({ type: FindMenuResDto })
  @ResponseMessage('取得當前使用者選單成功')
  getUserMenus(@Req() request: Request) {
    const userId = request['user'].id
    return this.menuService.getUserMenus(userId)
  }

  @Put('/update')
  @HasPermission('system:menu:update')
  @Operation({ type: OperationType.UPDATE, name: '更新選單', module: 'system-menu' })
  @ApiOperation({ summary: '更新選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('更新選單成功')
  update(@Body() updateMenuReqDto: UpdateMenuReqDto) {
    return this.menuService.update(updateMenuReqDto)
  }

  @Delete('/delete/:id')
  @HasPermission('system:menu:delete')
  @Operation({ type: OperationType.DELETE, name: '刪除選單', module: 'system-menu' })
  @ApiOperation({ summary: '刪除選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('刪除選單成功')
  delete(@Param('id', ParseBigIntPipe) id: string) {
    return this.menuService.delete(id)
  }

  @Put('/block/:id')
  @HasPermission('system:menu:block')
  @Operation({ type: OperationType.UPDATE, name: '封鎖選單', module: 'system-menu' })
  @ApiOperation({ summary: '封鎖選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('封鎖選單成功')
  block(@Param('id', ParseBigIntPipe) id: string) {
    return this.menuService.block(id)
  }

  @Put('/unblock/:id')
  @HasPermission('system:menu:unblock')
  @Operation({ type: OperationType.UPDATE, name: '解封鎖選單', module: 'system-menu' })
  @ApiOperation({ summary: '解封鎖選單' })
  @ApiResponse({ type: MsgResponseDto() })
  @ResponseMessage('解封鎖選單成功')
  unblock(@Param('id', ParseBigIntPipe) id: string) {
    return this.menuService.unblock(id)
  }
}
