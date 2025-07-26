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

  // 實體類生成器
  plop.setGenerator('entity', {
    description: '生成數據表的實體類',
    prompts: [
      {
        type: 'input',
        name: 'jsonInput',
        message: 'hint::請輸入JSON配置::', // 例: {"timestamp":"1753178585901","className":"DemoStudentEntity","fileName":"demo-student","splitName":["demo","student"],"tableName":"demo_student","tableColumns":[{"columnNameUnderline":"id","jsDataType":"string","columnName":"id","dataType":"bigint","length":null,"isNotNull":1,"isAutoIncrement":1,"isPrimaryKey":1,"isUnique":1,"defaultValue":null,"comment":"id主鍵"},{"columnNameUnderline":"name","jsDataType":"string","columnName":"name","dataType":"varchar","length":55,"isNotNull":1,"isAutoIncrement":0,"isPrimaryKey":0,"isUnique":0,"defaultValue":null,"comment":"姓名"},{"columnNameUnderline":"age","jsDataType":"number","columnName":"age","dataType":"int","length":null,"isNotNull":0,"isAutoIncrement":0,"isPrimaryKey":0,"isUnique":0,"defaultValue":"12","comment":"年齡"},{"columnNameUnderline":"id_card","jsDataType":"string","columnName":"idCard","dataType":"varchar","length":55,"isNotNull":0,"isAutoIncrement":0,"isPrimaryKey":0,"isUnique":1,"defaultValue":null,"comment":"證件號碼"}]}
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
          path: `plop-templates/.cache/${config.fileName}-${config.timestamp}`,
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

  // 後端代碼生成器
  plop.setGenerator('backend-code', {
    description: '生成後端代碼',
    prompts: [
      {
        type: 'input',
        name: 'jsonInput',
        message: 'hint::請輸入JSON配置::', // {"fileName":"demo-student","camelName":"demoStudent","timestamp":"1753369205113","splitName":["demo","student"],"classNamePrefix":"DemoStudent","exampleData":{"id":"10001","name":"香香","age":14,"idCard":"344422121221"},"unitName":"學生","columns":{"id":{"label":"id主鍵","type":"string","nullable":false},"name":{"label":"姓名","type":"string","nullable":false},"age":{"label":"年齡","type":"number","nullable":true},"idCard":{"label":"證件號碼","type":"string","nullable":true}}}
      },
    ],
    actions: function (data) {
      const config = JSON.parse(data.jsonInput)

      return [
        {
          type: 'add',
          path: `plop-templates/.cache/${config.fileName}-${config.timestamp}`,
          templateFile: 'plop-templates/backend-code.hbs',
          data: {
            ...config,
          },
        },
      ]
    },
  })
}
