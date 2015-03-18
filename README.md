# Enchup

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/frankland/enchup?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

- [Enchup](#enchup)
- [1. Overview](#1-overview)
- [2. Commands](#2-commands)
- [2.1 Setup](#21-setup)
- [2.2 Init](#22-init)
- [2.3 Info](#23-info)
- [2.4 Create](#24-create)
- [3. Enchup file system](#3-enchup-file-system)
- [4. Enchup config: enchup.yml](#4-enchup-config-enchupyml)
- [4.1 Config overview](#41-config-overview)
- [4.2 Parameters](#42-parameters)
- [4.3 Base](#-43-base)
- [4.4 Components](#44-components)
- [5. Custom config: user-enchup.yml](#5-custom-config-user-enchupyml)
- [6. Templates](#6-templates)
- [6.1 Overview](#61-overview)
- [6.2 Example](#62-example)
- [7. Future plans](#7-future-plans)
- [8. Yo](#8-yo)


## 1. Overview
Easy way to setup application and provide commands to create scripts (components) according to templates and config.
```
npm install -g enchup
```

Available commands:

 - setup [options] [repository]
 - init [repository]
 - info [component]
 - create [options] <component> <parameters> [template]


## 2. Commands
### 2.1 Setup
Setup enchup config and templates form repository. If repository is not set - default is using.
Default repository [frankland/enchup-js-app](http://github.com/frankland/enchup-js-app)
```
enchup setup
```

Or using custom repository. There are only github repositories. Using format - %username%/%reponame%
```
enchup setup frankland/enchup-angular-app
```

Flags:

 - -f --force - clean and backup configs and remove templates before setup if they already exists


Could be used at already existing application.

### 2.2 Init
Initialize application to current directory. Similar to `git clone [repository]` but remove .git  after cloning.
Directory should be empty.
If repository is not set - default is using.
Default repository [frankland/valent-boilerplate](http://github.com/frankland/valent-boilerplate)
```
enchup init
```

Or using custom repository. There are only github repositories. Using format - %username%/%reponame%
```
enchup init [repository]
```

### 2.3 Info
Show all available components or information about certain component: path, parameters map and components list.
```
enchup info
enchup info [component]
```



### 2.4 Create
Create components according to enchup config and templates. All components are described at enchup.yml.
```
create <component> <parameters> [template]
```

Flags:

 - -f --force - override components if already exists
 - -c --continue - do not override existing components. Important for components that includes other components

For additional information about component use `enchup info [component]`

## 3. Enchup file system

     |-enchup/
        |-enchup.yml
        |-user-enchup.yml
        |
        |-templates/
                   |-repo/
                   |     |-controller/
                   |     |           |-default.js
                   |     |           |-admin.js
                   |     |-template/
                   |               |-default.html
                   |
                   |-app/
                        |-controller/
                        |           |-default.js
                        |-template/
                                  |-default.html


 - enchup/enchup.yml - main config
 - enchup/user-enchup.yml - user enchup config. Should be ignored by cvs
 - enchup/tempaltes/repo - templates that donwloaded from repository.  Will be overriden if you use `enchup setup` on existing application
 - enchup/templates/app - application templates. Will **not** be overriden if you user `enchup setup` on existing application


## 4. Enchup config: enchup.yml
## 4.1 Config overview
There are three main blocks at enchup.yml:

 - parameters
 - base
 - components


## 4.2 Parameters
Any data that will be available for template rendering.

## 4.3 Base
Base path for all components

## 4.4 Components
Array of components that could be created by enchup.

For example:

```yml

base: /src/js
components:
  controller: /:screen/controllers/:controller.js
  view: /:screen/view/:view.html

  screen:
    map: screen:controller:route
    components:
      - controller
      - view

  landing:
    map: screen:controller:route
    provide:
        controller: :screen
    components:
      - controller
      - template:landing
```

Components could be described as string or object.
At example above:
 - controller - described as string where all parameters are in path
 - screen - described as object.

Options for definition as object are:

 - map - parameters that should be described when run `enchup create` command
 - path - component path
 - components - list of the components and its template that also will be created
 - provide - additional parameters list. Could be added as constants or links for specified parameters

Run `enchup info [component]` to get detailed info about how to create component.

```
enchup create controller user:profile
```
Will create script /**user**/controllers/**profile**.js with controller's default template /enchup/templates/**app**/controller/default.js or if not exist
will check /enchup/templates/**repo**/controller/default.js.

<p align="center">
  <img src="http://habrastorage.org/files/93a/8a1/935/93a8a1935c6843b99d7dc628a8790b95.png" alt="enchup info controller"/>
</p>

```
enchup create screen user:profile:/profile.html
```
Will create scripts:
 - /**user**/controllers/**profile**.js with controller's default template /enchup/templates/**app**/controller/default.js or if not exist
will check `/enchup/templates/**repo**/controller/default.js`.
 - /**user**/templates/**profile**.html with default view's default template /enchup/templates/**app**/view/default.html or if not exist
 will check `/enchup/templates/**repo**/view/default.html`.

<p align="center">
  <img src="http://habrastorage.org/files/10b/bd5/ae0/10bbd5ae0e6741dfad1a31f35846c438.png" alt="enchup info screen"/>
</p>

```
enchup create landing frankland:/frankland.html
```
Will create scripts:
 - /**frankland**/controllers/**frankland**.js with controller's default template /enchup/templates/**app**/controller/default.js or if not exist
will check `/enchup/templates/**repo**/controller/default.js`.
 - /**frankland**/view/**frankland**.html with template **landing** /enchup/templates/**app**/view/landing.html or if not exist
 will check /enchup/templates/**repo**/view/landing.html.

<p align="center">
  <img src="http://habrastorage.org/files/7cc/32b/9b4/7cc32b9b4dc24eacb9494992edba0108.png" alt="enchup info landing"/>
</p>

## 5. Custom config: user-enchup.yml
This is just user's enchup config that should be ignored by vcs. Need for developers's paramaters such as: {{ name }},  {{ email }},
{{ homepage }} etc.


## 6. Templates
### 6.1 Overview
Enchup is trying to find tempalate at `/enchup/templates/app/<component>/<template>` but if there is no - it check repo directory - `/enchup/templates/repo/<component>/<template>`

[Handlebars]([https://github.com/wycats/handlebars.js/) is using for template rendering. There are available few helpers:

 - ucfirst - lowercase expression's value and uppercase first word
 - uppercase - uppercase expression's value
 - lowercase - lowercase expression's value
 - tail - split expression's value by '/' symbol and use last one.
 For example:
 You have component `controller` that is described as `controller: /app/controllers/:screen/:controller` and you use command
 `enchup create controller user:profile/friends`
 In this case template **"{{ tail controller }}"** will be rendered as "friends"
 and **"{{ ucfirst (tail controller }})"** will be rendered as "Friends"

All components parameters are available at template. And there is one always existing parameter - {{ date }}.

Also there are `parameters` object form `enchup.yml` and all from `user-enchup.yml` available at templates.

### 6.2 Example
According to this config:
```yml
components:
  controller: /:screen/controllers/:controller.js
```
and this template:

```handlebars
/**
 * @date {{ date }}
 * @author {{ author }}
 * @version {{ version }}
 * @application {{ application }}
 */
import BaseController from 'valent/base/controller';
import { Controller } from 'valent';
import {{ ucfirst (tail controller) }}Template from './{{ tail controller }}.html';

class {{ ucfirst (tail controller) }}Controller extends BaseController  {
  constructor(Scope) {
    super(Scope);
  }

  getName() {
    return '{{ screen }}.{{ controller }}';
  }
}


Controller('{{ screen }}.{{ controller }}')
  .route('{{ screen }}/{{ tail controller }}.html')
  .template({{ ucfirst (tail controller) }}Template)
  .src({{ ucfirst (tail controller) }}Controller);
```

and this command:
```
enchup create controller user:profile
```

Enchup will create this script:

```js
/**
 * @date 2015-03-18 11:45:10
 * @author tuchk4
 * @version
 * @application
 */
import BaseController from 'valent/base/controller';
import { Controller } from 'valent';
import ProfileTemplate from './profile.html';

class ProfileController extends BaseController  {
  constructor(Scope) {
    super(Scope);
  }

  getName() {
    return 'user.profile';
  }
}


Controller('user.profile')
  .route('/user/profile.html')
  .template(Template)
  .src(ProfileController);
```


## 7. Future plans

- rewrite code on ES6
- add `-d --dry-run` option
- think again about enchup functions: remove unneeded and add more useful
- bug fixing

## 8. Yo
You are welcome for contributing and bug reporting :) Help to make enchup better <3
Also you are welcome to any questions and discussing at glitter chat.
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/frankland/enchup?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
