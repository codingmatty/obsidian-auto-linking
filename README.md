# Obsidian Auto Linking Plugin

This is an [Obsidian](https://obsidian.md/) plugin that makes it easy to convert common text patterns into links in previews.

It's useful for things like Jira ticket labels or Github issues.

Inspired by the similar feature in [Github's](github.com) [autolink reference feature](https://github.blog/2019-10-14-introducing-autolink-references/)

## Usage

1. Provide a label and click the `+` button.
1. Provide a pattern, using standard [Javascript Regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
1. Provide a link, using `{pattern}` to insert the matched pattern into the link.

## Example

* Pattern: `JIRA-[\d]+`
* Link: `https://team.atlassian.net/browse/{pattern}`
* Will convert "JIRA-123" to a link in the markdown preview
```
<a href="https://team.atlassian.com/browse/JIRA-123" target="_blank">SHIP-123</a>
```
