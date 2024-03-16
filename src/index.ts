
import firstNewline from './rules/first-newline/rule'
import importOrder from './rules/import-order/rule'
import noImportGaps from './rules/no-import-gaps/rule'
import preferAliased from './rules/prefer-aliased/rule'

export default {
  'first-newline': firstNewline,
  'import-order': importOrder,
  'no-import-gaps': noImportGaps,
  'prefer-aliased': preferAliased,
}
