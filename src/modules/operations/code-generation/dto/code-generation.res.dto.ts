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
