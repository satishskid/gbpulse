# 🤝 Contributing to GreyBrain AI Pulse

Thank you for your interest in contributing to GreyBrain AI Pulse! We welcome contributions from the community and are excited to see what you'll bring to the project.

## 🌟 Ways to Contribute

- 🐛 **Bug Reports** - Help us identify and fix issues
- 💡 **Feature Requests** - Suggest new functionality
- 📝 **Documentation** - Improve our guides and documentation
- 🔧 **Code Contributions** - Submit bug fixes and new features
- 🎨 **Design Improvements** - Enhance UI/UX
- 🧪 **Testing** - Help improve test coverage
- 🌐 **Translations** - Make the platform accessible globally

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Firebase CLI (for deployment)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/satishskid/gbpulse.git
   cd greybrain-ai-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript** - Use TypeScript for all new code
- **ESLint** - Follow the configured ESLint rules
- **Prettier** - Use Prettier for code formatting
- **Conventional Commits** - Follow conventional commit format

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(telegram): add bot command for newsletter categories
fix(ui): resolve mobile responsive issues in header
docs(readme): update installation instructions
test(gemini): add unit tests for content generation
```

### Code Quality

- Write tests for new features
- Maintain test coverage above 80%
- Follow TypeScript best practices
- Document public APIs
- Use meaningful variable and function names

## 🔄 Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the Pull Request

1. **Create PR on GitHub**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch

2. **Fill out the PR template**
   - Describe what your PR does
   - Link any related issues
   - Add screenshots for UI changes
   - List any breaking changes

3. **Wait for review**
   - Address any feedback from reviewers
   - Make requested changes
   - Keep the PR updated with main branch

### PR Requirements

- ✅ All tests pass
- ✅ Code follows style guidelines
- ✅ Documentation is updated
- ✅ No merge conflicts
- ✅ Approved by at least one maintainer

## 🐛 Bug Reports

### Before Reporting

- Check if the bug has already been reported
- Try to reproduce the issue
- Gather relevant information

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

## 🧪 Testing Guidelines

### Types of Tests

- **Unit Tests** - Test individual functions/components
- **Integration Tests** - Test component interactions
- **E2E Tests** - Test complete user workflows

### Writing Tests

```typescript
// Example unit test
import { describe, it, expect } from 'vitest';
import { formatNewsletterForTelegram } from '../services/telegramService';

describe('TelegramService', () => {
  it('should format newsletter content correctly', () => {
    const mockData = { /* test data */ };
    const result = formatNewsletterForTelegram(mockData);
    
    expect(result).toContain('GreyBrain AI Pulse');
    expect(result).toMatch(/\d{4}-\d{2}-\d{2}/); // Date format
  });
});
```

### Running Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:e2e          # Run end-to-end tests
```

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up-to-date
- Follow markdown best practices

### Types of Documentation

- **README** - Project overview and quick start
- **User Manual** - End-user guide
- **Developer Manual** - Technical documentation
- **API Documentation** - Service and component APIs
- **Setup Guides** - Installation and configuration

## 🎨 Design Guidelines

### UI/UX Principles

- **Accessibility** - Follow WCAG guidelines
- **Responsive Design** - Mobile-first approach
- **Performance** - Optimize for speed
- **Consistency** - Use design system components
- **User-Centered** - Focus on user needs

### Design Tools

- **Figma** - For design mockups
- **Tailwind CSS** - For styling
- **React Components** - Reusable UI components

## 🌐 Internationalization

### Adding Translations

1. **Create language files**
   ```
   src/locales/
   ├── en.json
   ├── es.json
   └── fr.json
   ```

2. **Use translation keys**
   ```typescript
   import { useTranslation } from 'react-i18next';
   
   const { t } = useTranslation();
   return <h1>{t('welcome.title')}</h1>;
   ```

3. **Test translations**
   - Verify all text is translated
   - Check for layout issues
   - Test RTL languages if applicable

## 🔒 Security

### Security Guidelines

- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security practices
- Report security issues privately

### Reporting Security Issues

Email security issues to: security@greybrain.ai

**Do not** create public issues for security vulnerabilities.

## 📞 Getting Help

### Community Support

- 💬 **Discord**: [Join our community](https://discord.gg/greybrain)
- 🐛 **GitHub Issues**: [Report bugs and request features](https://github.com/satishskid/gbpulse/issues)
- 📧 **Email**: dev@greybrain.ai

### Maintainer Contact

- **Lead Developer**: @yourusername
- **Community Manager**: @community-manager
- **Security**: security@greybrain.ai

## 🏆 Recognition

### Contributors

We recognize all contributors in:
- README.md contributors section
- Release notes
- Annual contributor highlights
- Special recognition for significant contributions

### Contribution Levels

- 🥉 **Bronze**: 1-5 merged PRs
- 🥈 **Silver**: 6-15 merged PRs
- 🥇 **Gold**: 16+ merged PRs
- 💎 **Diamond**: Major feature contributions
- 🌟 **Maintainer**: Ongoing project maintenance

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Spam or excessive self-promotion
- Any conduct that would be inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@greybrain.ai.

## 🎉 Thank You!

Thank you for contributing to GreyBrain AI Pulse! Your contributions help make AI healthcare information more accessible and valuable for everyone.

---

**Happy Contributing! 🚀**

*Together, we're building the future of AI healthcare communication.*
