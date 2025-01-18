import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, BaseEntity } from 'typeorm'
import { requestContext } from '@/utils/request-context'

/** 定義基礎實體介面 */
interface BaseEntityWithUser {
  creator?: string
  updater?: string
}

/** 全局實體事件訂閱器 */
@EventSubscriber()
export class GlobalSubscriber implements EntitySubscriberInterface<BaseEntity & BaseEntityWithUser> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this)
  }

  /**
   * 獲取當前登入使用者的ID
   * @returns 當前使用者的ID 或 undefined
   */
  private getCurrentUserId(): string | undefined {
    const { request } = requestContext.getStore()
    return request['user']?.sub
  }

  /**
   * 設置使用者相關列的值
   * @param event 實體事件對象
   * @param columnName 要設置的列名(creator或updater)
   */
  private setUserColumn<T extends BaseEntity & BaseEntityWithUser>(
    event: InsertEvent<T> | UpdateEvent<T>,
    columnName: keyof BaseEntityWithUser,
  ) {
    const currentUserId = this.getCurrentUserId()
    const metadata = event.metadata
    const hasColumn = metadata.columns.some(column => column.propertyName === columnName)
    if (hasColumn) {
      event.entity[columnName] = currentUserId
    }
  }

  beforeInsert<T extends BaseEntity & BaseEntityWithUser>(event: InsertEvent<T>) {
    // 如果資料表存在 creator(建立者) 欄位，則填入當前使用者ID
    this.setUserColumn(event, 'creator')
  }

  beforeUpdate<T extends BaseEntity & BaseEntityWithUser>(event: UpdateEvent<T>) {
    // 如果資料表存在 updater(更新人) 欄位，則填入當前使用者ID
    this.setUserColumn(event, 'updater')
  }

  /** 刪除實體前的hook */
  // beforeRemove(event: RemoveEvent<any>) {
  //   console.log(`BEFORE ENTITY REMOVED:`, {
  //     entity: event.entity.constructor.name,
  //     data: event.entity,
  //   })
  // }
}
