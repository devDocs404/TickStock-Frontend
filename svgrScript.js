// svgrScript.js
import { execSync } from 'child_process'
import { readdirSync, renameSync, rmSync } from 'fs'
import path from 'path'

// Step 1: Delete the src/components/svg directory
const svgComponentsDir = path.join(process.cwd(), 'src/components/svg')

try {
  rmSync(svgComponentsDir, { recursive: true, force: true })
  console.log(`Deleted: ${svgComponentsDir}`)
} catch (error) {
  console.error(`Error deleting ${svgComponentsDir}:`, error)
}

// Step 2: Run the svgr command
const svgrCommand = `svgr --icon --title-prop --replace-attr-values #00D8FF=currentColor --out-dir src/components/svg src/assets`

try {
  execSync(svgrCommand, { stdio: 'inherit' })
  console.log('SVG components generated successfully!')
} catch (error) {
  console.error('Error running SVGR command:', error)
}

// Step 3: Rename .js files to .jsx in the generated directory
try {
  const files = readdirSync(svgComponentsDir)

  files.forEach(file => {
    const filePath = path.join(svgComponentsDir, file)
    if (file.endsWith('.js')) {
      const newFilePath = path.join(
        svgComponentsDir,
        file.replace('.js', '.jsx'),
      )
      renameSync(filePath, newFilePath)
      console.log(`Renamed: ${file} to ${file.replace('.js', '.jsx')}`)
    }
  })

  console.log('Renaming completed!')
} catch (error) {
  console.error('Error renaming files:', error)
}
