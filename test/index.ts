import Metalsmith from 'metalsmith'
import defaultValues from '../lib'

type File = Metalsmith.File<{
  layout?: string
  draft?: boolean
}>

defaultValues<File, { buildVersion: 'v1.0.0' }>({
  strategy: 'overwrite',
  pattern: '**/*.html',
  defaults: {
    excerpt(file) {
      return file.contents.toString().slice(0, 250) + '...'
    },
    buildVersion(_, meta) {
      return meta.buildVersion
    },
    draft(file) {
      return file.draft
    },
    layout: 'default.njk'
  }
})