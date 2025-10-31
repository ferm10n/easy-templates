import { computed, ref, watch, type Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'phone' | 'email' | 'url'
  value: string
}

export interface TemplateError {
  message: string
  position?: number
}

const VALID_TYPES = ['text', 'number', 'phone', 'email', 'url']

export function useTemplateParser(template: Ref<string>) {
  const variables = useLocalStorage<Record<string, TemplateVariable>>('easy-templates-variables', {})
  const error = ref<TemplateError | null>(null)

  watch(template, (templateValue) => {
    const regex = /\{\{([^|]+)\|([^}]+)\}\}/g
    const matches = [...templateValue.matchAll(regex)]
    const seen = new Set<string>()
    const newVars: Record<string, TemplateVariable> = {}
    let err: TemplateError | null = null

    // Check for malformed brackets
    const openBrackets = (templateValue.match(/\{\{/g) || []).length
    const closeBrackets = (templateValue.match(/\}\}/g) || []).length
    
    if (openBrackets !== closeBrackets) {
      err = { message: 'Mismatched {{ }} brackets in template' }
      error.value = err
      return
    }

    // Check for pipes without proper format
    const hasIncompleteVariable = /\{\{[^}]*\}\}/.test(templateValue) && 
                                  /\{\{(?![^|]+\|[^}]+\}\})/.test(templateValue)
    if (hasIncompleteVariable) {
      err = { message: 'Invalid variable format. Use {{name|type}}' }
      error.value = err
      return
    }

    for (const match of matches) {
      const name = match[1].trim()
      const type = match[2].trim()

      // Validate type
      if (!VALID_TYPES.includes(type)) {
        err = { 
          message: `Invalid type "${type}". Valid types: ${VALID_TYPES.join(', ')}`,
          position: match.index
        }
        error.value = err
        return
      }

      // Only add unique variables, preserve existing values
      if (!seen.has(name)) {
        seen.add(name)
        newVars[name] = {
          name,
          type: type as TemplateVariable['type'],
          value: variables.value[name]?.value || ''
        }
      }
    }

    error.value = null
    variables.value = newVars
  }, { immediate: true })

  const output = computed(() => {
    if (error.value) return ''
    
    let result = template.value
    
    Object.values(variables.value).forEach(variable => {
      const value = variable.value || ''
      const regex = new RegExp(`\\{\\{${variable.name}\\|[^}]+\\}\\}`, 'g')
      result = result.replace(regex, value)
    })
    
    return result
  })

  return {
    variables,
    output,
    error
  }
}
