import { ComponentLoader } from 'adminjs'
import path from 'path'

const componentLoader = new ComponentLoader()

const Components = {
    ArcansList: componentLoader.add('ArcansList', path.join(process.cwd(), "src", "ArcansList.jsx")),
    // other custom components
}

export { componentLoader, Components }