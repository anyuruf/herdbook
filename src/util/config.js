
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'


export default function getConfig() {

	let config = null

	if (process.argv.length > 2) {
		let configPath = process.argv[2]
		if (fs.existsSync(configPath)) {
			config = fs.readFileSync(configPath).toString()
			addMeta(config, configPath)
		}
	}

	if (!config) {
		let configPath = path.join(process.cwd(), "config.yaml")
		if (fs.existsSync(configPath)) {
      config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'))
			addMeta(config, configPath)
		}
	}

	if (!config) {
		let configPath = path.join(process.cwd(), "config.json")
		if (fs.existsSync(configPath)) {
			config = fs.readFileSync(configPath).toString()
			addMeta(config, configPath)
		}
	}

	return config
}


function addMeta(config, path) {
	config.meta = config.meta || {}
	config.meta.path = path
}