# Easy Templates

A simple, client-side text template creation tool. Create dynamic templates with variable placeholders and generate customized output instantly.

## Features

### Template System
- **Template Syntax**: Use `{{variable|type}}` syntax to define template variables
  - Example: `Hello {{receiver|text}}, this is {{sender|text}}`
- **Variable Types**: Support for different input types
  - `text`: Single-line text input
  - `number`: Numeric input
  - `phone`: Phone number input
  - `email`: Email input
  - `url`: URL input

### Real-time Preview
- As you enter values in the form fields, the output updates automatically
- The output preserves any HTML formatting from the template

### Dynamic Form Generation
- Form fields are automatically generated based on template variables
- Each `{{variable|type}}` creates a corresponding form input
- Clean, intuitive interface for entering values

### Copy to Clipboard
- One-click copy button to copy the generated output
- Uses VueUse's `useClipboard` for reliable clipboard operations

### Default Template
- Ships with a demo template so users can immediately see how it works
- Demonstrates various input types and HTML formatting

### User Experience
- Mobile-first, responsive design
- Dark mode by default
- Clean, simple, and professional interface
- No data leaves your browser - everything runs client-side

## Tech Stack

- Vue 3 (Composition API with `<script setup>`)
- TypeScript
- Vite
- VueUse
- Deploys to GitHub Pages

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Template Format

Templates use double curly braces with a pipe separator for type:

```
{{variableName|type}}
```

### Supported Types
- `text`: Single-line text input
- `number`: Numeric input
- `phone`: Phone number input
- `email`: Email input
- `url`: URL input

### Example Templates

**Simple greeting:**
```
Hello {{name|text}}! Welcome to {{company|text}}.
```

**Email template:**
```
Dear {{recipient|text}},

{{message|text}}

Best regards,
{{sender|text}}
{{email|email}}
```

**HTML formatted:**
```
Hello <b>{{receiver|text}}</b>, this is <i>{{sender|text}}</i>
```

## How It Works

1. Enter or paste your template with `{{variable|type}}` placeholders
2. Form fields are automatically generated for each variable
3. Fill in the form fields with your values
4. The output updates in real-time as you type
5. Click "Copy Output" to copy the result to your clipboard
6. Paste the output wherever you need it
