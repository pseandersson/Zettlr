// FSAL types available in both main process and renderer process

export interface ProjectSettings {
  title: string
  profiles: string[]
  filters: string[]
  cslStyle: string
  templates: {
    tex: string
    html: string
  }
}

/**
 * Declares an event that happens on the FSAL
 */
export interface FSALHistoryEvent {
  event: 'add'|'change'|'remove'
  path: string
  timestamp: number
}

/**
 * An interface containing meta information all
 * descriptors should provide.
 */
export interface FSMetaInfo {
  path: string // absolutePath
  dir: string // path.dirname(absolutePath)
  name: string // path.basename(absolutePath)
  root: boolean // Whether the file/dir is a root (relative to Zettlr)
  type: 'file' | 'directory' | 'code' | 'other'
  size: number
  modtime: number
  creationtime: number
}

export type SortMethod = 'name-up'|'name-down'|'time-up'|'time-down'

/**
 * The FSAL directory descriptor
 */
export interface DirDescriptor extends FSMetaInfo {
  // Settings are properties that must be persisted separately in a
  // .ztr-directory file, since they are not bound to the directory.
  settings: {
    sorting: SortMethod
    icon: string|null
    project: ProjectSettings|null
  }
  type: 'directory'
  isGitRepository: boolean
  children: Array<MDFileDescriptor|DirDescriptor|CodeFileDescriptor|OtherFileDescriptor>
  dirNotFoundFlag?: boolean // If the flag is set & true this directory has not been found
}

/**
 * The FSAL Markdown file descriptor
 */
export interface MDFileDescriptor extends FSMetaInfo {
  ext: string
  id: string
  type: 'file'
  tags: string[]
  links: string[] // Any outlinks declared in the file
  bom: string // An optional BOM
  wordCount: number
  charCount: number
  firstHeading: string|null
  yamlTitle: string|undefined
  frontmatter: any|null
  linefeed: string
  modified: boolean
}

/**
 * The FSAL code file descriptor (.tex, .yml)
 */
export interface CodeFileDescriptor extends FSMetaInfo {
  ext: string
  type: 'code'
  bom: string // An optional BOM
  linefeed: string
  modified: boolean
}

/**
 * The FSAL other (non-MD and non-Tex) file descriptor
 */
export interface OtherFileDescriptor extends FSMetaInfo {
  root: false // Attachments can never be roots
  type: 'other'
  ext: string
}

export type AnyDescriptor = DirDescriptor | MDFileDescriptor | CodeFileDescriptor | OtherFileDescriptor
export type MaybeRootDescriptor = DirDescriptor | MDFileDescriptor | CodeFileDescriptor

export interface FSALStats {
  minChars: number
  maxChars: number
  minWords: number
  maxWords: number
  sumChars: number
  sumWords: number
  meanChars: number
  meanWords: number
  sdChars: number
  sdWords: number
  chars68PercentLower: number
  chars68PercentUpper: number
  chars95PercentLower: number
  chars95PercentUpper: number
  words68PercentLower: number
  words68PercentUpper: number
  words95PercentLower: number
  words95PercentUpper: number
  mdFileCount: number
  codeFileCount: number
  dirCount: number
}
