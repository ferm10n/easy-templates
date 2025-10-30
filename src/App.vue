<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useTemplateParser } from './composables/useTemplateParser'

const defaultTemplate = `Hello {{receiver|text}}, this is {{sender|text}}

{{message|text}}

Contact me at <i>{{email|email}}</i> or visit {{website|url}}.

Phone: <b>{{phone|phone}}</b>, Order quantity: {{quantity|number}}`

const template = ref(defaultTemplate)
const { variables, output, error } = useTemplateParser(template)
const { copy, copied } = useClipboard({ source: output })
</script>

<template>
  <div class="container">
    <header>
      <h1>Easy Templates</h1>
      <p class="subtitle">Create dynamic text templates with ease</p>
    </header>

    <main>
      <section class="section">
        <label for="template" class="section-label">Template</label>
        <textarea
          id="template"
          v-model="template"
          class="template-input"
          placeholder="Enter your template with {{variable|type}} placeholders..."
          rows="6"
        />
        <p class="hint">
          Use <code>&#123;&#123;variable|type&#125;&#125;</code> syntax. 
          Types: text, number, phone, email, url
        </p>
        
        <div v-if="error" class="error-box">
          <strong>⚠️ Template Error:</strong> {{ error.message }}
        </div>
      </section>

      <section v-if="Object.keys(variables).length > 0" class="section">
        <h2 class="section-label">Fill in the values</h2>
        <div class="form-grid">
          <div v-for="variable in variables" :key="variable.name" class="form-field">
            <label :for="variable.name" class="field-label">
              {{ variable.name }}
            </label>
            
            <input
              :id="variable.name"
              v-model="variable.value"
              :type="variable.type === 'phone' ? 'tel' : variable.type"
              class="field-input"
            />
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-label">Output</h2>
          <button @click="copy()" class="copy-btn" :class="{ copied }">
            {{ copied ? '✓ Copied!' : 'Copy Output' }}
          </button>
        </div>
        <div class="output-box" v-html="output" />
      </section>
    </main>

    <footer>
      <p>
        Client-side only • No data leaves your browser
      </p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #646cff 0%, #42b883 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-label {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.template-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.template-input:focus {
  outline: none;
  border-color: #646cff;
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.hint code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.error-box {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.9rem;
}

.error-box strong {
  color: #ef4444;
}

.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-transform: capitalize;
}

.field-input {
  padding: 0.65rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.field-input:focus {
  outline: none;
  border-color: #646cff;
}

textarea.field-input {
  resize: vertical;
  font-family: inherit;
}

.output-box {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-height: 100px;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #535bf2;
  transform: translateY(-1px);
}

.copy-btn.copied {
  background: #42b883;
}

footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0.75rem;
  }

  h1 {
    font-size: 2rem;
  }

  .section {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .copy-btn {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: light) {
  .section {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .template-input,
  .field-input {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.2);
    color: #213547;
  }

  .output-box {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.15);
    color: #213547;
  }

  .subtitle {
    color: rgba(0, 0, 0, 0.6);
  }

  .section-label,
  .field-label {
    color: rgba(0, 0, 0, 0.9);
  }

  .hint {
    color: rgba(0, 0, 0, 0.5);
  }

  .hint code {
    background: rgba(0, 0, 0, 0.08);
  }

  .error-box {
    background: rgba(220, 38, 38, 0.08);
    border-color: rgba(220, 38, 38, 0.3);
    color: #b91c1c;
  }

  .error-box strong {
    color: #991b1b;
  }

  footer {
    color: rgba(0, 0, 0, 0.5);
    border-top-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
