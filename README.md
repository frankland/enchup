# Enchup

## 1. Overview

Easy way to setup application and scripts files according to templates.

```
npm install -g enchup
```

Available commands:

 - init [repository]
 - setup [repository]
 - info [component]
 - create <component> <parameters> [template]


## 2. Init

Using default repository (for init default repo is not set).

```
enchup init
```
Or from gh repository (gh username/repository)
```
enchup init [repository]
```


Initailze application. Current dir should be empty.


## 3. Setup

```
enchup setup
```
Or from gh repository (gh username/repository)
```
enchup setup [repository]
```


Important:
Default repository not looks good right now and it will be updated asap.


Setup enchup config and script's templates. Could be used at already existing application. If enchup has been already setuped - enchup will ask to add force (-f) flag. Old configs will be backuped and templates will not be overriden but if there are new templates in repository - they will be downloaded.


## 4. Info

```
enchup info
```

Show info about current enchup config.

```
enchup info [component]
```
Show info about component:

  - component's path
  - component's placeholder map
  - provided placeholders
  - dependencies


## 5. Create

```
create <component> <parameters> [template]
```

Create component according to parameters and templates.
For exaple in enchup config:

```yml
controller: /app/:screen/controllers/:controller/:controller.js

template:
  map: module:controller
  paths: /app/:screen/controllers/:controller/:controller.html

screen:
  map: screen:ontroller
  components:
    - controller
    - template
```

Here is 3 components - `controller`, `template` and `screen`.
To get additional info in console: `enchup info screen`

```
ecnhup create controller users:profile
```
Will resolve controller paths as `/app/users/controllers/profile/profile.js` and create with default template.

```
ecnhup create controller users:profile admin
```
Will resolve controller paths as `/app/users/controllers/profile/profile.js` and create with **admin** template.

```
ecnhup create screen users:profile
```
Will resolve controller and template components.



## 6. Component config

Available options:

```yml

app: /src/application

controller:
  map: screen:name
  path: ^app/:screen/:module/:controller/:name.js # will resolve path according to `app` component
                                                  # if `app` in not a directory - will be used its dirname
  template: admin # set template for component. But if you set template at console command - it will be used
  provide:
    module: users # will create `controller` placeholder with `users`
    controller: :name # will create `controller` placeholder with same value as placeholder `foo`
  components:
    - template:admin # tempalte components will be created with `admin` template
    
partial:
  map: screen:module:controller
  path: ^controller/partial.html # will be resolved as /src/application/:screen/:module/:controller/partial.html
```

Simple configuration:

```yml
controller: /application/:module/:controller/:bar/:baz.js
```
Placeholders will be calculated automatically


## 7. File system

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
 - enchup/tempaltes/repo - templates that donwloaded from repository.  Will not be overriden if you user `enchup setup` on existing application
 - enchup/templates/app -application templates. Will **not** be overriden if you user `enchup setup` on existing application


## 8. Templates

Enchup trying to find tempalate in `/enchup/templates/app/<component>/<template>` and if there is no - it try to find and repo templates - `/enchup/templates/repo/<component>/<template>`

enchup/templates/repo/controller/default.js

```js
/**
* @date {{ date }}
* @version {{ version }}
* @application {{ application }}
* @author {{ author }}
*/
import { Controller } from 'ngx';

class Scope {
  constructor(){
    
  }
}



Controller('{{ screen }}.{{ controller }}')
.route('/')
.src(new Scope());
```  

Placeholders also could be used in templates. They should be wrapped with {{ }}.
Also `paramters` object form `enchup.yml` and all from `user-enchup.yml` will be available as placeholders in templtes.

## 9. user-enchup.yml

This is just user's enchup config that should be igored by vcs. Need for user's paramaters such as: @name, @email, @homepage etc.
                                    
                                    
                                    
