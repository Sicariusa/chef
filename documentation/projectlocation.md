Searching the codebase for where built projects are saved.


[3 tools called]


Checking the deployment endpoint and download functionality:


[3 tools called]


Checking where the download saves the file:


[1 tool called]


Where projects are saved after being built:

## Project Storage Locations

### 1. **During Development (In-Browser)**
Projects run in a WebContainer (browser-based container). Files are stored in memory in the browser, not on disk.

### 2. **When Deployed**
When you click "Deploy", the built project is:
- Built into a `dist` folder
- Zipped and sent to Convex's hosting API
- Deployed to: `{deploymentName}.convex.app`

The deployment endpoint is in:

```34:38:app/lib/.server/deploy-simple.ts
    const response = await fetch(`${PROVISION_HOST}/api/hosting/deploy?deploymentName=${deploymentName}`, {
      method: 'POST',
      headers,
      body: file,
    });
```

### 3. **When Downloaded**
When you click "Download Code", the project is:
- Zipped with all project files
- Downloaded to your browser's default download location (typically `~/Downloads` on Mac/Linux or `C:\Users\<username>\Downloads` on Windows)

The download functionality is in:

```541:607:app/lib/stores/workbench.client.ts
  async downloadZip(args: { convexProject: ConvexProject | null }) {
    const zip = new JSZip();
    const files = this.files.get();

    // Get the project name from the description input, or use a default name
    const projectName = (description.value ?? 'project').toLocaleLowerCase().split(' ').join('_');
    // ... creates zip with all files ...
    // Generate the zip file and save it
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${projectName}.zip`);
  }
```

**Summary:**
- Built projects are deployed to Convex hosting (accessible via URL)
- Downloaded projects are saved to your browser's default download folder
- During development, projects exist only in the browser's WebContainer memory