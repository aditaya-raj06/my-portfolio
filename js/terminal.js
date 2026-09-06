/**
 * ==============================================================================
 * INTERACTIVE DEVELOPER TERMINAL
 * Allows technical visitors to interactively query profile info via a CLI interface
 * ==============================================================================
 */

import { portfolioData } from './portfolio-data.js';

export function initTerminal() {
  const terminalInput = document.getElementById('terminal-cli-input');
  const terminalBody = document.getElementById('terminal-output-area');
  const termChips = document.querySelectorAll('.term-chip');

  if (!terminalInput || !terminalBody) return;

  // Initial welcome message
  printLine(
    `Welcome to <span style="color: var(--accent-cyan); font-weight: bold;">${portfolioData.personal.name}'s Interactive CLI v2.4</span>. Type <span style="color: #f59e0b;">'help'</span> to explore available commands.`
  );

  terminalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';
      if (command) {
        handleCommand(command);
      }
    }
  });

  // Chip click handlers
  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    });
  });

  function handleCommand(cmd) {
    // Print input prompt line
    printPrompt(cmd);

    switch (cmd) {
      case 'help':
        printLine(`
Available commands:
  <span style="color: #38bdf8;">about</span>     - Summary of background and engineering focus
  <span style="color: #38bdf8;">skills</span>    - Core technical stack and proficiencies
  <span style="color: #38bdf8;">projects</span>  - Highlights of flagship production apps
  <span style="color: #38bdf8;">contact</span>   - Direct contact channels & booking
  <span style="color: #38bdf8;">whoami</span>    - Prints current guest session info
  <span style="color: #38bdf8;">clear</span>     - Clears the terminal screen
        `);
        break;

      case 'about':
        printLine(`
<span style="color: #a855f7; font-weight: bold;">${portfolioData.personal.name}</span> - ${portfolioData.personal.title}
📍 Location: ${portfolioData.personal.location}
🟢 Status: ${portfolioData.personal.availability}

${portfolioData.personal.tagline}
        `);
        break;

      case 'skills':
        const skillsSummary = portfolioData.skills
          .map(
            cat =>
              `  <span style="color: #06b6d4;">[${cat.category}]</span>\n  ${cat.items
                .map(i => `${i.name} (${i.level})`)
                .join(', ')}`
          )
          .join('\n\n');
        printLine(`\n${skillsSummary}\n`);
        break;

      case 'projects':
        const projectSummary = portfolioData.projects
          .map(
            p =>
              `  🚀 <span style="color: #f8fafc; font-weight: bold;">${p.title}</span>\n     ${p.impact}\n     Tech: ${p.technologies.join(', ')}`
          )
          .join('\n\n');
        printLine(`\n${projectSummary}\n`);
        break;

      case 'contact':
        printLine(`
📧 Email: <span style="color: #10b981;">${portfolioData.personal.email}</span>
🐙 GitHub: ${portfolioData.socials.github}
💼 LinkedIn: ${portfolioData.socials.linkedin}
🐦 Twitter/X: ${portfolioData.socials.twitter}
        `);
        break;

      case 'whoami':
        printLine(`guest@visitor-session: active (Permission level: read-only)`);
        break;

      case 'sudo':
        printLine(`Permission denied: You need Aditya's root SSH keys for that! 😉`);
        break;

      case 'clear':
        terminalBody.innerHTML = '';
        break;

      default:
        printLine(
          `Command not recognized: '<span style="color: #ef4444;">${cmd}</span>'. Type <span style="color: #f59e0b;">'help'</span> for a list of valid commands.`
        );
        break;
    }

    // Scroll to bottom of terminal
    const wrapper = terminalBody.parentElement;
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  }

  function printPrompt(cmd) {
    const p = document.createElement('div');
    p.innerHTML = `<span style="color: var(--accent-cyan);">visitor@portfolio:~$</span> <span style="color: #ffffff;">${cmd}</span>`;
    terminalBody.appendChild(p);
  }

  function printLine(html) {
    const div = document.createElement('div');
    div.style.marginBottom = '0.75rem';
    div.innerHTML = html.replace(/\n/g, '<br/>');
    terminalBody.appendChild(div);
  }
}
