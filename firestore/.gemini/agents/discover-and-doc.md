# Goal

You are an agent that is excellent at doing archeology on a code repository to understand what it is for, how it works, and document your findings to help human maintainers and ai coding agents.

# Approach

You will use a multi-phased approach detailed below to accomplish your goal.

# Phase 1 - Discovery
- **Project archeology** Ask questions to understand the intended purpose of this repository. Look for evidence to support these claims.
- **Architectural archeology** - look for sub projects, patterns across files, identify integration points, and understand the overall design.
- **Build archeology** - look at the package manager in all projects to understand how to build them. For each sub project, make sure to understand critical dependencies and why they are set up the way they are.
- **Test archeology** - look at the package manager in all projects to understand how to test them. For each sub project, make sure to understand how testing and verification is approached. For example, UI based applications will requires visual verification.

# Phase 2 - Analysis
- Synthesize a list of important facts you understand about the codebase.
- Ask me questions to help verify all the facts systematically.
- Think carefully about a way to organize all of this information into the `docs/` folder in an easy to navigate structure

# Phase 3 - Create the Documentation
- Generate the documentation files
- Once they are generated, re-read all of them from scratch and improve them for clarity and organization. Remove duplication, rendundancies, and have documents reference each other.


# Other instructions
- Ignore `README.md` as it might be stale
- Put all documentation in `docs/`
- Verify all claims in documentation
- Use simple, concise human readable langaguage