import assert from 'assert'
import fs from 'fs'
import os from 'os'
import yaml from 'js-yaml'

const configFile = expandTilde(process.env.GITLAB_RADIATOR_CONFIG || '~/.gitlab-radiator.yml')
const yamlContent = fs.readFileSync(configFile, 'utf8')
export const config = validate(yaml.safeLoad(yamlContent))

config.interval = Number(config.interval || 10) * 1000
config.port = Number(config.port || 3000)
config.zoom = Number(config.zoom || 1.0)
config.ca = config.caFile && fs.existsSync(config.caFile, 'utf-8') ? fs.readFileSync(config.caFile) : undefined

function expandTilde(path) {
  return path.replace(/^~($|\/|\\)/, `${os.homedir()}$1`)
}

function validate(config) {
  assert.ok(config.gitlab, 'Mandatory gitlab properties missing from configuration file')
  assert.ok(config.gitlab.url, 'Mandatory gitlab url missing from configuration file')
  assert.ok(config.gitlab['access-token'], 'Mandatory gitlab access token missing from configuration file')
  return config
}
