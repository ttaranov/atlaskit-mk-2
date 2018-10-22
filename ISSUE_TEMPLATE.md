### Prerequisites

Checked that your issue isn't already filed: 
* [https://bitbucket.org/atlassian/atlaskit-mk-2/issues?status=new&status=open](https://bitbucket.org/atlassian/atlaskit-mk-2/issues?status=new&status=open)

* If you have access to Atlaskit Jira project, use this query: "project = AK and issuetype = Bug ORDER BY createdDate"

### Description

[Description of the issue]

Add a link to a codepen example using [this codesandbox](http://go.atlassian.com/ak-sandbox) as starting point.

### Steps to reproduce

_Either_

1. [First Step]
2. [Second Step]
3. [and so on...]

_Or_

Create a gif using [this](http://gifbrewery.com/)  
_If needed, show keystrokes using [this](https://github.com/keycastr/keycastr)_

### Expected behavior

[What do you expect to happen?]

### Actual behavior

[What does actually happen?]

### Level of consistency

[What percentage of the time does it reproduce?]

### Information

| Components | Version | Did this work in previous versions of the Atlaskit component? | Browser and OS information |
| ---------- | :------ | :------------------------------------------------------------ | :------------------------- |
|            |         | Yes/ No/ I don't know                                         |                            |

* To get the component version:
  [You can get this information by running `yarn ls | grep '@atlaskit'` or `npm list | grep '@atlaskit'` from the command line.]

* To get the browser version, got to http://www.whatsmybrowser.org/ and copy the link
* Any additional information, configuration or data that might be necessary to reproduce the issue.

### Jira markdown template

```
h2.Description

Description of the issue
Add a link to a codepen example using [this codesandbox](http://go.atlassian.com/ak-sandbox) as starting point.

h2.Steps to Reproduce

Either
# First step
# Second step
...

Or
Create a gif using -> http://gifbrewery.com/  
If needed, show keystrokes using -> https://github.com/keycastr/keycastr

h2.Expected behavior
What do you expect to happen?

h2.Actual behavior
What does actually happens?

h2.Level of Consistency
What percentage of the time does it reproduce?

h2.Information
|| Component(s)|| Version || Did this work in previous versions of the Atlaskit component? || Browser and OS information
 |            |            |Yes /  No/  I don't know | |

* To get the component version:
{code}yarn ls | grep '@atlaskit' or npm list | grep '@atlaskit'{code}

from the command line.


* To get the browser version, got to http://www.whatsmybrowser.org/ and copy the link
Any additional information, configuration or data that might be necessary to reproduce the issue.
```
