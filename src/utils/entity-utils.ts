import { EntityTarget, getMetadataArgsStorage } from 'typeorm'
import { Repository } from 'typeorm'

/**
 * 獲取實體類中屬性的列定義資訊
 * @param entity 實體類
 * @param propertyName 屬性名稱
 * @returns 屬性的列定義資訊
 */
export function getColumnDefinition(entity: EntityTarget<any>, propertyName: string) {
  const storage = getMetadataArgsStorage()
  const columns = storage.columns.filter(column => column.target === entity && column.propertyName === propertyName)

  if (columns.length === 0) {
    return null
  }

  return columns[0].options
}

/**
 * 獲取實體類中屬性的完整資訊（包含屬性名稱和列定義）
 * @param entity 實體類
 * @param propertyName 屬性名稱
 * @returns 屬性的完整資訊
 */
export function getPropertyInfo(entity: EntityTarget<any>, propertyName: string) {
  const columnDefinition = getColumnDefinition(entity, propertyName)

  if (!columnDefinition) {
    return null
  }

  return {
    propertyName,
    ...columnDefinition,
  }
}

/**
 * 獲取類別的所有父類
 * @param entityClass 實體類
 * @returns 父類陣列
 */
function getParentClasses(entityClass: any): any[] {
  const parents = []
  let currentClass = Object.getPrototypeOf(entityClass)

  while (currentClass && currentClass.name) {
    parents.push(currentClass)
    currentClass = Object.getPrototypeOf(currentClass)
  }

  return parents
}

/**
 * 獲取實體屬性的完整定義（包含繼承的屬性）
 * @param entityClass 實體類
 * @param propertyName 屬性名稱
 * @returns 屬性的完整定義資訊或 null
 */
export function getEntityColumnMetadata(
  entityClass: any,
  propertyName: string,
): {
  propertyName: string
  name?: string
  type: any
  comment?: string
  default?: any
  nullable?: boolean
  [key: string]: any
} | null {
  try {
    if (typeof entityClass === 'function') {
      const storage = getMetadataArgsStorage()

      // 獲取所有父類
      const allClasses = [entityClass, ...getParentClasses(entityClass)]

      // 在所有類中尋找屬性定義
      for (const targetClass of allClasses) {
        const columnMetadata = storage.columns.find(
          column => column.target === targetClass && column.propertyName === propertyName,
        )

        if (columnMetadata) {
          const columnOptions = columnMetadata.options || {}
          return {
            propertyName,
            name: columnOptions.name,
            type: columnOptions.type,
            comment: columnOptions.comment,
            default: columnOptions.default,
            nullable: columnOptions.nullable,
            ...columnOptions,
          }
        }
      }

      return null
    } else {
      return null
    }
  } catch (error) {
    console.error('獲取實體屬性元數據失敗:', error)
    return null
  }
}

/**
 * 直接從 entity 中獲取屬性的裝飾器設定
 * @param entity 實體類
 * @param propertyName 屬性名稱
 * @returns 裝飾器設定資訊
 */
export function getEntityPropertyDecorator(entity: EntityTarget<any>, propertyName: string) {
  try {
    const columnInfo = getColumnDefinition(entity, propertyName)

    if (columnInfo) {
      return {
        propertyName,
        name: columnInfo.name,
        type: columnInfo.type,
        comment: columnInfo.comment,
        default: columnInfo.default,
        nullable: columnInfo.nullable,
      }
    }

    return {
      propertyName,
      message: '無法獲取該屬性的裝飾器設定',
    }
  } catch (error) {
    console.error('獲取屬性裝飾器設定失敗:', error)
    return null
  }
}

/**
 * 將 dto 中「非空」的欄位設為預設值
 * @param dto 需要填充預設值的 DTO
 * @param repository 實體類的 Repository
 * @returns 填充預設值後的 DTO
 */
export function fillNonEmptyWithDefaults(dto: Record<string, any>, repository: Repository<any>) {
  const columnMetadataMap = new Map()
  for (const key in dto) {
    try {
      const metadata = getEntityColumnMetadata(repository.target, key)
      if (metadata) {
        columnMetadataMap.set(key, metadata)
      }
    } catch (error) {
      console.error(`獲取 ${key} 欄位定義失敗:`, error)
    }
  }
  columnMetadataMap.forEach((metadata, key) => {
    if (!dto[key] && !metadata.nullable && metadata.default !== undefined) {
      dto[key] = metadata.default
    }
  })
  return dto
}
