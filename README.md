```
    ██████╗ ███████╗███╗   ██╗ █████╗ ███╗   ██╗ ██████╗ 
    ██╔══██╗██╔════╝████╗  ██║██╔══██╗████╗  ██║██╔════╝ 
    ██████╔╝█████╗  ██╔██╗ ██║███████║██╔██╗ ██║██║  ███╗
    ██╔═══╝ ██╔══╝  ██║╚██╗██║██╔══██║██║╚██╗██║██║   ██║
    ██║     ███████╗██║ ╚████║██║  ██║██║ ╚████║╚██████╔╝
    ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 

     ██████╗ ██████╗  ██████╗ ██╗    ██╗████████╗██╗  ██╗
    ██╔════╝ ██╔══██╗██╔═══██╗██║    ██║╚══██╔══╝██║  ██║
    ██║  ███╗██████╔╝██║   ██║██║ █╗ ██║   ██║   ███████║
    ██║   ██║██╔══██╗██║   ██║██║███╗██║   ██║   ██╔══██║
    ╚██████╔╝██║  ██║╚██████╔╝╚███╔███╔╝   ██║   ██║  ██║
     ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝    ╚═╝   ╚═╝  ╚═╝

    ██╗      █████╗ ██████╗ 
    ██║     ██╔══██╗██╔══██╗
    ██║     ███████║██████╔╝
    ██║     ██╔══██║██╔══██╗
    ███████╗██║  ██║██████╔╝
    ╚══════╝╚═╝  ╚═╝╚═════╝ 

          ╔══════════════════════════════════════════╗
          ║   Scale Your E-Commerce Brand            ║
          ╚══════════════════════════════════════════╝

                    📈 PENANG MEDIA 📈
```

# Penang Growth Lab

**Free Tools & Resources for E-Commerce Brands**

*Calculators, AI-powered tools, and expert guides to help DTC brands grow profitably. Built by the team at Penang Media.*

[Next.js](https://nextjs.org/)
[React](https://react.dev/)
[TypeScript](https://www.typescriptlang.org/)
[Tailwind CSS](https://tailwindcss.com/)

[Claude AI](https://www.anthropic.com/)
[Vercel](https://vercel.com/)

[License](LICENSE)
[Status](https://growth.penangmedia.com)
[Version](package.json)

[Website](https://growth.penangmedia.com) · [Tools](https://growth.penangmedia.com/tools) · [Guides](https://growth.penangmedia.com/guides) · [Penang Media](https://www.penangmedia.com)

# Penang Growth Lab

A Next.js web app with AI-powered marketing tools. This guide is written for **complete beginners** who want to learn "vibe coding" — using AI assistants like **Cursor** or **Claude Code** to build and modify projects.

---

## Table of Contents

1. [What is Vibe Coding?](#what-is-vibe-coding)
2. [Getting the Project on Your Computer](#getting-the-project-on-your-computer)
3. [Running the App Locally](#running-the-app-locally)
4. [Making Changes with AI](#making-changes-with-ai)
5. [Cursor: Ask vs Agent Mode](#cursor-ask-vs-agent-mode)
6. [Claude Code: Custom Agents](#claude-code-custom-agents)
7. [What are MCPs?](#what-are-mcps)
8. [Saving Your Changes (Git Commits)](#saving-your-changes-git-commits)
9. [Pushing Live to Vercel](#pushing-live-to-vercel)
10. [Fixing Errors & Rolling Back](#fixing-errors--rolling-back)

---

## What is Vibe Coding?

**Vibe coding** means using AI to help you write code by describing what you want in plain English. You don't need to know how to code — you just need to explain what you want, and the AI writes the code for you.

Think of it like having a really smart coding assistant that:

- Understands your project
- Can read and edit files
- Runs commands for you
- Fixes errors when things break

---

## Getting the Project on Your Computer

### Option A: Using Cursor

1. **Install Cursor** — Download from [cursor.com](https://cursor.com) and install it
2. **Open Cursor** and press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows)
3. Type **"Git: Clone"** and press Enter
4. Paste the repository URL:
  ```
   https://github.com/YOUR-USERNAME/penang-growth-lab.git
  ```
5. Choose a folder on your computer to save it
6. Click **"Open"** when it asks if you want to open the cloned repository

### Option B: Using Claude Code (Terminal)

1. **Install Claude Code** — Follow instructions at [claude.ai/code](https://claude.ai/code)
2. Open your terminal
3. Navigate to where you want the project:
  ```bash
   cd ~/Projects
  ```
4. Clone the repository:
  ```bash
   git clone https://github.com/YOUR-USERNAME/penang-growth-lab.git
  ```
5. Enter the project folder:
  ```bash
   cd penang-growth-lab
  ```
6. Start Claude Code:
  ```bash
   claude
  ```

---

## Running the App Locally

Before you can see your changes, you need to run the app on your computer.

### Step 1: Install Dependencies

First time only — this downloads all the packages the project needs:

```bash
pnpm install
```

> **Don't have pnpm?** Install it first: `npm install -g pnpm`

### Step 2: Start the Development Server

```bash
pnpm dev
```

### Step 3: View Your App

Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

(If port 3000 is busy, it might use 3001 instead — check the terminal output)

### Step 4: Stop the Server

Press `Ctrl + C` in the terminal when you're done.

---

## Making Changes with AI

This is the fun part! Instead of writing code yourself, you just tell the AI what you want.

### In Cursor

1. Press `Cmd + L` (Mac) or `Ctrl + L` (Windows) to open the AI chat
2. Type what you want, for example:
  - *"Make the header background blue"*
  - *"Add a new button that says 'Contact Us'"*
  - *"Fix the error on line 45"*
3. The AI will suggest changes — click **"Accept"** to apply them

### In Claude Code

1. Just type your request in the terminal, for example:
  - *"Change the homepage title to 'Welcome to Growth Lab'"*
  - *"Add a footer with social media links"*
2. Claude will make the changes and show you what it did

### Tips for Better Results

- **Be specific**: "Make the button bigger" → "Make the button 50% wider and add more padding"
- **Reference files**: "In the header component, change the logo"
- **Describe the problem**: "The page is blank when I click on Tools — can you fix it?"

---

## Cursor: Ask vs Agent Mode

Cursor has two main modes for working with AI. Here's when to use each:

### Ask Mode (the default)

**What it does**: Answers questions and suggests code changes, but YOU decide what to apply.

**When to use it**:

- Learning how something works ("How does this function work?")
- Getting code suggestions you want to review first
- Making small, careful changes
- When you want more control

**How to use it**:

- Press `Cmd + L` to open chat
- Ask your question or describe what you want
- Review the suggestion and click "Accept" or "Reject"

### Agent Mode

**What it does**: The AI takes control and makes changes automatically. It can edit multiple files, run commands, and fix errors on its own.

**When to use it**:

- Big changes across many files ("Add dark mode to the whole app")
- When you trust the AI to figure out the details
- Complex tasks that need multiple steps
- When you want things done fast

**How to use it**:

1. Press `Cmd + L` to open chat
2. Click the mode dropdown (usually says "Ask" or "Normal")
3. Select **"Agent"**
4. Describe what you want
5. Watch the AI work — it will show you what it's doing

### Which One Should I Use?


| Situation                                 | Use This |
| ----------------------------------------- | -------- |
| "What does this code do?"                 | Ask      |
| "Add a single button"                     | Ask      |
| "Rebuild the entire navigation"           | Agent    |
| "Fix all the TypeScript errors"           | Agent    |
| "I'm not sure what I want yet"            | Ask      |
| "Build me a contact form with validation" | Agent    |


---

## Claude Code: Custom Agents

Claude Code can use **specialized agents** for different tasks. These are like expert assistants for specific jobs.

### What Are Custom Agents?

Think of them as specialists:

- A **code reviewer** agent checks your code for problems
- An **explorer** agent helps you understand unfamiliar codebases
- A **general purpose** agent handles complex multi-step tasks

### How to Use Them

Claude Code automatically picks the right agent for the job. But you can also be explicit:

```
Use a thorough exploration to find all the API routes in this project
```

```
Review the code I just wrote for security issues
```

### Common Agent Types


| Agent               | What It Does                                |
| ------------------- | ------------------------------------------- |
| **General Purpose** | Complex tasks, research, multi-step work    |
| **Explorer**        | Finding files, understanding code structure |


### Tips

- Let Claude choose the agent — it usually picks the right one
- For complex tasks, describe what you want in detail
- If you're not getting good results, try rephrasing your request

---

## What are MCPs?

**MCP** stands for **Model Context Protocol**. In simple terms, MCPs let the AI connect to external tools and services.

### Why Do MCPs Matter?

Without MCPs, the AI can only:

- Read your code
- Edit files
- Run terminal commands

With MCPs, the AI can also:

- Browse the web
- Check your live website
- Connect to databases
- Use external APIs

### MCPs in This Project

This project has several MCPs configured:


| MCP                    | What It Does                                   |
| ---------------------- | ---------------------------------------------- |
| **cursor-ide-browser** | Lets AI browse websites and test your frontend |
| **vercel**             | Connects to your Vercel deployment             |
| **stripe**             | Interacts with Stripe for payments             |
| **context7**           | Gets up-to-date documentation for libraries    |


### How to Use Them

You don't need to do anything special! Just ask for what you want:

- *"Check if the homepage looks correct on the live site"*
- *"Get the latest Next.js documentation for server components"*
- *"Test the login form in the browser"*

The AI will automatically use the right MCP.

---

## Saving Your Changes (Git Commits)

When you make changes, you need to **save** them to Git. This creates a checkpoint you can go back to if something breaks.

### What is a Commit?

Think of a commit like saving a video game. It's a snapshot of your code at a specific moment. You can always go back to any previous save.

### How to Commit in Cursor

**Option 1: Ask the AI**

```
Commit my changes with the message "Added contact form"
```

**Option 2: Use the Source Control Panel**

1. Click the **Source Control** icon in the left sidebar (looks like a branch)
2. See your changed files listed
3. Type a message describing what you changed
4. Click the **checkmark** to commit

### How to Commit in Claude Code

Just tell Claude what to do:

```
Commit all my changes with a descriptive message
```

Claude will:

1. Check what files changed
2. Write a good commit message
3. Create the commit for you

### Good Commit Messages


| Bad           | Good                                   |
| ------------- | -------------------------------------- |
| "fixed stuff" | "Fix broken link on homepage"          |
| "changes"     | "Add email validation to contact form" |
| "update"      | "Update header to include new logo"    |


---

## Pushing Live to Vercel

This project is hosted on **Vercel**. When you push your code to GitHub, Vercel automatically builds and deploys it.

### The Workflow

```
Make changes → Commit → Push to GitHub → Vercel deploys automatically
```

### How to Push Your Changes

**In Cursor:**

Ask the AI:

```
Push my commits to the remote repository
```

Or use the terminal:

```bash
git push
```

**In Claude Code:**

Just say:

```
Push my changes to GitHub
```

### Checking Your Deployment

1. Go to [vercel.com](https://vercel.com) and log in
2. Find your project
3. See the deployment status:
  - 🟢 **Ready** = Your site is live
  - 🟡 **Building** = Vercel is deploying your changes
  - 🔴 **Error** = Something broke (see next section)

### Preview Deployments

When you push to a branch (not main), Vercel creates a **preview URL**. This lets you test changes before they go live.

---

## Fixing Errors & Rolling Back

Sometimes things break. Here's how to fix them.

### Step 1: Check What Went Wrong

**On Vercel:**

1. Go to your project on [vercel.com](https://vercel.com)
2. Click on the failed deployment
3. Click **"View Build Logs"**
4. Look for red error messages

**Common Errors:**


| Error              | What It Means                          |
| ------------------ | -------------------------------------- |
| `Module not found` | A package is missing or imported wrong |
| `Type error`       | TypeScript found a problem             |
| `Build failed`     | Something in your code broke the build |


### Step 2: Fix the Error

**Ask the AI for help!**

In Cursor or Claude Code:

```
The Vercel build is failing with this error: [paste the error here]
Can you fix it?
```

The AI will:

1. Understand the error
2. Find the problem in your code
3. Fix it for you

### Step 3: If You Can't Fix It — Roll Back

If everything is broken and you need the old version back:

**Option A: Revert on Vercel (Fastest)**

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **"Deployments"**
3. Find the last working deployment (green checkmark)
4. Click the **three dots** menu
5. Select **"Promote to Production"**

This instantly puts the old version back live while you fix the code.

**Option B: Revert in Git**

Ask the AI:

```
The last commit broke everything. Can you revert to the previous commit?
```

Or manually:

```bash
# See recent commits
git log --oneline -5

# Revert the last commit (keeps changes as uncommitted)
git revert HEAD

# Push the revert
git push
```

### Step 4: Test Locally First!

**Pro tip**: Always test your changes locally before pushing:

1. Run `pnpm dev`
2. Check your changes in the browser
3. Look for errors in the terminal
4. Only push when everything works

---

## Quick Reference

### Common Commands


| What You Want       | Command                        |
| ------------------- | ------------------------------ |
| Install packages    | `pnpm install`                 |
| Run locally         | `pnpm dev`                     |
| Stop server         | `Ctrl + C`                     |
| See changed files   | `git status`                   |
| Commit changes      | `git commit -m "your message"` |
| Push to GitHub      | `git push`                     |
| Pull latest changes | `git pull`                     |


### Common AI Requests

```
"Run the app locally"
"What does this file do?"
"Add a button that does X"
"Fix this error: [paste error]"
"Commit my changes"
"Push to GitHub"
"The build is failing, can you help?"
```

### Getting Help

- **Cursor**: Press `Cmd + L` and ask anything
- **Claude Code**: Just type your question
- **Vercel Issues**: Check the build logs for errors
- **Still Stuck**: Describe the problem in detail and ask the AI

---

## You've Got This! 🎉

Vibe coding is about **experimenting**. Don't be afraid to:

- Try things and see what happens
- Ask the AI "dumb" questions (there aren't any!)
- Break things (you can always roll back)
- Learn as you go

The AI is here to help. If something doesn't work, just describe what went wrong and ask for help. Happy coding!