<div align="center">
<img src="https://s2.loli.net/2025/09/27/rN84dp3uh1TWBlJ.png" style="width:150px"/>
<h1>UK2 Admin Nest</h1>
</div>
<div align="center">
<img src="https://img.shields.io/github/license/akizono/uk2-admin"/>
<img src="https://badgen.net/github/stars/akizono/uk2-admin?icon=github"/>
<img src="https://img.shields.io/github/forks/akizono/uk2-admin"/>
</div>

<div align='center'>

  English |  [Traditional Chinese](./README.zh-TW.md)
</div>

# introduce

## Project Introduction

based on`Nest.js` + `TypeScript` + `TypeORM` + `MySQL`A modern Node.js management system backend built to provide API support for UK2-admin (front-end project).

Integrate Swagger file automatic generation, operation log tracking, and supports dynamic column multilingual configuration, ready for use out of the box.

## Project description

This project is the backend part of UK2-admin.

Current development progress:

| Development Status | Functions | Description |
| ------ | -------- | ------------------------------------------------------------ |
| ✅ | User Management | The user is the system operator, and this function mainly completes the system user configuration |
| ✅ | Department Management | Configure the system organization (company, department, group), and the tree structure displays support data permissions |
| ✅ | Dictionary Management | Maintain some more fixed data that is often used in the system |
| ✅ | Operation log | System normal operation log recording and query, integrated Swagger to generate log content |
| ✅ | Menu Management | Configure system menus, operation permissions, button permissions identification, etc., local cache provides performance |
| ✅ | Role Management | Role menu permission allocation, setting roles to divide data scope permissions by institution |
| ✅ | Column internationalization | Any column of a data table can be internationalized |
| ✅ | Swagger | Integrated Swagger Generate API Files |
| ❌ | Code generation | Generate corresponding addition, deletion, modification and search code according to the database table structure, and generate the front-end page |
| ❌ | Redis | Integrated Redis Cache Data |
| ❌ | Notices and Announcements | System Notices and Announcements Information Release and Maintenance |
| ❌ | Site message | Message notifications within the system, providing in-site message templates and in-site message messages |

# Quick Start

:::tip
Before starting the project, make sure your development environment is installed[Node.js](../../dev/nodejs)and[MySQL](../../dev/mysql)

Follow the steps below to complete the environment configuration and project launch to ensure that the development environment is fast and ready.
:::

## initialization[MySQL](../../dev/mysql)

### 1. MySQL service starts

This project uses MySQL as a data storage solution, please make sure it is installed and started correctly[MySQL](../../dev/mysql)Database services.

### 2. Development database creation

Create a library dedicated to the development environment in MySQL, named`uk2_admin_dev`(The name can be customized according to actual needs).

### 3. Database initialization script execution

Execute the database initialization script provided by the project to complete the creation of basic data structures and import of basic data

- **Script Path**: sql/uk2_admin_dev.sql

- **Precautions**: This script supports execution in different database name environments and does not need to be strictly consistent with the database name in the configuration.

### 4. **Database connection configuration**

Modify the development environment settings file in the root directory`env.dev`, configure the correct database connection parameters.
```shell
# 資料庫類型，不需要修改
DB_TYPE = 'mysql'

# 資料庫地址
DB_HOST = '127.0.0.1'

# 資料庫埠
DB_PORT = 3306

# 資料庫名稱
DB_NAME = 'uk2_admin_dev'

# 資料庫使用者名稱
DB_USERNAME = 'root'

# 資料庫密碼
DB_PASSWORD = '123456'
```
:::tip
1. Parameter DB_TYPE is a fixed value, no modification is required

2. If you use a non-default database name in step 2, make sure that the DB_NAME parameter is exactly the same as the database name you actually created.

3. When deploying a production environment, be sure to modify the preset database credentials to adopt a safer authentication method.
:::

## Start a special project

### Copy project

Please go to the directory where you want to install the project and execute the following Git command on the terminal to obtain the project original code:

```shell
git clone https://github.com/akizono/uk2-admin-nest.git
```

### Dependency kit installation
After entering the project directory, it is recommended to use pnpm to install the dependency kit (if pnpm is not installed, you can also use npm instead)

:::code-group
```shell[pnpm]
cd ./uk2-admin-nest
pnpm install
```
```shell[npm]
cd ./uk2-admin-nest
npm install
```
:::

### Project launch

1. use[VSCode](https://code.visualstudio.com/)Open the project root directory uk2-admin-nest

2. Execute the development startup command through the built-in terminal:
:::code-group
```shell[pnpm]
pnpm start:dev
```
```shell[npm]
npm run start:dev
```
:::

# Related projects

- [UK2-admin](https://github.com/akizono/uk2-admin)UK2-Admin-Nest Supporting Web Project

# contribute

If you find any issues or have suggestions for improvement, please create one[issue](uk2-admin-nest/issues/new)Or submit a PR. We welcome your contribution!

# protocol

[MIT](LICENSE)