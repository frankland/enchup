module.exports = {
  'err': '{message}:red',

  'setup.dir.exists': 'Config already exists. Add -f flag if you want to override it.',
  'setup.clone.start': 'Setup skeleton from {repo}:green to {dir}:green',
  'setup.clone.finish': 'Enchup structure was cloned successfully',
  'setup.clone.error': 'Git clone error',

  'info.name': 'name - {name}:green',
  'info.author': 'author - {author}:yellow',
  'info.version': 'version - {version}:green',
  'info.description': 'description - {description}:green',
  'info.readme': 'readme - {readme}:green',

  'config.no-components': 'components are not defined',
  'config.no-file': 'Enchup file ({file}:underline) does not exist',

  'generate.info.init': '{Information about rjs plugins}:green',
  'generate.no-components': 'Components are not defined at enchup config',
  'generate.save.error': 'Can not save plugin - {name}:underline',
  'generate.save.success': 'Generated plugin - {name}:green',

  'create.no-component': 'Component {component}:underline does not exist',
  'create.wrong-format': 'Wrong component format',
  'create.wrong-config': 'Wrong component config',
  'create.cannot-create-dir': 'Can not create dir {dir}:underline',
  'create.no-force': 'Component already exists. If you want to override use -f flag',
  'create.success': 'Component {component}:green created using {template}:yellow template. Component path: {path}:underline',

  'templates.does-not-exist': 'Template does not exist'
};