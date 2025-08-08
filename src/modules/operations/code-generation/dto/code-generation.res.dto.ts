import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'

export class CreateCodeGenerationResDto extends SingleResponseDto({
  id: '100',
}) {}

export class FindCodeGenerationResDto extends PaginatedResponseDto({
  id: '1',
  name: '學生管理',
  code: 'student',
  isGenerateEntity: 0,
  isGenerateBackendCode: 0,
  isGenerateWebCode: 0,
  isImportMenuAndPermission: 0,
  sort: 0,

  remark: 'remark',
  status: 0,
  isDeleted: 0,
  creator: '-1',
  createTime: '2025-03-14T04:50:19.000Z',
  updater: null,
  updateTime: null,
}) {}

// ------------------ 以下為非CURD代碼 ------------------
export class PreviewEntityCodeResDto extends SingleResponseDto({
  treeData: [
    {
      'label': 'src',
      'key': '5J55zpyW',
      'type': 'folder',
      'children': [
        {
          'label': 'modules',
          'key': 'lZoYPjVM',
          'type': 'folder',
          'children': [
            {
              'label': 'demo',
              'key': 'sS6rlyFs',
              'type': 'folder',
              'children': [
                {
                  'label': 'student',
                  'key': '3HwGGuAx',
                  'type': 'folder',
                  'children': [
                    {
                      'label': 'entity',
                      'key': 'P9117kgS',
                      'type': 'folder',
                      'children': [
                        {
                          'label': 'demo-student.entity.ts',
                          'key': 'QfuBu27E',
                          'type': 'file',
                          'code':
                            "import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'\n\nimport { BaseEntity } from '@/common/entities/base.entity'\n\n@Entity('demo_student')\nexport class DemoStudentEntity extends BaseEntity {\n  @PrimaryGeneratedColumn({\n    name: 'id',\n    type: 'bigint',\n    comment: 'id主鍵'\n  })\n  id: number\n\n  @Column({\n    name: 'name',\n    type: 'varchar',\n    length: 55,\n    nullable: false,\n    comment: '姓名'\n  })\n  name: string\n\n  @Column({\n    name: 'age',\n    type: 'int',\n    comment: '年齡'\n  })\n  age: number\n\n  @Column({\n    name: 'id_card',\n    type: 'varchar',\n    length: 55,\n    comment: '證件號碼'\n  })\n  idCard: string\n\n}",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}) {}

export class GetEntityCustomFieldsResDto extends SingleResponseDto({
  'id': {
    'label': 'id主鍵',
    'type': 'string',
    'nullable': false,
  },
  'name': {
    'label': '姓名',
    'type': 'string',
    'nullable': false,
  },
  'age': {
    'label': '年齡',
    'type': 'number',
    'nullable': true,
  },
  'idCard': {
    'label': '證件號碼',
    'type': 'string',
    'nullable': true,
  },
}) {}

export class PreviewBackendCodeResDto extends SingleResponseDto({
  treeData: [
    {
      'label': 'src',
      'key': 'P7BnQUk4',
      'type': 'folder',
      'children': [
        {
          'label': 'modules',
          'key': '08t7Rwk5',
          'type': 'folder',
          'children': [
            {
              'label': 'demo',
              'key': 'TFw3CTzS',
              'type': 'folder',
              'children': [
                {
                  'label': 'student',
                  'key': 'cQhV8EA3',
                  'type': 'folder',
                  'children': [
                    {
                      'label': 'dot',
                      'key': 'ohu0jLoM',
                      'type': 'folder',
                      'children': [
                        {
                          'label': 'demo-student.req.dto.ts',
                          'key': 'cDN9lCIY',
                          'type': 'file',
                          'code':
                            "import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'\nimport { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'\nimport { Transform } from 'class-transformer'\n\nimport { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'\nimport { BaseReqDto, disableEditFields } from '@/common/dtos/base.req.dto'\nimport { EnvHelper } from '@/utils/env-helper'\n\nexport class DemoStudentReqDto extends BaseReqDto {\n  @ApiProperty({ description: 'id主鍵' })\n  @IsNotEmpty()\n  @IsString()\n  id: string\n\n  @ApiProperty({ description: '姓名' })\n  @IsNotEmpty()\n  @IsString()\n  name: string\n\n  @ApiProperty({ description: '年齡' })\n  @IsOptional()\n  @IsNumber()\n  age: number\n\n  @ApiProperty({ description: '證件號碼' })\n  @IsOptional()\n  @IsString()\n  idCard: string\n}\n\nexport class CreateDemoStudentReqDto extends PartialType(\n  OmitType(DemoStudentReqDto, ['id', 'multilingualFields', ...disableEditFields]),\n) {}\n\nexport class FindDemoStudentReqDto extends PartialType(DemoStudentReqDto) {\n  @ApiProperty({ description: '分頁大小', example: 10, required: false })\n  @IsNotEmpty()\n  @Min(0)\n  @Max(EnvHelper.getNumber('MAX_PAGE_SIZE'))\n  pageSize?: number = 10\n\n  @ApiProperty({ description: '分頁頁碼', example: 1, required: false })\n  @IsNotEmpty()\n  @Min(0)\n  @Max(EnvHelper.getNumber('MAX_PAGE_NUMBER'))\n  currentPage?: number = 1\n}\n\nexport class UpdateDemoStudentReqDto extends PartialType(OmitType(DemoStudentReqDto, ['multilingualFields', ...disableEditFields])) {}\n",
                        },
                        {
                          'label': 'demo-student.res.dto.ts',
                          'key': 'MTdquwtP',
                          'type': 'file',
                          'code':
                            "import { PaginatedResponseDto, SingleResponseDto } from '@/utils/response-dto'\n\nexport class CreateDemoStudentResDto extends SingleResponseDto({\n  id: '100',\n}) {}\n\nexport class FindDemoStudentResDto extends PaginatedResponseDto({\n  id: '10001',\n  name: '香香',\n  age: '14',\n  idCard: '123456789012345678',\n\n  remark: 'remark',\n  status: 0,\n  isDeleted: 0,\n  creator: '-1',\n  createTime: '2025-03-14T04:50:19.000Z',\n  updater: null,\n  updateTime: null,\n}) {}\n",
                        },
                      ],
                    },
                    {
                      'label': 'demo-student.controller.ts',
                      'key': 'AYW6fXts',
                      'type': 'file',
                      'code':
                        "import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors, Req } from '@nestjs/common'\nimport { ApiOperation, ApiResponse } from '@nestjs/swagger'\nimport { Request } from 'express'\n\nimport { DemoStudentService } from './demo-student.service'\nimport { CreateDemoStudentReqDto, FindDemoStudentReqDto, UpdateDemoStudentReqDto } from './dto/demo-student.req.dto'\nimport { CreateDemoStudentResDto, FindDemoStudentResDto } from './dto/demo-student.res.dto'\n\nimport { TransformInterceptor } from '@/common/interceptors/transform.interceptor'\nimport { ResponseMessage } from '@/common/decorators/response-message.decorator'\nimport { MsgResponseDto } from '@/utils/response-dto'\nimport { HasPermission } from '@/common/decorators/has-permission.decorator'\nimport { ParseBigIntPipe } from '@/common/pipes/parse-bigInt-pipe'\n\n@Controller('/demo/student')\n@UseInterceptors(TransformInterceptor)\nexport class DemoStudentController {\n  constructor(private readonly demoStudentService: DemoStudentService) {}\n\n  @Post('/create')\n  @HasPermission('demo::create')\n  @ApiOperation({ summary: '建立學生' })\n  @ApiResponse({ type: CreateDemoStudentResDto })\n  @ResponseMessage('建立學生成功')\n  create(@Body() createDemoStudentReqDto: CreateDemoStudentReqDto) {\n    return this.demoStudentService.create(createDemoStudentReqDto)\n  }\n\n  @Get('/page')\n  @HasPermission('student::page')\n  @ApiOperation({ summary: '取得學生分頁列表' })\n  @ApiResponse({ type: FindDemoStudentResDto })\n  @ResponseMessage('取得學生分頁列表成功')\n  find(@Query() findDemoStudentReqDto: FindDemoStudentReqDto) {\n    return this.demoStudentService.find(findDemoStudentReqDto)\n  }\n\n  @Put('/update')\n  @HasPermission('student::update')\n  @ApiOperation({ summary: '更新學生' })\n  @ApiResponse({ type: MsgResponseDto() })\n  @ResponseMessage('更新學生成功')\n  update(@Body() updateDemoStudentReqDto: UpdateDemoStudentReqDto) {\n    return this.demoStudentService.update(updateDemoStudentReqDto)\n  }\n\n  @Delete('/delete/:id')\n  @HasPermission('student::delete')\n  @ApiOperation({ summary: '刪除學生' })\n  @ApiResponse({ type: MsgResponseDto() })\n  @ResponseMessage('刪除學生成功')\n  delete(@Param('id', ParseBigIntPipe) id: string) {\n    return this.demoStudentService.delete(id)\n  }\n\n  @Put('/block/:id')\n  @HasPermission('student::block')\n  @ApiOperation({ summary: '封鎖學生' })\n  @ApiResponse({ type: MsgResponseDto() })\n  @ResponseMessage('封鎖學生成功')\n  block(@Param('id', ParseBigIntPipe) id: string) {\n    return this.demoStudentService.block(id)\n  }\n\n  @Put('/unblock/:id')\n  @HasPermission('student::unblock')\n  @ApiOperation({ summary: '解封鎖學生' })\n  @ApiResponse({ type: MsgResponseDto() })\n  @ResponseMessage('解封鎖學生成功')\n  unblock(@Param('id', ParseBigIntPipe) id: string) {\n    return this.demoStudentService.unblock(id)\n  }\n}\n",
                    },
                    {
                      'label': 'demo-student.module.ts',
                      'key': 'ZDxJ0oU6',
                      'type': 'file',
                      'code':
                        "import { Module } from '@nestjs/common'\nimport { TypeOrmModule } from '@nestjs/typeorm'\n\nimport { DemoStudentController } from './demo-student.controller'\nimport { DemoStudentService } from './demo-student.service'\nimport { DemoStudentEntity } from './entity/demo-student.entity'\n\n@Module({\n  imports: [TypeOrmModule.forFeature([DemoStudentEntity])],\n  controllers: [DemoStudentController],\n  providers: [DemoStudentService],\n  exports: [DemoStudentService],\n})\nexport class DemoStudentModule {}\n",
                    },
                    {
                      'label': 'demo-student.service.ts',
                      'key': 'msX4cVOW',
                      'type': 'file',
                      'code':
                        "import { Injectable } from '@nestjs/common'\nimport { InjectRepository } from '@nestjs/typeorm'\nimport { Repository } from 'typeorm'\n\nimport { DemoStudentEntity } from './entity/demo-student.entity'\nimport { CreateDemoStudentReqDto, FindDemoStudentReqDto, UpdateDemoStudentReqDto } from './dto/demo-student.req.dto'\n\nimport { create, find, update, _delete } from '@/common/services/base.service'\n\n@Injectable()\nexport class DemoStudentService {\n  constructor(\n    @InjectRepository(DemoStudentEntity)\n    private readonly demoStudentRepository: Repository<DemoStudentEntity>,\n  ) {}\n\n  // 新增學生\n  async create(createDemoStudentReqDto: CreateDemoStudentReqDto) {\n    const result = await create({\n      dto: createDemoStudentReqDto,\n      repository: this.demoStudentRepository,\n      modalName: '學生',\n    })\n\n    return { id: result.id }\n  }\n\n  // 查詢學生\n  async find(findDemoStudentReqDto: FindDemoStudentReqDto) {\n    const { list, total } = await find({\n      dto: findDemoStudentReqDto,\n      repository: this.demoStudentRepository,\n      where: {\n        isDeleted: 0,\n      },\n    })\n\n    return {\n      total,\n      list,\n    }\n  }\n\n  // 更新學生\n  async update(updateDemoStudentReqDto: UpdateDemoStudentReqDto) {\n    await update({\n      dto: updateDemoStudentReqDto,\n      repository: this.demoStudentRepository,\n      existenceCondition: ['id'],\n      modalName: '學生',\n    })\n  }\n\n  // 刪除學生\n  async delete(id: string) {\n    await _delete({\n      id,\n      repository: this.demoStudentRepository,\n      modalName: '學生',\n    })\n  }\n\n  // 封鎖學生\n  async block(id: string) {\n    await update({\n      dto: { id, status: 0 },\n      repository: this.demoStudentRepository,\n      existenceCondition: ['id'],\n      modalName: '學生',\n    })\n  }\n\n  // 解封鎖學生\n  async unblock(id: string) {\n    await update({\n      dto: { id, status: 1 },\n      repository: this.demoStudentRepository,\n      existenceCondition: ['id'],\n      modalName: '學生',\n    })\n  }\n}\n",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}) {}

export class GetEntityAllFieldsResDto extends SingleResponseDto({
  'id': {
    'label': 'id主鍵',
    'type': 'string',
    'nullable': false,
  },
  'name': {
    'label': '姓名',
    'type': 'string',
    'nullable': false,
  },
  'age': {
    'label': '年齡',
    'type': 'number',
    'nullable': true,
  },
  'idCard': {
    'label': '證件號碼',
    'type': 'string',
    'nullable': true,
  },
}) {}
