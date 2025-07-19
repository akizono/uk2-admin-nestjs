module.exports = function (plop) {
  // 添加自訂helper
  plop.setHelper('eq', function (a, b) {
    return a === b
  })

  plop.setHelper('parseJson', function (jsonString) {
    try {
      return JSON.parse(jsonString)
    } catch {
      return {}
    }
  })

  // 數據表實體類生成器 - JSON輸入模式
  plop.setGenerator('entity', {
    description: '生成數據表的實體類',
    prompts: [
      {
        type: 'input',
        name: 'jsonInput',
        message: 'hint::請輸入JSON配置::', // 例: {"className":"DemoStudentEntity", "fileName":1721433600000,"tableName":"demo_student","tableColumns":[{"columnName":"姓名","dataType":"VARCHAR","length":55,"isNotNull":1,"isAutoIncrement":0,"isPrimaryKey":0,"isUnique":0,"defaultValue":null,"comment":"姓名"}]}
      },
    ],
    actions: function (data) {
      const config = JSON.parse(data.jsonInput)

      // 檢查是否需要導入各種裝飾器
      let hasColumn = false
      let hasPrimaryGeneratedColumn = false
      let hasPrimaryColumn = false

      if (config.tableColumns && Array.isArray(config.tableColumns)) {
        for (const column of config.tableColumns) {
          if (column.isPrimaryKey === 1) {
            if (column.isAutoIncrement === 1) {
              hasPrimaryGeneratedColumn = true
            } else {
              hasPrimaryColumn = true
            }
          } else {
            hasColumn = true
          }
        }
      }

      return [
        {
          type: 'add',
          path: `plop-templates/.cache/${config.fileName}`,
          templateFile: 'plop-templates/entity.hbs',
          data: {
            ...config,
            hasColumn,
            hasPrimaryGeneratedColumn,
            hasPrimaryColumn,
          },
        },
      ]
    },
  })
}
