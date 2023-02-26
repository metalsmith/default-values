import { Plugin, File } from 'metalsmith';

export default defaultValues;

export type DefaultSetter<FileMeta, GlobalMeta> = (data:FileMeta, metadata: GlobalMeta) => any
export interface DefaultsSet<FileMeta = File, GlobalMeta = {[key:string]:any}> {
  /** an object whose keys will be set as file metadata keys */
  defaults: {
    [key:string]: DefaultSetter<FileMeta, GlobalMeta>|string|boolean|number|Object;
  }
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
export type Options<FileMeta, GlobalMeta> = DefaultsSet<FileMeta, GlobalMeta>|DefaultsSet<FileMeta, GlobalMeta>[]
/**
 * Set `defaults` to file metadata matching `pattern`'s.
 * 
 * @example
 * metalsmith.use(defaultValues({
    pattern: 'posts/*.md',
    defaults: {
      layout: 'post.hbs',
      draft: false,
      date(post) {
        return post.stats.ctime
      }
    }
  }))
 **/
declare function defaultValues<FileMeta = File, GlobalMeta = {[key:string]:any}>(options: Options<FileMeta, GlobalMeta>): Plugin;