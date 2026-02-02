import Metalsmith from 'metalsmith'
import defaultValues from '../lib'

type File = Metalsmith.File<{
  layout?: string
  draft?: boolean
}>

type Meta = {
  buildVersion: string
}

defaultValues<File>({
  strategy: 'overwrite',
  pattern: '**/*.html',
  defaults: {
    excerpt(file) {
      return file.contents.toString().slice(0, 250) + '...'
    },
    buildVersion(_, path, files, metalsmith) {
      files[path].contents
      const meta = metalsmith.metadata() as Meta
      return meta.buildVersion
    },
    draft(file) {
      return file.draft
    },
    layout: 'default.njk'
  }
})