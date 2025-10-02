import { CodeGenerationModule } from './platform-api/operations/code-generation/code-generation.module'
import { FileModule } from './platform-api/operations/file/file.module'
import { ScriptExecutionLogModule } from './platform-api/operations/script-execution-log/script-execution-log.module'

/**
 * 操作模組配置
 * 包含代碼生成、文件管理、腳本執行等業務操作模組
 */
export const operationsModules: any[] = [CodeGenerationModule, FileModule, ScriptExecutionLogModule]
