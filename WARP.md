# Warp AI Agent Rules for cibus-dummy

## Git Operations
- **when**: "performing git operations (commits, branches, merges, etc.)"
  **then**: "prefer using MCP GitHub tools over raw git commands when available"
  
- **when**: "creating branches"  
  **then**: "use MCP `create_branch` tool instead of `git checkout -b`"
  
- **when**: "making commits"
  **then**: "use MCP GitHub tools like `create_or_update_file` or `push_files` instead of raw git add/commit/push"
  
- **when**: "creating pull requests"
  **then**: "use MCP `create_pull_request` tool instead of manual git operations + GitHub web interface"
  
- **when**: "merging branches"
  **then**: "use MCP `merge_pull_request` tool instead of raw git merge commands"
  
- **when**: "checking repository status or history"
  **then**: "use MCP tools like `list_commits`, `get_commit`, `list_branches` instead of git log/status commands"

## Rationale
MCP GitHub tools provide better integration with GitHub's features, handle authentication automatically, and provide more structured responses that can be better processed by AI agents.