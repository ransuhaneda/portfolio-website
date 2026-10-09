# Project documentation

`AGENTS.md` is the agent entry point. This directory holds maintained project rules and guides, not task logs.

## Rule owners

| Subject                                                                      | Owner                                   |
| ---------------------------------------------------------------------------- | --------------------------------------- |
| Local tooling, development boundaries, checks, and artifact locations        | [Development](development.md)           |
| Application structure, route configuration, metadata, and runtime boundaries | [Architecture](architecture.md)         |
| Editable sources, generation, blog contracts, evidence, and resume privacy   | [Content](content.md)                   |
| Audience, outcomes, and portfolio terminology                                | [Positioning](../CONTEXT.md)            |
| Tokens, wrappers, responsive sizing, and component styles                    | [Styling](styling.md)                   |
| Branch history, release preflight, tags, publication, and branch cleanup     | [Git workflow](git-workflow.md)         |
| Host behavior, deployment approval, and deferred CMS containment             | [Deployment](deployment.md)             |
| Independent launch acceptance gates                                          | [Launch checklist](launch-checklist.md) |

## Authority and maintenance

Current user instructions take precedence. `AGENTS.md` routes work to the owner guides above. Each owner defines its subject's standing rules; update that owner rather than copying rules into several documents. Source code and configuration establish implemented behavior. If a guide conflicts with the checkout, report and reconcile the difference instead of treating historical prose as proof.

[README](../README.md) is the human introduction. [Positioning](../CONTEXT.md) remains the content brief. `agent-generated-docs/` holds working plans, historical audits, evidence, and handoffs. Those records describe their captured source, not current acceptance or an automatic backlog. Old maintenance, checklist, and Git paths redirect to their maintained owners for existing references.

Use short, active technical English. Preserve commands, identifiers, and user copy. Keep working notes in `agent-generated-docs/`; keep reusable rules here. The [Figma variable export](portfolio-project-design-variables.json) is design input; implemented tokens live in `src/styles/tokens.scss`.
