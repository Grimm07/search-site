# User Input Handling Guide

## Overview
This guide covers best practices for handling user input in the search-site project using our core libraries.

## Input Types and Handling

### Text Input
```typescript
// Basic text input with React Hook Form
const TextInput = () => {
  const { register } = useForm();
  return (
    <input
      {...register("searchField", {
        required: "This field is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
        maxLength: { value: 100, message: "Maximum 100 characters" }
      })}
    />
  );
};
```

### File Upload Handling
```typescript
const FileUploadHandler = () => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        throw new Error('Invalid file type');
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large');
      }
    }
  };
};
```

### Real-time Validation
```typescript
const LiveValidation = () => {
  const { watch, formState } = useForm({
    mode: 'onChange' // Enable real-time validation
  });
  
  // Watch input changes
  const searchTerm = watch('search');
  
  useEffect(() => {
    const debounceValidation = setTimeout(() => {
      // Perform validation logic
    }, 300);
    
    return () => clearTimeout(debounceValidation);
  }, [searchTerm]);
};
```

## Input Sanitization

### Using DOMPurify
For any HTML content or rich text input:
```typescript
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);
```

### Form Validation
We use React Hook Form for form validation:
```typescript
import { useForm } from 'react-hook-form';

const { register, handleSubmit, errors } = useForm();
```

## Form Components Best Practices

### Accessible Form Controls
- Use semantic HTML elements (`<label>`, `<fieldset>`, `<legend>`)
- Include ARIA attributes where necessary
- Provide clear error messages
- Ensure keyboard navigation support

```typescript
const AccessibleInput = () => {
  return (
    <div>
      <label htmlFor="search" className="sr-only">Search term</label>
      <input
        id="search"
        type="search"
        aria-describedby="search-description"
        aria-required="true"
      />
      <div id="search-description">Enter keywords to search</div>
    </div>
  );
};
```

### Error Handling and User Feedback
- Display validation errors inline
- Use color and icons to indicate status
- Provide clear resolution steps
- Maintain form state during errors

## Rate Limiting and Throttling

### Client-side Throttling
```typescript
const throttleSearchInput = (callback: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};
```

## Search Query Processing

### Query Sanitization
- Remove special characters that could affect search
- Trim whitespace
- Convert to lowercase for consistency

```typescript
const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '');
};
```

## Security Considerations

### XSS Prevention
- Always sanitize HTML content before rendering
- Use React's built-in XSS protection
- Avoid using dangerouslySetInnerHTML unless necessary

### SQL Injection Prevention
- Use parameterized queries with Prisma
- Never directly interpolate user input into queries

## Error Handling
```typescript
try {
  // Process user input
} catch (error) {
  // Log error safely without exposing sensitive info
  console.error('Input processing error:', error.message);
}
```

## Best Practices
1. Validate input on both client and server
2. Use TypeScript types to ensure type safety
3. Implement rate limiting for API endpoints
4. Log validation failures for security monitoring
5. Provide clear user feedback for invalid inputs

## Testing Input Handling

### Unit Testing
```typescript
describe('Input Validation', () => {
  it('should validate search input correctly', () => {
    const input = 'test@example.com';
    expect(validateEmail(input)).toBeTruthy();
  });
});
```

### Integration Testing
- Test form submission flows
- Verify error handling
- Check sanitization results
- Validate accessibility requirements
`