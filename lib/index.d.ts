import Metalsmith, { Plugin, File, Files } from 'metalsmith';

export default defaultValues;

export type DefaultSetter<FileMeta extends File = File> = (
  currentFile: Readonly<FileMeta>, 
  currentPath: Readonly<string>,
  files:Readonly<Files>,
  metalsmith:Readonly<Metalsmith>
) => any

export interface DefaultsSet<FileMeta extends File = File> {
  /** an object whose keys will be set as file metadata keys */
  defaults: Record<string, DefaultSetter<FileMeta>|string|boolean|number|object>
  /**
   * 1 or more glob patterns to match files.
   * @default '**'
   **/
  pattern?: string;
  /**
   * Strategy to handle setting defaults to keys that are aleady defined.
   * @default 'keep'
   */
  strategy?: 'keep'|'overwrite'
}
export type Options<FileMeta extends File = File> = DefaultsSet<FileMeta>|DefaultsSet<FileMeta>[]
/**
 * Set `defaults` or _computed values_ to file metadata matching `pattern`'s.
 * 
 * @example
 * metalsmith.use(defaultValues([{
 *  pattern: 'posts/*.md',
 *  defaults: {
 *    layout: 'post.hbs',
 *    draft: false,
 *    'some.nested.property': true,
 *    isodate(post, postPath, allFiles, metalsmith) {
 *      return new Date(post.stats.ctime).toISOString()
 *    }
 *  }
 *}))
 **/
declare function defaultValues<FileMeta extends File = File>(options: Options<FileMeta>): Plugin;