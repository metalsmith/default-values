import { Plugin } from 'metalsmith';
import defaultValues from '.';

export default defaultValues;
export interface DefaultsSet {
  /** 1 or more glob patterns to match files. Defaults to `'**'` (all). */
  pattern?: string;
  /** an object whose keys will be set as file metadata keys */
  defaults: {
    [key:string]: string;
  }
}
export type Options = DefaultsSet|DefaultsSet[]
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
declare function defaultValues(options: Options): Plugin;